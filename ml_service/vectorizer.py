# File: ml_service/vectorizer.py

from sentence_transformers import SentenceTransformer

class Vectorizer:
    def __init__(self):
        # Load a pre-trained sentence transformer model
        # This model generates 384-dimensional embeddings (vectors)
        print("Loading SentenceTransformer model...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        print("SentenceTransformer model loaded.")

    def embed_text(self, text: str) -> list[float]:
        """
        Generates a vector embedding for a given text string.
        """
        if not text:
            return [] # Return empty list for empty text
        # Encode the text to get the embedding (vector)
        # convert_to_tensor=False returns a numpy array, then tolist() converts it to a Python list
        embedding = self.model.encode(text, convert_to_tensor=False)
        return embedding.tolist()

# Optional: Example usage (for testing this module independently)
if __name__ == "__main__":
    vectorizer = Vectorizer()
    sample_text = "This is a sample sentence about AI and technology."
    embedding = vectorizer.embed_text(sample_text)
    print(f"Text: '{sample_text}'")
    print(f"Embedding dimension: {len(embedding)}")
    print(f"First 5 values of embedding: {embedding[:5]}")
