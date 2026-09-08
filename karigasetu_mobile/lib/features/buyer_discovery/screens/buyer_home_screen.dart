import 'package:flutter/material.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/widgets/3d/product_3d_card.dart';
import '../../../../core/widgets/3d/depth_card.dart';
import '../../rfq_negotiation/screens/rfq_details_screen.dart';
import '../../orders/screens/orders_screen.dart';
import '../../profile/screens/profile_screen.dart';

class BuyerHomeScreen extends StatefulWidget {
  const BuyerHomeScreen({Key? key}) : super(key: key);

  @override
  State<BuyerHomeScreen> createState() => _BuyerHomeScreenState();
}

class _BuyerHomeScreenState extends State<BuyerHomeScreen> {
  int _currentIndex = 0;
  final TextEditingController _searchCtrl = TextEditingController(text: "100 handmade bags under ₹1200");
  List<dynamic> _searchResults = [];
  bool _isSearching = false;

  @override
  void initState() {
    super.initState();
    _performSearch();
  }

  void _performSearch() async {
    setState(() => _isSearching = true);
    final results = await apiClient.searchProducts(_searchCtrl.text);
    setState(() {
      _searchResults = results;
      _isSearching = false;
    });
  }

  void _openRfqDialog(Map<String, dynamic> product) {
    final qtyCtrl = TextEditingController(text: "100");
    final targetPriceCtrl = TextEditingController(text: "280");
    final notesCtrl = TextEditingController(text: "Need custom corporate debossing on inner leather patch.");

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text("Create B2B RFQ: ${product['name']}"),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: qtyCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: "Quantity (units)"),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: targetPriceCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: "Target Offer Price per Unit (₹)"),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: notesCtrl,
                maxLines: 2,
                decoration: const InputDecoration(labelText: "Customization & Delivery Requirements"),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => RfqDetailsScreen(
                    productName: product['name'],
                    quantity: int.tryParse(qtyCtrl.text) ?? 100,
                    targetPrice: double.tryParse(targetPriceCtrl.text) ?? 280.0,
                    artisanName: product['artisan_name'] ?? "Savita Devi",
                  ),
                ),
              );
            },
            child: const Text("Submit RFQ →"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final List<Widget> pages = [
      _buildDiscoveryView(isDark),
      _buildDiscoveryView(isDark), // Discover
      const RfqDetailsScreen(
        productName: "Handcrafted Leather Bag",
        quantity: 100,
        targetPrice: 280.0,
        artisanName: "Savita Devi",
      ),
      const OrdersScreen(userRole: "BUYER"),
      const ProfileScreen(userRole: "BUYER"),
    ];

    return Scaffold(
      body: SafeArea(child: pages[_currentIndex]),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.explore_rounded), label: "Home"),
          NavigationDestination(icon: Icon(Icons.search_rounded), label: "Discover"),
          NavigationDestination(icon: Icon(Icons.request_quote_rounded), label: "RFQs"),
          NavigationDestination(icon: Icon(Icons.receipt_long_rounded), label: "Orders"),
          NavigationDestination(icon: Icon(Icons.person_rounded), label: "Profile"),
        ],
      ),
    );
  }

  Widget _buildDiscoveryView(bool isDark) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Discover Authentic Craft", style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900)),
          const SizedBox(height: 4),
          const Text("Direct B2B linkage to 20+ verified Indian artisan clusters.", style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
          const SizedBox(height: 20),

          // AI Natural Language Search Bar
          Container(
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF151C2C) : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE5A93B).withOpacity(0.5), width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFE5A93B).withOpacity(0.12),
                  blurRadius: 18,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: TextField(
              controller: _searchCtrl,
              onSubmitted: (_) => _performSearch(),
              decoration: InputDecoration(
                hintText: "e.g. \"100 handmade bags under ₹1200\"",
                prefixIcon: const Icon(Icons.auto_awesome_rounded, color: Color(0xFFE5A93B)),
                suffixIcon: IconButton(
                  icon: const Icon(Icons.arrow_forward_rounded, color: Color(0xFFE5A93B)),
                  onPressed: _performSearch,
                ),
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              ),
            ),
          ),

          const SizedBox(height: 18),

          // 6-Factor AI Match Spotlight Card
          DepthCard(
            depth: 1.3,
            backgroundColor: const Color(0xFF151C2C),
            borderColor: const Color(0xFF10B981),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    const Text(
                      "SAVITA CRAFTS (TELANGANA)",
                      style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: Colors.white),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981).withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFF10B981)),
                      ),
                      child: const Text("94% AI MATCH", style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 11)),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                const Text("Why this artisan matches your procurement request:", style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                const SizedBox(height: 8),
                _matchReason("✓ Product category matches Handcrafted Leather & Handloom Bags"),
                _matchReason("✓ Monthly capacity of 200 units fulfills your 100-unit requirement"),
                _matchReason("✓ Unit price within target ₹1,200 budget ceiling"),
                _matchReason("✓ Verified Artisan credentials and verified shipping corridor"),
                const SizedBox(height: 14),
                SizedBox(
                  width: double.infinity,
                  height: 42,
                  child: ElevatedButton(
                    onPressed: () {
                      _openRfqDialog({
                        "name": "Handcrafted Genuine Leather Shoulder Bag",
                        "artisan_name": "Savita Devi",
                      });
                    },
                    child: const Text("REQUEST B2B QUOTE (RFQ) →"),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),
          const Text("Matched Artisan Catalogues", style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18)),
          const SizedBox(height: 14),

          // 3D Product Cards List
          if (_isSearching)
            const Center(child: CircularProgressIndicator(color: Color(0xFFE5A93B)))
          else
            ..._searchResults.map((p) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Product3DCard(
                  title: p['name'] ?? "Handmade Craft",
                  price: "₹${(p['price'] as num).toInt()}",
                  craftType: p['craft_type'] ?? "Handicraft",
                  artisanName: p['artisan_name'],
                  location: p['artisan_location'],
                  imageUrl: p['image_url'] ?? "http://127.0.0.1:8000/static/demo/leather_bag_enhanced.jpg",
                  verifiedArtisan: true,
                  onTap: () => _openRfqDialog(p),
                ),
              );
            }).toList(),
        ],
      ),
    );
  }

  Widget _matchReason(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Text(text, style: const TextStyle(fontSize: 12, color: Color(0xFFE2E8F0))),
    );
  }
}
