import 'package:flutter/material.dart';
import '../../../../core/widgets/3d/depth_card.dart';
import '../../orders/screens/orders_screen.dart';

class RfqDetailsScreen extends StatefulWidget {
  final String productName;
  final int quantity;
  final double targetPrice;
  final String artisanName;

  const RfqDetailsScreen({
    Key? key,
    required this.productName,
    required this.quantity,
    required this.targetPrice,
    required this.artisanName,
  }) : super(key: key);

  @override
  State<RfqDetailsScreen> createState() => _RfqDetailsScreenState();
}

class _RfqDetailsScreenState extends State<RfqDetailsScreen> {
  double _counterPrice = 320.0;
  bool _showAiAdvice = false;
  bool _isAccepted = false;

  void _askAiCoPilot() {
    setState(() => _showAiAdvice = true);
  }

  void _acceptQuote() {
    setState(() => _isAccepted = true);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("B2B Quote accepted at ₹${_counterPrice.toInt()}/unit. Purchase order initialized!")),
    );
    Future.delayed(const Duration(milliseconds: 700), () {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const OrdersScreen(userRole: "SELLER")),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(title: const Text("B2B RFQ & Negotiation")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // RFQ Header Details
            DepthCard(
              depth: 1.2,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Text(
                        "RFQ #101 • ACTIVE",
                        style: TextStyle(
                          color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFE5A93B).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text("In Negotiation", style: TextStyle(color: Color(0xFFE5A93B), fontSize: 11, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    widget.productName,
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 6),
                  Text("Artisan / Seller: ${widget.artisanName}", style: const TextStyle(color: Color(0xFFE5A93B), fontSize: 13, fontWeight: FontWeight.w600)),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _specItem("Quantity", "${widget.quantity} units"),
                      _specItem("Buyer Offer", "₹${widget.targetPrice.toInt()} / unit"),
                      _specItem("Delivery", "18 days"),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // AI Negotiation Assistant ("Ask AI") Section
            if (_showAiAdvice)
              DepthCard(
                depth: 1.4,
                backgroundColor: const Color(0xFF151C2C),
                borderColor: const Color(0xFFE5A93B),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.psychology_rounded, color: Color(0xFFE5A93B), size: 22),
                        SizedBox(width: 8),
                        Text(
                          "AI NEGOTIATION ADVICE",
                          style: TextStyle(color: Color(0xFFE5A93B), fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 0.8),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      "Buyer offered ₹${widget.targetPrice.toInt()}. Your production break-even floor is ₹240. Based on bulk economies of scale for 100 units, countering at ₹${_counterPrice.toInt()} preserves a healthy 25% profit margin.",
                      style: const TextStyle(fontSize: 13, height: 1.5, color: Color(0xFFF1F5F9)),
                    ),
                    const SizedBox(height: 14),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text("Counter Offer:", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        Text("₹${_counterPrice.toInt()} / unit", style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFFE5A93B))),
                      ],
                    ),
                    Slider(
                      value: _counterPrice,
                      min: 260,
                      max: 420,
                      divisions: 16,
                      activeColor: const Color(0xFFE5A93B),
                      onChanged: (val) => setState(() => _counterPrice = val),
                    ),
                  ],
                ),
              ),

            const SizedBox(height: 24),

            // Negotiation Action Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _askAiCoPilot,
                    icon: const Icon(Icons.auto_awesome_rounded, color: Color(0xFFE5A93B), size: 18),
                    label: const Text("ASK AI"),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      side: const BorderSide(color: Color(0xFFE5A93B)),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _acceptQuote,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: const Text("ACCEPT QUOTE"),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _specItem(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
        const SizedBox(height: 2),
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
      ],
    );
  }
}
