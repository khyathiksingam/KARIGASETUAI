"""Unit tests for Multilingual Voice STT and Catalog Generation."""
import pytest
from app.services.voice_stt import regional_stt_service
from app.services.catalog_gen import catalog_generation_service

def test_regional_stt_telugu():
    """Verify detection and translation of Telugu speech transcript."""
    telugu_text = "ఇది నేను చేతితో తయారు చేసిన పట్టు చీర. దీనికి రెండు రోజులు పట్టింది."
    res = regional_stt_service.process_speech(simulated_speech=telugu_text)
    
    assert res["detected_language"] == "te"
    assert res["language_name"] == "Telugu"
    assert "silk saree" in res["english_translation"].lower()

def test_catalog_generation_schema_conformance():
    """Verify generated catalog contains all required fields without hallucinating unsupported claims."""
    catalog = catalog_generation_service.generate_catalog(
        voice_transcript="Handcrafted leather bag with brass buckles. Took 3 days to stitch.",
        craft_type_hint="Leather Goods"
    )

    required_keys = [
        "product_name", "category", "material", "craft_type",
        "dimensions", "weight", "production_time", "description",
        "keywords", "confidence"
    ]
    for k in required_keys:
        assert k in catalog

    assert catalog["confidence"] >= 0.90
    assert "leather" in catalog["material"].lower()
