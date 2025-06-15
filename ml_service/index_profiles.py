
import psycopg2
from psycopg2 import extras
import requests 
import os
from dotenv import load_dotenv
import json 

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
ML_SERVICE_URL = "http://localhost:8001"
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set. Check your .env file.")

def get_db_connection():
    """Establishes and returns a database connection."""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        raise

def get_profile_text(profile_data: dict) -> str:
    """
    Constructs a combined text string from profile data for embedding.
    You can customize what information goes into the embedding.
    """
    name = profile_data.get("name", "")
    email = profile_data.get("email", "")
    interests_jsonb = profile_data.get("interests", "[]")

    interests = interests_jsonb
    if isinstance(interests_jsonb, str):
        try:
            interests = json.loads(interests_jsonb)
        except json.JSONDecodeError:
            interests = [] 

    return (
        f"Name: {name}. "
        f"Email: {email}. "
        f"Interests: {', '.join(interests)}."
    ).strip()

def get_embedding_from_service(text: str) -> list[float]:
    """
    Calls your FastAPI /embed endpoint to get the text embedding.
    """
    try:
        response = requests.post(f"{ML_SERVICE_URL}/embed", json={"text": text})
        response.raise_for_status() # Raise an HTTPError for bad responses (4xx or 5xx)
        return response.json()["embedding"]
    except requests.exceptions.RequestException as e:
        print(f"Error calling ML service /embed: {e}")
        raise

def index_profiles():
    """
    Fetches profiles without embeddings, generates embeddings, and updates the database.
    """
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=extras.RealDictCursor)

        cur.execute("SELECT id, name, email, interests FROM profiles WHERE profile_embedding IS NULL;")
        profiles_to_index = cur.fetchall()

        if not profiles_to_index:
            print("No profiles found without embeddings to index.")
            return

        print(f"Found {len(profiles_to_index)} profiles to index...")

        for profile in profiles_to_index:
            profile_id = profile["id"]
            profile_text = get_profile_text(profile)
            print(f"Indexing profile ID {profile_id}: '{profile_text[:50]}...'")

            try:
                embedding = get_embedding_from_service(profile_text)
                update_cur = conn.cursor()
                update_cur.execute(
                    "UPDATE profiles SET profile_embedding = %s WHERE id = %s;",
                    (embedding, profile_id)
                )
                conn.commit() 
                print(f"Successfully indexed profile ID {profile_id}.")
            except Exception as e:
                print(f"Failed to index profile ID {profile_id}: {e}")
                conn.rollback() 

    except Exception as e:
        print(f"An error occurred during profile indexing: {e}")
    finally:
        if conn:
            conn.close()
            print("Database connection closed.")

if __name__ == "__main__":
    print("Starting profile indexing process...")
    index_profiles()
    print("Profile indexing process finished.")
