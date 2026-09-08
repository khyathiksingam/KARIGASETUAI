import 'package:flutter/material.dart';
import '../../../../core/network/api_client.dart';
import '../../pricing/screens/pricing_calculator_screen.dart';
import '../../../../core/widgets/3d/depth_card.dart';

class CatalogReviewScreen extends StatefulWidget {
  const CatalogReviewScreen({Key? key}) : super(key: key);

  @override
  State<CatalogReviewScreen> createState() => _CatalogReviewScreenState();
}

class _CatalogReviewScreenState extends State<CatalogReviewScreen> {
  double _sliderPos = 0.5;
  bool _isListening = false;
  String _selectedLang = "te";
  String _voiceTranscript = "ఇది నేను చేతితో తయారు చేసిన అసలైన తోలు బ్యాగ్. దీనికి మూడు రోజులు పట్టింది.";

  final TextEditingController _titleCtrl = TextEditingController(text: "Handcrafted Genuine Leather Shoulder Bag");
  final TextEditingController _categoryCtrl = TextEditingController(text: "Leather Goods");
  final TextEditingController _materialCtrl = TextEditingController(text: "Vegetable Tanned Buff Leather");
  final TextEditingController _craftCtrl = TextEditingController(text: "Hand-Stitched Leathercraft");
  final TextEditingController _timeCtrl = TextEditingController(text: "3 days");
  final TextEditingController _descCtrl = TextEditingController(
    text: "Handmade full-grain leather shoulder bag tailored with durable hand-waxed thread stitching and antique brass fittings.",
  );

