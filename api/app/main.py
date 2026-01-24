from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health, extraction

app = FastAPI(
    title="Insurinz API",
    description="Document extraction API for insurance documents",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(extraction.router, prefix="/api/v1", tags=["Extraction"])


@app.get("/")
async def root():
    return {"message": "Insurinz API", "version": "1.0.0"}
