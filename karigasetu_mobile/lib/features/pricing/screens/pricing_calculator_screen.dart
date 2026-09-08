import 'package:flutter/material.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/widgets/3d/depth_card.dart';
import '../../seller_home/screens/seller_home_screen.dart';

class PricingCalculatorScreen extends StatefulWidget {
  final String productName;
  final String category;

  const PricingCalculatorScreen({
    Key? key,
    required this.productName,
    required this.category,
  }) : super(key: key);

  @override
  State<PricingCalculatorScreen> createState() => _PricingCalculatorScreenState();
}

class _PricingCalculatorScreenState extends State<PricingCalculatorScreen> {
  double _materialCost = 420.0;
  double _labourHours = 6.0;
  double _recommendedPrice = 1199.0;
  double _expectedMargin = 479.0;
  double _minPrice = 1000.0;
  double _maxPrice = 1400.0;
  int _confidence = 88;
  bool _isPublishing = false;

  void _recalculate() async {
    final res = await apiClient.suggestPrice(
      materialCost: _materialCost,
      labourHours: _labourHours,
      category: widget.category,
    );
    setState(() {
      _recommendedPrice = (res["recommended_price"] as num).toDouble();
      _expectedMargin = (res["expected_margin"] as num).toDouble();
      _minPrice = (res["min_price"] as num).toDouble();
      _maxPrice = (res["max_price"] as num).toDouble();
    });
  }

  void _publishProduct() async {
    setState(() => _isPublishing = true);
    await Future.delayed(const Duration(milliseconds: 800));
    setState(() => _isPublishing = false);

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.check_circle_rounded, color: Color(0xFF10B981)),
            SizedBox(width: 8),
            Text("Product Published!"),
          ],
        ),
        content: Text(
          "\"${widget.productName}\" is now live on Karigasetu AI B2B Network and staged for ONDC.\n\nRecommended retail price: ₹${_recommendedPrice.toInt()}",
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (_) => const SellerHomeScreen()),
                (route) => false,
              );
            },
            child: const Text("Go to Dashboard"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(title: const Text("Explainable AI Pricing")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.productName,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
            ),
            const SizedBox(height: 4),
            Text(
              "Transparent cost-plus calculation protecting your artisan margins.",
              style: TextStyle(fontSize: 13, color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
            ),
            const SizedBox(height: 20),

            // Hero 3D Recommended Price Card
            DepthCard(
              depth: 1.5,
              backgroundColor: const Color(0xFF151C2C),
              borderColor: const Color(0xFFE5A93B),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text(
                        "RECOMMENDED PRICE",
                        style: TextStyle(color: Color(0xFFE5A93B), fontSize: 13, fontWeight: FontWeight.w800, letterSpacing: 1),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: const Color(0xFF10B981)),
                        ),
                        child: Text(
                          "$_confidence% Confidence",
                          style: const TextStyle(color: Color(0xFF10B981), fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    "₹${_recommendedPrice.toInt()}",
                    style: const TextStyle(fontSize: 38, fontWeight: FontWeight.w900, color: Colors.white),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "Market range: ₹${_minPrice.toInt()} – ₹${_maxPrice.toInt()}",
                        style: const TextStyle(color: Color(0xFFCBD5E1), fontSize: 13),
                      ),
                      Text(
                        "Expected margin: ₹${_expectedMargin.toInt()}",
                        style: const TextStyle(color: Color(0xFF10B981), fontSize: 13, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 22),

            // Interactive Input Sliders (Artisan Customization)
            const Text("Adjust Production Factors", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
            const SizedBox(height: 12),

            // Material Cost Slider
            Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                const Text("Raw Material Cost", style: TextStyle(fontSize: 13)),
                Text("₹${_materialCost.toInt()}", style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFE5A93B))),
              ],
            ),
            Slider(
              value: _materialCost,
              min: 100,
              max: 2000,
              divisions: 38,
              activeColor: const Color(0xFFE5A93B),
              onChanged: (val) {
                setState(() => _materialCost = val);
                _recalculate();
              },
            ),

            // Labour Hours Slider
            Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                const Text("Artisan Craft Labour", style: TextStyle(fontSize: 13)),
                Text("${_labourHours.toInt()} hours", style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFE5A93B))),
              ],
            ),
            Slider(
              value: _labourHours,
              min: 1,
              max: 30,
              divisions: 29,
              activeColor: const Color(0xFFE5A93B),
              onChanged: (val) {
                setState(() => _labourHours = val);
                _recalculate();
              },
            ),

            const SizedBox(height: 16),

            // Itemized Explainable Breakdown Card
            DepthCard(
              depth: 1.1,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Explainable Cost Breakdown", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 12),
                  _breakdownRow("Raw Materials", "₹${_materialCost.toInt()}", "Yarn, leather, dyes, brass rivets"),
                  _breakdownRow("Artisan Labour (${_labourHours.toInt()}h)", "₹${(_labourHours * 50).toInt()}", "Fair living wage @ ₹50/hr"),
                  _breakdownRow("Packaging & Box", "₹50", "Eco-friendly craft packaging"),
                  _breakdownRow("Shipping / Handling", "₹80", "Corridor transit drop-off"),
                  _breakdownRow("Market Demand Index", "+₹180", "+18% category velocity"),
                  _breakdownRow("Artisan Profit Margin", "+₹${_expectedMargin.toInt()}", "Fair 25% sustainable profit"),
                  const Divider(height: 24),
                  const Text(
                    "Disclaimer: AI recommendations provide market benchmarks; final prices are not guaranteed.",
                    style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8), fontStyle: FontStyle.italic),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 28),

            // Publish Button
            SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton(
                onPressed: _isPublishing ? null : _publishProduct,
                child: _isPublishing
                    ? const CircularProgressIndicator(color: Color(0xFF0B0F19))
                    : const Text("PUBLISH PRODUCT TO MARKETPLACE →"),
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _breakdownRow(String label, String amount, String detail) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
              Text(detail, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
            ],
          ),
          Text(amount, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
        ],
      ),
    );
  }
}
