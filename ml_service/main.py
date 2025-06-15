from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from vectorizer import Vectorizer # Your custom vectorizer module
import psycopg2
from psycopg2 import extras # For dictionary cursor
import os
from dotenv import load_dotenv
import google.generativeai as genai # For Google Gemini API

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set. Please check your .env file.")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set. Please check your .env file.")

# --- FastAPI App Initialization ---
app = FastAPI(title="ML RAG Service for Social Network")

# Initialize the Vectorizer once when the app starts
vectorizer = Vectorizer()

# Initialize Google Gemini client
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-pro')
print("Google Gemini model configured.")

class EmbedTextRequest(BaseModel):
    text: str

class EmbedTextResponse(BaseModel):
    embedding: list[float]


class RAGSearchRequest(BaseModel):
    query: str
    user_latitude: float = 0.0 # Optional: for location-aware search
    user_longitude: float = 0.0 # Optional: for location-aware search
    radius_meters: float = 0.0 # Optional: search radius in meters
    limit: int = 5 # Number of top profiles to retrieve


class ProfileResult(BaseModel):
    id: int
    name: str
    email: str
    interests: list[str] # Interests will be parsed from JSONB
    distance_meters: float | None = None # Only if location search is done

class RAGSearchResponse(BaseModel):
    generated_summary: str
    profiles: list[ProfileResult]


# --- Database Connection ---
def get_db_connection():
    try:
        # Connect to the PostgreSQL database using the DATABASE_URL from .env
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Could not connect to database")


# --- API Endpoints ---

@app.post("/embed", response_model=EmbedTextResponse)
async def embed_text(request: EmbedTextRequest):
    """
    Generates an embedding vector for the given text.
    Used primarily for indexing (populating profile_embedding column).
    """
    try:
        embedding = vectorizer.embed_text(request.text)
        return EmbedTextResponse(embedding=embedding)
    except Exception as e:
        print(f"Error embedding text: {e}")
        raise HTTPException(status_code=500, detail=f"Embedding failed: {e}")


@app.post("/rag_search", response_model=RAGSearchResponse)
async def rag_search(request: RAGSearchRequest):
    """
    Performs a RAG search for profiles based on a natural language query,
    optionally filtered by location.
    """
    query_embedding = vectorizer.embed_text(request.query)
    if not query_embedding:
        raise HTTPException(status_code=400, detail="Could not generate embedding for query.")

    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=extras.RealDictCursor)


        sql_query = """
        SELECT
            p.id,
            p.name,
            p.email,
            p.interests,
            (p.profile_embedding <=> %s::vector) AS embedding_distance, -- Cosine distance
            ST_Distance(
                l.location,
                ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography
            ) AS distance_meters
        FROM
            profiles p
        JOIN
            geolocation l ON p.id = l.profile_id
        WHERE
            p.profile_embedding IS NOT NULL
        """
        params = [query_embedding, request.user_longitude, request.user_latitude]

        if request.radius_meters > 0:
            sql_query += """
            AND ST_DWithin(
                l.location,
                ST_SetSRID(ST_MakePoint(%s, %s), 4326)::geography,
                %s
            )
            """
            params.extend([request.user_longitude, request.user_latitude, request.radius_meters])


        sql_query += """
        ORDER BY
            embedding_distance ASC -- Lower distance means higher semantic similarity
        LIMIT %s;
        """
        params.append(request.limit)
        cur.execute(sql_query, params)
        retrieved_profiles_data = cur.fetchall()

        if not retrieved_profiles_data:
            return RAGSearchResponse(generated_summary="No relevant profiles found based on your query and criteria.", profiles=[])

        context_profiles_text = []
        response_profiles = []

        for profile in retrieved_profiles_data:
            interests_list = profile["interests"] if profile["interests"] else [] # Ensure it's a list

            context_profiles_text.append(
                f"Profile ID: {profile['id']}\n"
                f"Name: {profile['name']}\n"
                f"Email: {profile['email']}\n"
                f"Interests: {', '.join(interests_list)}\n"
                f"Distance: {profile['distance_meters']:.2f} meters\n"
                f"---" # Separator for each profile in the context
            )
            response_profiles.append(
                ProfileResult(
                    id=profile['id'],
                    name=profile['name'],
                    email=profile['email'],
                    interests=interests_list,
                    distance_meters=profile['distance_meters']
                )
            )

        context_str = "\n\n".join(context_profiles_text) 
        prompt = (
            f"You are a helpful social network assistant designed to introduce people. "
            f"Based on the following relevant user profiles and their details:\n\n"
            f"{context_str}\n\n"
            f"And the user's original natural language query: '{request.query}'.\n\n"
            f"Please provide a concise and friendly natural language summary introducing the most relevant profiles "
            f"found. Highlight their names and interests that align with the query. "
            f"Keep the summary to 3-5 sentences. Ensure your response is based strictly on the provided profile data."
        )

        print("Sending request to Google Gemini API...") # For debugging
        try:
            gemini_response = gemini_model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    temperature=0.7,         
                    max_output_tokens=300,   
                )
            )
            generated_summary = gemini_response.text.strip()
            print("Response received from Google Gemini.") # For debugging
        except Exception as e:
            print(f"Error calling Google Gemini API: {e}")
            generated_summary = "I apologize, but I encountered an error while generating the summary. Please try again later."


        return RAGSearchResponse(generated_summary=generated_summary, profiles=response_profiles)

    except psycopg2.Error as e:
        print(f"Database error during RAG search: {e}")
        # Log the full error for debugging (e.g., e.pgcode, e.pgerror)
        raise HTTPException(status_code=500, detail="Database error during RAG search.")
    except Exception as e:
        print(f"Unhandled error during RAG search: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    finally:
        if conn:
            conn.close()


@app.get("/health")
async def health_check():
    """Basic health check for the ML service."""
    try:
        conn = get_db_connection()
        conn.close()
        db_status = "connected"
    except HTTPException: # get_db_connection raises HTTPException
        db_status = "disconnected"
    except Exception:
        db_status = "error"

    return {"status": "ok", "message": "ML Service is running", "db_connection": db_status}
