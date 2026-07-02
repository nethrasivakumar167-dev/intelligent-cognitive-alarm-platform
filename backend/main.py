from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Cognitive Alarm API")

# Defining allowed origins (your frontend URLs)
origins = [
    "http://localhost:5173",  # Default port for Vite (React)
]

# Adding the CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Created the health-check route
@app.get("/api/health")
def health_check():
    return {"status": "Hello from FastAPI"}