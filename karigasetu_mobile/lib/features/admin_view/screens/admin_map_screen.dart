import 'package:flutter/material.dart';
import '../../../../core/widgets/3d/depth_card.dart';

class AdminMapScreen extends StatelessWidget {
  const AdminMapScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("2.5D Craft Cluster Visualizer")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Indian Artisan Craft Clusters", style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900)),
            const SizedBox(height: 4),
            const Text("20+ traditional craft hubs monitored for production and demand linkage.", style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
            const SizedBox(height: 18),

            // Visual 2.5D Cluster Map Preview Card
            DepthCard(
              depth: 1.4,
              backgroundColor: const Color(0xFF0E1626),
              borderColor: const Color(0xFFE5A93B),
              child: Column(
                children: [
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text("NATIONAL CLUSTER TELEMETRY", style: TextStyle(color: Color(0xFFE5A93B), fontSize: 11, fontWeight: FontWeight.bold)),
                      Text("2,480+ ARTISANS", style: TextStyle(color: Color(0xFF10B981), fontSize: 11, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    height: 200,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: const Color(0xFF070A10),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFF243049)),
                    ),
                    child: Stack(
                      children: [
                        const Center(
                          child: Icon(Icons.map_rounded, size: 80, color: Color(0xFF1E283D)),
                        ),
                        // Pulsing cluster points
                        _clusterPoint(80, 50, "Kashmir (Pashmina)"),
                        _clusterPoint(180, 110, "Rajasthan (Blue Pottery)"),
                        _clusterPoint(240, 140, "Telangana (Pochampally)", isHighlighted: true),
                        _clusterPoint(280, 130, "Karnataka (Channapatna)"),
                        _clusterPoint(160, 240, "West Bengal (Terracotta)"),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),
            const Text("Demand Intelligence Highlights", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            _trendRow("Handmade Bags", "↑ 28.4%", "Telangana / West Bengal Hubs"),
            _trendRow("Handloom Silk Sarees", "↑ 18.2%", "Pochampally / Varanasi Clusters"),
            _trendRow("Jaipur Blue Pottery", "↑ 15.1%", "Corporate & Festive Gift Sourcing"),
            _trendRow("Channapatna Wooden Toys", "↑ 12.0%", "Eco-Friendly Sensory Products"),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF1E283D),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Row(
                children: [
                  Icon(Icons.info_outline_rounded, color: Color(0xFFE5A93B), size: 20),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      "Full interactive 2.5D map with SVG telemetry is accessible on the Web Admin Dashboard at http://localhost:8000/admin",
                      style: TextStyle(fontSize: 12, color: Color(0xFFCBD5E1), height: 1.4),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _clusterPoint(double top, double left, String label, {bool isHighlighted = false}) {
    return Positioned(
      top: top,
      left: left,
      child: Row(
        children: [
          Container(
            width: isHighlighted ? 12 : 8,
            height: isHighlighted ? 12 : 8,
            decoration: BoxDecoration(
              color: isHighlighted ? const Color(0xFFE5A93B) : const Color(0xFF10B981),
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: isHighlighted ? const Color(0xFFE5A93B) : const Color(0xFF10B981),
                  blurRadius: 8,
                ),
              ],
            ),
          ),
          const SizedBox(width: 4),
          Text(label, style: const TextStyle(fontSize: 9, color: Color(0xFF94A3B8), fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _trendRow(String craft, String growth, String hub) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(craft, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5)),
              Text(hub, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withOpacity(0.15),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(growth, style: const TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 12)),
          ),
        ],
      ),
    );
  }
}
