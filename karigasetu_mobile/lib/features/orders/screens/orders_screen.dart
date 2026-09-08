import 'package:flutter/material.dart';
import '../../../../core/widgets/3d/depth_card.dart';

class OrdersScreen extends StatefulWidget {
  final String userRole;

  const OrdersScreen({Key? key, this.userRole = "SELLER"}) : super(key: key);

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  final List<Map<String, dynamic>> _orders = [
    {
      "id": "ORD-501",
      "product": "Handcrafted Leather Shoulder Bag",
      "counterparty": "FabCraft Ethical Retail (Bengaluru)",
      "amount": "₹32,000",
      "quantity": "100 units",
      "status": "PROCESSING",
      "tracking": "IND-POST-TE-984210",
      "escrow": "ESCROW_HELD"
    },
    {
      "id": "ORD-502",
      "product": "Handwoven Silk Ikat Saree",
      "counterparty": "Dakshin Crafts Export House",
      "amount": "₹42,850",
      "quantity": "11 units",
      "status": "DELIVERED",
      "tracking": "IND-POST-TE-884112",
      "escrow": "RELEASED"
    }
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Commercial Orders")),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _orders.length,
        itemBuilder: (context, idx) {
          final o = _orders[idx];
          return DepthCard(
            margin: const EdgeInsets.only(bottom: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Text(
                      o["id"],
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFE5A93B)),
                    ),
                    _statusChip(o["status"]),
                  ],
                ),
                const SizedBox(height: 8),
                Text(o["product"], style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                const SizedBox(height: 4),
                Text("Counterparty: ${o['counterparty']}", style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                const Divider(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Text("Qty: ${o['quantity']}", style: const TextStyle(fontSize: 13)),
                    Text(
                      o["amount"],
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0D121F),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.local_shipping_rounded, size: 16, color: Color(0xFFE5A93B)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          "Tracking: ${o['tracking']}",
                          style: const TextStyle(fontSize: 11, color: Color(0xFFCBD5E1)),
                        ),
                      ),
                      Text(
                        o["escrow"] == "RELEASED" ? "PAID ✓" : "ESCROW PROTECTED",
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF10B981)),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _statusChip(String status) {
    Color color;
    switch (status) {
      case "PROCESSING":
        color = const Color(0xFF3B82F6);
        break;
      case "SHIPPED":
        color = const Color(0xFFE5A93B);
        break;
      case "DELIVERED":
        color = const Color(0xFF10B981);
        break;
      default:
        color = const Color(0xFF94A3B8);
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color),
      ),
      child: Text(status, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
    );
  }
}
