"""Google Lens integration abstraction and deep-link / intent generation."""
from typing import Dict, Any, Optional

class GoogleLensService:
    """Provides Android Intent URI and web deep-link resolution for Google Lens visual search."""

    @staticmethod
    def get_lens_intent_payload(image_url: Optional[str] = None) -> Dict[str, Any]:
        """Generate Android Intent data to launch Google Lens package or web fallback."""
        if not image_url:
            image_url = "https://karigasetu.ai/demo/saree.jpg"

        # Android Lens Intent action: com.google.ar.lens or Chrome visual search
        android_intent_uri = f"intent://lens.google.com/uploadbyurl?url={image_url}#Intent;scheme=https;package=com.google.ar.lens;end"
        web_lens_url = f"https://lens.google.com/uploadbyurl?url={image_url}"

        return {
            "service": "Google Lens (Visual Discovery)",
            "intent_package": "com.google.ar.lens",
            "android_intent_uri": android_intent_uri,
            "web_fallback_url": web_lens_url,
            "instructions": "Launches Google Lens on supported Android devices for external visual comparison."
        }

google_lens_service = GoogleLensService()
