Creeoo
Intelligent Profile Search
Overview
Smart Connect is a sophisticated application designed to revolutionize how you find and connect with individuals based on highly specific interests and precise geographical locations. Moving beyond basic keyword searches, it leverages advanced AI and geospatial capabilities to help users discover exactly who they need, where they need them.

The Problem It Solves
The problem "Creeoo" solves is the inherent difficulty and inefficiency in discovering and connecting with individuals who share very specific, often nuanced interests, especially when combined with a desired geographical proximity. Traditional networking platforms often rely on broad keywords or job titles, leading to an overwhelming number of irrelevant results and significant wasted time. This makes it challenging to find collaborators for niche projects, connect with local hobbyists, or build targeted communities, ultimately hindering organic connections and the efficient utilization of human capital.

Key Features
Intelligent Interest Matching: Go beyond keywords to match profiles based on the meaning of their interests.
Precise Geospatial Filtering: Find individuals within a specified radius of any given latitude and longitude.
Robust Microservices Architecture: A scalable and maintainable setup using Go, Python, and React.
Efficient Data Retrieval: Leveraging specialized database capabilities for fast searches.
Architecture & Tech Stack
Smart Connect is built on a modern microservices architecture, ensuring modularity, scalability, and high performance.

Components:

React Frontend:
The user-facing web application.
Provides an intuitive interface for searching profiles and displaying results.
Tech: React, JavaScript/TypeScript, npm/yarn, Vite/Create React App.
Go Backend (API Gateway & Orchestrator):
Serves the RESTful API endpoints for the frontend.
Handles business logic, user management (signup/profiles), and orchestrates calls to the ML service.
Tech: Go, Gin framework, net/http client.
Python ML Service (AI & Embeddings):
A dedicated microservice for AI-powered processing.
Generates embeddings for user profiles using sentence-transformers.
Handles the intelligent matching logic based on these embeddings.
Tech: Python, FastAPI, sentence-transformers, uvicorn.
PostgreSQL Database:
Stores user profiles, interests, and their embeddings.
pgvector Extension: Enables efficient similarity search on vector embeddings.
PostGIS Extension: Provides powerful geospatial functions for location-based queries.

