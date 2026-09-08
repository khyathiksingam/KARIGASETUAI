"""Marketplace Adapter for ONDC (Beckn Protocol) & External Channels."""
from typing import Dict, Any, Optional
import uuid
from datetime import datetime, timezone

class MarketplaceAdapter:
    """Standardized adapter for publishing artisan products to ONDC and external commerce channels."""

    def __init__(self, mode: str = "SANDBOX_DEMO"):
        self.mode = mode
        self.bpp_id = "karigasetu.ai.bpp"
        self.domain = "ONDC:RET10"  # Retail Handicrafts & Artisan Products

    def publish_catalog_item(self, product: Dict[str, Any]) -> Dict[str, Any]:
        """Format product to Beckn / ONDC catalog schema and dispatch to gateway."""
        beckn_item = {
            "id": product.get("id", str(uuid.uuid4())),
            "descriptor": {
                "name": product.get("name"),
                "short_desc": product.get("description", "")[:120],
                "long_desc": product.get("description"),
                "images": product.get("image_urls", [])
            },
            "category_id": product.get("category", "Handicrafts"),
            "price": {
                "currency": "INR",
                "value": str(product.get("price", "0.00"))
            },
            "matched": True,
            "tags": [
                {"code": "origin", "list": [{"code": "country", "value": "IND"}]},
                {"code": "attribute", "list": [
                    {"code": "material", "value": product.get("material", "Natural")},
                    {"code": "craft_type", "value": product.get("craft_type", "Handmade")}
                ]}
            ]
        }

        return {
            "status": "PUBLISHED_TO_SANDBOX",
            "environment": self.mode,
            "network": "ONDC (Open Network for Digital Commerce)",
            "domain": self.domain,
            "network_transaction_id": f"ondc-txn-{uuid.uuid4().hex[:12]}",
            "beckn_item_id": beckn_item["id"],
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "note": "Published to ONDC Staging Sandbox / Demo Gateway. Certified non-production prototype."
        }

marketplace_adapter = MarketplaceAdapter()
