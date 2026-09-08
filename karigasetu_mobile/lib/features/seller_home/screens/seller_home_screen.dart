import 'package:flutter/material.dart';
import '../../../../core/widgets/3d/hero_sales_card.dart';
import '../../../../core/widgets/3d/stat_3d_card.dart';
import '../../../../core/widgets/3d/depth_card.dart';
import '../../../../core/network/offline_sync_manager.dart';
import '../../scanner/screens/ai_scanner_screen.dart';
import '../../orders/screens/orders_screen.dart';
import '../../profile/screens/profile_screen.dart';
import '../../admin_view/screens/admin_map_screen.dart';

class SellerHomeScreen extends StatefulWidget {
  const SellerHomeScreen({Key? key}) : super(key: key);

  @override
  State<SellerHomeScreen> createState() => _SellerHomeScreenState();
}

class _SellerHomeScreenState extends State<SellerHomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final List<Widget> pages = [
      _buildDashboardView(isDark),
      _buildProductsCatalogView(isDark),
      const SizedBox(), // Placeholder for center scanner action
      const OrdersScreen(userRole: "SELLER"),
      const ProfileScreen(userRole: "SELLER"),
    ];

    return Scaffold(
      body: SafeArea(child: pages[_currentIndex]),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      floatingActionButton: Container(
        height: 68,
        width: 68,
        margin: const EdgeInsets.only(top: 10),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: const LinearGradient(
            colors: [Color(0xFFE5A93B), Color(0xFFB45309)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: const [
            BoxShadow(
              color: Color(0x60E5A93B),
              blurRadius: 20,
              offset: Offset(0, 6),
            ),
          ],
        ),
        child: FloatingActionButton(
          elevation: 0,
          backgroundColor: Colors.transparent,
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const AiScannerScreen()),
            );
          },
          child: const Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.center_focus_strong_rounded, color: Color(0xFF0B0F19), size: 28),
              SizedBox(height: 2),
              Text(
                "SCAN",
                style: TextStyle(
                  color: Color(0xFF0B0F19),
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        shape: const CircularNotchedRectangle(),
        notchMargin: 8,
        color: isDark ? const Color(0xFF151C2C) : Colors.white,
        elevation: 10,
        child: SizedBox(
          height: 60,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _navItem(icon: Icons.home_rounded, label: "Home", index: 0),
              _navItem(icon: Icons.inventory_2_rounded, label: "Products", index: 1),
              const SizedBox(width: 48), // Space for centered scan button
              _navItem(icon: Icons.receipt_long_rounded, label: "Orders", index: 3),
              _navItem(icon: Icons.person_rounded, label: "Profile", index: 4),
            ],
          ),
        ),
      ),
    );
  }

  Widget _navItem({required IconData icon, required String label, required int index}) {
    final isSelected = _currentIndex == index;
    final color = isSelected ? const Color(0xFFE5A93B) : const Color(0xFF94A3B8);

    return InkWell(
      onTap: () => setState(() => _currentIndex = index),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 22),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              fontWeight: isSelected ? FontWeight.w800 : FontWeight.w500,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDashboardView(bool isDark) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Greetings & Offline indicator
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Good Morning, Savita 👋",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    "Your craft is ready for the world.",
                    style: TextStyle(
                      fontSize: 13,
                      color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.public_rounded, color: Color(0xFFE5A93B)),
                tooltip: "Admin 2.5D Cluster Map",
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const AdminMapScreen()));
                },
              ),
            ],
          ),

          // Offline sync queue banner
          ListenableBuilder(
            listenable: offlineSyncManager,
            builder: (context, _) {
              if (offlineSyncManager.pendingSyncCount == 0) return const SizedBox.shrink();
              return Container(
                margin: const EdgeInsets.only(top: 14),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E283D),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE5A93B).withOpacity(0.4)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.cloud_sync_rounded, color: Color(0xFFE5A93B), size: 18),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        "${offlineSyncManager.pendingSyncCount} items waiting to sync.",
                        style: const TextStyle(fontSize: 12, color: Color(0xFFF1F5F9), fontWeight: FontWeight.w600),
                      ),
                    ),
                    TextButton(
                      onPressed: () => offlineSyncManager.syncAll(),
                      child: const Text("Sync Now", style: TextStyle(color: Color(0xFFE5A93B), fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              );
            },
          ),

          // 3D Hero Sales Card
          HeroSalesCard(
            salesAmount: 42850.0,
            growthPercentage: 18.4,
            onTap: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const OrdersScreen(userRole: "SELLER")));
            },
          ),

          // 3D Stat Cards: 📦 24 Products, 👥 18 Buyers
          Row(
            children: [
              Stat3DCard(
                icon: "📦",
                count: "24",
                label: "Products",
                onTap: () => setState(() => _currentIndex = 1),
              ),
              const SizedBox(width: 14),
              Stat3DCard(
                icon: "👥",
                count: "18",
                label: "Buyers",
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("18 institutional buyers currently following your craft.")),
                  );
                },
              ),
            ],
          ),

          const SizedBox(height: 16),

          // ✨ AI Business Insight Card
          DepthCard(
            depth: 1.2,
            borderColor: const Color(0xFFE5A93B).withOpacity(0.35),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.auto_awesome_rounded, color: Color(0xFFE5A93B), size: 18),
                    SizedBox(width: 8),
                    Text(
                      "✨ AI BUSINESS INSIGHT",
                      style: TextStyle(
                        color: Color(0xFFE5A93B),
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                const Text(
                  "Demand for your handmade bags increased this week (+28%). Consider producing 15 more units ahead of festive sourcing.",
                  style: TextStyle(fontSize: 13, height: 1.5),
                ),
                const SizedBox(height: 12),
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const AiScannerScreen()),
                      );
                    },
                    child: const Text("Scan New Bag →", style: TextStyle(color: Color(0xFFE5A93B), fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildProductsCatalogView(bool isDark) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Your Catalogued Products", style: TextStyle(fontSize: 22, fontWeight: FontWeight.w900)),
          const SizedBox(height: 4),
          const Text("Digitized via One-Photo & Voice Pipeline", style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13)),
          const SizedBox(height: 18),
          Expanded(
            child: ListView(
              children: [
                _catalogItem("Handwoven Mulberry Silk Ikat Saree", "₹3,850", "Pochampally Ikat", "8 units", "http://127.0.0.1:8000/static/demo/saree_enhanced.jpg"),
                _catalogItem("Handcrafted Leather Shoulder Bag", "₹1,199", "Leathercraft", "14 units", "http://127.0.0.1:8000/static/demo/leather_bag_enhanced.jpg"),
                _catalogItem("Pochampally Cotton Dupatta", "₹890", "Resist Dyeing", "25 units", "http://127.0.0.1:8000/static/demo/dupatta.jpg"),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _catalogItem(String title, String price, String craft, String stock, String img) {
    return DepthCard(
      margin: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Image.network(img, width: 60, height: 60, fit: BoxFit.cover, errorBuilder: (_, __, ___) => Container(width: 60, height: 60, color: const Color(0xFF1E283D))),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                const SizedBox(height: 4),
                Text("$craft • $stock in stock", style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
              ],
            ),
          ),
          Text(price, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFFE5A93B))),
        ],
      ),
    );
  }
}