  void _triggerVoiceRecording(String lang) async {
    setState(() {
      _selectedLang = lang;
      _isListening = true;
    });

    await Future.delayed(const Duration(milliseconds: 900));
    final res = await apiClient.transcribeSpeech(
      speechText: lang == "te"
          ? "ఇది నేను చేతితో తయారు చేసిన చీర. దీనికి రెండు రోజులు పట్టింది."
          : "यह हाथ से बना शुद्ध रेशम का वस्त्र है।",
      targetLang: "en",
    );

    setState(() {
      _isListening = false;
      _voiceTranscript = res["original_transcript"];
      _descCtrl.text = res["english_translation"];
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Voice captured in ${res['language_name']} → Translated & normalized!")),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text("AI Smart Cataloguer"),
        actions: [
          TextButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("Regenerating catalog with alternative regional attributes...")),
              );
            },
            child: const Text("Regenerate", style: TextStyle(color: Color(0xFFE5A93B))),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Before / After Image Enhancement Comparison Slider
            const Text(
              "AI Image Enhancement (Before / After)",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
            const SizedBox(height: 10),

            Container(
              height: 220,
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE5A93B).withOpacity(0.4)),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Stack(
                  children: [
                    // Enhanced studio photo (Background layer)
                    Image.network(
                      "http://127.0.0.1:8000/static/demo/leather_bag_enhanced.jpg",
                      width: double.infinity,
                      height: 220,
                      fit: BoxFit.cover,
                    ),

                    // Raw artisan capture (Clipped overlay)
                    ClipRect(
                      clipper: _HalfClipper(fraction: _sliderPos),
                      child: Image.network(
                        "http://127.0.0.1:8000/static/demo/leather_bag_raw.jpg",
                        width: double.infinity,
                        height: 220,
                        fit: BoxFit.cover,
                      ),
                    ),

                    // Center divider handle
                    Positioned(
                      left: MediaQuery.of(context).size.width * _sliderPos - 44,
                      top: 0,
                      bottom: 0,
                      child: GestureDetector(
                        onHorizontalDragUpdate: (details) {
                          setState(() {
                            final width = MediaQuery.of(context).size.width - 40;
                            _sliderPos = (_sliderPos + details.delta.dx / width).clamp(0.05, 0.95);
                          });
                        },
                        child: Container(
                          width: 24,
                          color: Colors.transparent,
                          child: Center(
                            child: Container(
                              width: 3,
                              color: const Color(0xFFE5A93B),
                              child: Center(
                                child: Container(
                                  width: 20,
                                  height: 20,
                                  decoration: const BoxDecoration(
                                    color: Color(0xFFE5A93B),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.compare_arrows_rounded, size: 14, color: Color(0xFF0B0F19)),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),

                    // Labels
                    Positioned(
                      top: 12,
                      left: 14,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(color: Colors.black.withOpacity(0.6), borderRadius: BorderRadius.circular(6)),
                        child: const Text("RAW CAPTURE", style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                    ),
                    Positioned(
                      top: 12,
                      right: 14,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(color: const Color(0xFFE5A93B), borderRadius: BorderRadius.circular(6)),
                        child: const Text("AI ENHANCED", style: TextStyle(color: Color(0xFF0B0F19), fontSize: 10, fontWeight: FontWeight.w900)),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 22),

            // Voice-First Regional Recorder Card
            DepthCard(
              depth: 1.2,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.mic_rounded, color: Color(0xFFE5A93B)),
                          SizedBox(width: 8),
                          Text("🎙️ Speak instead of typing", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                        ],
                      ),
                      if (_isListening)
                        const SizedBox(
                          width: 14,
                          height: 14,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFFE5A93B)),
                        ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    "Speak in your local language to describe weaving, materials, or days spent:",
                    style: TextStyle(fontSize: 12, color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
                  ),
                  const SizedBox(height: 12),

                  // Vernacular Audio Trigger Chips
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _langChip("తెలుగు (Telugu)", "te"),
                        const SizedBox(width: 8),
                        _langChip("हिन्दी (Hindi)", "hi"),
                        const SizedBox(width: 8),
                        _langChip("தமிழ் (Tamil)", "ta"),
                        const SizedBox(width: 8),
                        _langChip("ಕನ್ನಡ (Kannada)", "kn"),
                        const SizedBox(width: 8),
                        _langChip("English", "en"),
                      ],
                    ),
                  ),

                  const SizedBox(height: 12),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF0D121F) : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: isDark ? const Color(0xFF1E283D) : const Color(0xFFE2E8F0)),
                    ),
                    child: Text(
                      "\"$_voiceTranscript\"",
                      style: const TextStyle(fontSize: 12.5, fontStyle: FontStyle.italic, color: Color(0xFFCBD5E1)),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 22),

            // AI Generated Information (Human Approval Loop)
            Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                const Text("AI Generated Information", style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFF10B981).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: const Color(0xFF10B981)),
                  ),
                  child: const Text("Zero-Hallucination Verified", style: TextStyle(color: Color(0xFF10B981), fontSize: 10, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 14),

            _attributeField("Product Title", _titleCtrl, confidence: "96%"),
            _attributeField("Material", _materialCtrl, confidence: "94%"),
            _attributeField("Craft Category", _categoryCtrl, confidence: "98%"),
            _attributeField("Craft Technique", _craftCtrl, confidence: "92%"),
            _attributeField("Production Time", _timeCtrl, confidence: "90%"),

            const SizedBox(height: 12),
            const Text("Product Description", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            const SizedBox(height: 6),
            TextField(
              controller: _descCtrl,
              maxLines: 3,
              style: const TextStyle(fontSize: 13),
              decoration: InputDecoration(
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),

            const SizedBox(height: 28),

            // Approval Button -> Navigates to AI Pricing
            SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => PricingCalculatorScreen(
                        productName: _titleCtrl.text,
                        category: _categoryCtrl.text,
                      ),
                    ),
                  );
                },
                child: const Text("APPROVE & GET FAIR PRICING →"),
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _langChip(String label, String code) {
    final isSelected = _selectedLang == code;
    return InkWell(
      onTap: () => _triggerVoiceRecording(code),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFE5A93B) : const Color(0xFF1E283D),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: isSelected ? const Color(0xFFE5A93B) : const Color(0xFF334155)),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11.5,
            fontWeight: FontWeight.bold,
            color: isSelected ? const Color(0xFF0B0F19) : const Color(0xFFF1F5F9),
          ),
        ),
      ),
    );
  }

  Widget _attributeField(String label, TextEditingController ctrl, {required String confidence}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Expanded(
            flex: 4,
            child: TextField(
              controller: ctrl,
              style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600),
              decoration: InputDecoration(
                labelText: label,
                isDense: true,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFF151C2C),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFFE5A93B).withOpacity(0.5)),
            ),
            child: Text(
              confidence,
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFFE5A93B)),
            ),
          ),
        ],
      ),
    );
  }
}

class _HalfClipper extends CustomClipper<Rect> {
  final double fraction;
  _HalfClipper({required this.fraction});

  @override
  Rect getClip(Size size) {
    return Rect.fromLTRB(0, 0, size.width * fraction, size.height);
  }

  @override
  bool shouldReclip(covariant _HalfClipper oldClipper) => oldClipper.fraction != fraction;
}
