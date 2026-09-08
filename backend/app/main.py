"""FastAPI Main Application for KARIGASETU AI."""
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse

from app.core.config import settings
from app.core.database import engine, Base
from app.api import (
    auth, seller, buyer, products, ai, search,
    rfqs, orders, marketplace, admin
)

# Ensure database tables exist on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Driven Market Linkage and Smart Cataloging Platform for Marginalized Artisans (SIH 2026 Prototype)",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static directory setup
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
os.makedirs(os.path.join(static_dir, "uploads"), exist_ok=True)
os.makedirs(os.path.join(static_dir, "demo"), exist_ok=True)
os.makedirs(os.path.join(static_dir, "admin"), exist_ok=True)

app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include API v1 Routers
api_prefix = settings.API_V1_STR
app.include_router(auth.router, prefix=api_prefix)
app.include_router(seller.router, prefix=api_prefix)
app.include_router(buyer.router, prefix=api_prefix)
app.include_router(products.router, prefix=api_prefix)
app.include_router(ai.router, prefix=api_prefix)
app.include_router(search.router, prefix=api_prefix)
app.include_router(rfqs.router, prefix=api_prefix)
app.include_router(orders.router, prefix=api_prefix)
app.include_router(marketplace.router, prefix=api_prefix)
app.include_router(admin.router, prefix=api_prefix)

@app.get("/", response_class=HTMLResponse)
def index_root():
    """Root landing page showing API status, documentation links, and admin dashboard link."""
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KARIGASETU AI - From Craft to Commerce</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0D1117; color: #E6EDF3; margin: 0; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; }
            .card { background: #161B22; border: 1px solid #30363D; border-radius: 16px; padding: 40px; max-width: 650px; text-align: center; box-shadow: 0 12px 30px rgba(0,0,0,0.5); }
            h1 { color: #E5A93B; margin-bottom: 8px; font-size: 2.2rem; }
            p.tagline { color: #8B949E; font-size: 1.1rem; margin-top: 0; }
            .badge { display: inline-block; background: #238636; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: bold; margin-bottom: 24px; }
            .links { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-top: 30px; }
            .btn { text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 0.95rem; transition: all 0.2s; }
            .btn-primary { background: #E5A93B; color: #161B22; }
            .btn-primary:hover { background: #F3C363; transform: translateY(-2px); }
            .btn-secondary { background: #21262D; color: #C9D1D9; border: 1px solid #30363D; }
            .btn-secondary:hover { background: #30363D; }
            .features { text-align: left; margin: 24px 0; background: #0D1117; padding: 20px; border-radius: 8px; font-size: 0.95rem; line-height: 1.6; }
        </style>
    </head>
    <body>
        <div class="card">
            <span class="badge">SIH 2026 PROTOTYPE ACTIVE</span>
            <h1>KARIGASETU AI</h1>
            <p class="tagline">"From Craft to Commerce" — AI-Driven Market Linkage for Marginalized Artisans</p>
            <div class="features">
                <div>✨ <strong>Hero Workflow</strong>: One Photo + One Voice → Market-Ready Product</div>
                <div>📷 <strong>Vision Quality & Enhancer</strong>: Laplacian Sharpness & Studio Equalization</div>
                <div>🎙️ <strong>Multilingual Voice STT</strong>: Telugu, Hindi, Tamil, Kannada, Marathi, Bengali</div>
                <div>🏷️ <strong>Explainable AI Pricing</strong>: Cost-Plus Transparency with Market Bounds</div>
                <div>🤝 <strong>6-Factor B2B Matcher</strong>: Product, Price, Capacity, Location, Lead Time, Trust</div>
                <div>🗺️ <strong>2.5D Artisan Cluster Map</strong>: 20+ Clusters Across India</div>
            </div>
            <div class="links">
                <a href="/admin" class="btn btn-primary">Open Admin 2.5D Cluster Map</a>
                <a href="/docs" class="btn btn-secondary">API Swagger Documentation</a>
            </div>
        </div>
    </body>
    </html>
    """

@app.get("/admin", response_class=HTMLResponse)
def get_admin_dashboard():
    """Serves the interactive 2.5D Indian Craft Cluster Map and Admin Web Dashboard."""
    admin_index_path = os.path.join(static_dir, "admin", "index.html")
    if os.path.exists(admin_index_path):
        return FileResponse(admin_index_path)
    return "<h1>Admin Dashboard UI is building...</h1>"
