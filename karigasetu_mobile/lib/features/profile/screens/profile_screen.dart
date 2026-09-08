import 'package:flutter/material.dart';
import '../../../../core/widgets/3d/depth_card.dart';
import '../../onboarding/screens/onboarding_screen.dart';

class ProfileScreen extends StatefulWidget {
  final String userRole;

  const ProfileScreen({Key? key, this.userRole = "SELLER"}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String _currentLang = "English";

  void _showLanguageSelector() {
    final langs = ["English", "हिन्दी (Hindi)", "తెలుగు (Telugu)", "தமிழ் (Tamil)", "ಕನ್ನಡ (Kannada)", "मराठी (Marathi)", "বাংলা (Bengali)"];
    showModalBottomSheet(
      context: context,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Select Application Language", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 12),
            ...langs.map((l) => ListTile(
                  title: Text(l),
                  trailing: _currentLang == l ? const Icon(Icons.check_circle_rounded, color: Color(0xFFE5A93B)) : null,
                  onTap: () {
                    setState(() => _currentLang = l);
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Language updated to $l")));
                  },
                )),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(title: const Text("Business Profile & Readiness")),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            // Profile Card with Circular Readiness Indicator
            DepthCard(
              depth: 1.3,
              child: Row(
                children: [
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      const SizedBox(
                        width: 74,
                        height: 74,
                        child: CircularProgressIndicator(
                          value: 0.84,
                          strokeWidth: 6,
                          backgroundColor: Color(0xFF243049),
                          color: Color(0xFFE5A93B),
                        ),
                      ),
                      CircleAvatar(
                        radius: 30,
                        backgroundColor: const Color(0xFF1E283D),
                        child: Text(
                          widget.userRole == "SELLER" ? "SD" : "RK",
                          style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFE5A93B), fontSize: 18),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 18),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.userRole == "SELLER" ? "Savita Devi" : "Rajesh Kumar",
                          style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          widget.userRole == "SELLER" ? "Savita Ikat Handlooms • Telangana" : "FabCraft Ethical Retail",
                          style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                        ),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981).withOpacity(0.15),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0xFF10B981)),
                          ),
                          child: const Text("84% Digital Readiness", style: TextStyle(color: Color(0xFF10B981), fontSize: 11, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 18),

            // Export Readiness Checklist (Readiness checklist, not legal advice)
            DepthCard(
              depth: 1.1,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Text("Export Readiness Score", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      Text("78%", style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFFE5A93B))),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const LinearProgressIndicator(
                    value: 0.78,
                    backgroundColor: Color(0xFF243049),
                    color: Color(0xFFE5A93B),
                  ),
                  const SizedBox(height: 12),
                  const Text("Missing for 100% Export Readiness:", style: TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
                  const SizedBox(height: 4),
                  const Text("• Dimensions and packaging tare weight on 2 draft listings", style: TextStyle(fontSize: 12, color: Color(0xFFF1F5F9))),
                  const Text("• Digital certificate of origin (Handicrafts Council)", style: TextStyle(fontSize: 12, color: Color(0xFFF1F5F9))),
                ],
              ),
            ),

            const SizedBox(height: 18),

            // Settings Options
            _settingTile(Icons.language_rounded, "Application Language", _currentLang, _showLanguageSelector),
            _settingTile(Icons.dark_mode_rounded, "Theme Preference", isDark ? "Dark Mode" : "Light Mode", () {}),
            _settingTile(Icons.notifications_rounded, "Notifications & RFQ Alerts", "Enabled", () {}),
            _settingTile(Icons.security_rounded, "Account & Verification Badges", "Artisan Verified ✓", () {}),
            _settingTile(Icons.info_rounded, "About Karigasetu AI", "v1.0.0 (SIH 2026)", () {}),

            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              height: 48,
              child: OutlinedButton.icon(
                onPressed: () {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (_) => const OnboardingScreen()),
                    (r) => false,
                  );
                },
                icon: const Icon(Icons.logout_rounded, color: Colors.redAccent),
                label: const Text("Sign Out", style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
                style: OutlinedButton.styleFrom(side: const BorderSide(color: Colors.redAccent)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _settingTile(IconData icon, String title, String subtitle, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: const Color(0xFFE5A93B)),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
      subtitle: Text(subtitle, style: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8))),
      trailing: const Icon(Icons.chevron_right_rounded, size: 20),
      onTap: onTap,
    );
  }
}
