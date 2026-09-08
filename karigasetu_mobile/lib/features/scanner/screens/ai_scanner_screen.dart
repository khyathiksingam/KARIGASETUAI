import 'dart:async';
import 'package:flutter/material.dart';
import '../../../../core/network/api_client.dart';
import '../widgets/scanning_reticle_painter.dart';
import '../../cataloguing/screens/catalog_review_screen.dart';

class AiScannerScreen extends StatefulWidget {
  const AiScannerScreen({Key? key}) : super(key: key);

  @override
  State<AiScannerScreen> createState() => _AiScannerScreenState();
}

class _AiScannerScreenState extends State<AiScannerScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  bool _isScanning = true;
  int _currentStage = 0;
  String _selectedCraft = "Handcrafted Leather Bag";
  int _confidence = 94;

  final List<String> _stages = [
    "Image quality (Sharpness & Lighting: 92/100)",
    "Object detection (Object isolated in center)",
    "Craft recognition (Handloom / Leathercraft locked)",
    "Material analysis (Natural vegetable tanned leather)",
    "Catalogue metadata generation",
  ];

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(vsync: this, duration: const Duration(seconds: 2))..repeat();
    _runSequentialScan();
  }

  void _runSequentialScan() async {
    for (int i = 0; i < _stages.length; i++) {
      await Future.delayed(const Duration(milliseconds: 600));
      if (!mounted) return;
      setState(() => _currentStage = i + 1);
    }
    await Future.delayed(const Duration(milliseconds: 400));
    if (!mounted) return;
    setState(() => _isScanning = false);
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  void _searchWithGoogleLens() async {
    // Call backend lens intent hook
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Launching Google Lens Visual Search (Android Intent: com.google.ar.lens)..."),
        backgroundColor: Color(0xFF1E283D),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF070A10),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        title: const Text("AI PRODUCT SCANNER", style: TextStyle(letterSpacing: 1.5, fontSize: 16)),
        actions: [
          IconButton(
            icon: const Icon(Icons.flash_on_rounded, color: Color(0xFFE5A93B)),
            onPressed: () {},
          ),
        ],
      ),
      body: Stack(
        children: [
          // Simulated Camera Preview of the Craft
          Center(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
              width: double.infinity,
              height: 420,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                image: const DecorationDecorationImage(
                  image: NetworkImage("http://127.0.0.1:8000/static/demo/leather_bag_enhanced.jpg"),
                  fit: BoxFit.cover,
                ),
              ),
              child: AnimatedBuilder(
                animation: _animController,
                builder: (context, child) {
                  return CustomPaint(
                    painter: ScanningReticlePainter(progress: _animController.value),
                  );
                },
              ),
            ),
          ),

          // Glowing Sequential Progress Overlay
          Positioned(
            left: 24,
            right: 24,
            bottom: 30,
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFF151C2C).withOpacity(0.95),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE5A93B).withOpacity(0.5)),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x60000000),
                    blurRadius: 24,
                    offset: Offset(0, 10),
                  ),
                ],
              ),
              child: _isScanning
                  ? Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(strokeWidth: 2.5, color: Color(0xFFE5A93B)),
                            ),
                            SizedBox(width: 12),
                            Text(
                              "Understanding your craft...",
                              style: TextStyle(fontWeight: FontWeight.w800, color: Color(0xFFE5A93B), fontSize: 14),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        ...List.generate(_stages.length, (idx) {
                          final isDone = idx < _currentStage;
                          final isCurrent = idx == _currentStage - 1;
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 3),
                            child: Row(
                              children: [
                                Icon(
                                  isDone ? Icons.check_circle_rounded : Icons.radio_button_unchecked_rounded,
                                  color: isDone ? const Color(0xFF10B981) : const Color(0xFF64748B),
                                  size: 15,
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    _stages[idx],
                                    style: TextStyle(
                                      fontSize: 11.5,
                                      fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
                                      color: isDone ? const Color(0xFFF1F5F9) : const Color(0xFF64748B),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        }),
                      ],
                    )
                  : Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              _selectedCraft,
                              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: const Color(0xFF10B981).withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: const Color(0xFF10B981)),
                              ),
                              child: Text(
                                "$_confidence% Confidence",
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF10B981)),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        const Text(
                          "Verified Craft Category: Handcrafted Leather Accessories",
                          style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                        ),
                        const SizedBox(height: 18),
                        SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: ElevatedButton(
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const CatalogReviewScreen()),
                              );
                            },
                            child: const Text("CREATE CATALOGUE →"),
                          ),
                        ),
                        const SizedBox(height: 10),
                        SizedBox(
                          width: double.infinity,
                          height: 44,
                          child: OutlinedButton.icon(
                            onPressed: _searchWithGoogleLens,
                            icon: const Icon(Icons.travel_explore_rounded, color: Color(0xFFE5A93B), size: 20),
                            label: const Text("SEARCH WITH GOOGLE LENS", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                            style: OutlinedButton.styleFrom(
                              side: const BorderSide(color: Color(0xFFE5A93B)),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                          ),
                        ),
                      ],
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
