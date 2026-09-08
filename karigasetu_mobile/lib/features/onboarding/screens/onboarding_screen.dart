import 'package:flutter/material.dart';
import '../../../../core/widgets/3d/depth_card.dart';
import '../../auth/screens/auth_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({Key? key}) : super(key: key);

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int _step = 1;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
          child: _step == 1 ? _buildWelcomeStep(isDark) : _buildRoleStep(isDark),
        ),
      ),
    );
  }

  Widget _buildWelcomeStep(bool isDark) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const SizedBox(height: 20),
        Column(
          children: [
            // Floating 3D Brand Emblem
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(28),
                gradient: const LinearGradient(
                  colors: [Color(0xFFE5A93B), Color(0xFFB45309)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x60E5A93B),
                    blurRadius: 30,
                    offset: Offset(0, 10),
                  ),
                ],
              ),
              child: const Center(
                child: Text(
                  "K",
                  style: TextStyle(
                    fontSize: 52,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF0B0F19),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),
            const Text(
              "KARIGASETU AI",
              style: TextStyle(
                fontSize: 30,
                fontWeight: FontWeight.w900,
                letterSpacing: 1.5,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              "\"From Craft to Commerce\"",
              style: TextStyle(
                fontSize: 18,
                color: Color(0xFFE5A93B),
                fontWeight: FontWeight.w700,
                fontStyle: FontStyle.italic,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              "AI-driven market linkage and smart digital business manager for India's marginalized artisans.",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 14,
                height: 1.6,
                color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
              ),
            ),
          ],
        ),

        Column(
          children: [
            SizedBox(
              width: double.infinity,
              height: 54,
              child: ElevatedButton(
                onPressed: () => setState(() => _step = 2),
                child: const Text("Get Started →"),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              height: 54,
              child: OutlinedButton(
                onPressed: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const AuthScreen(defaultRole: "SELLER")),
                ),
                style: OutlinedButton.styleFrom(
                  side: BorderSide(
                    color: isDark ? const Color(0xFF334155) : const Color(0xFFCBD5E1),
                    width: 1.5,
                  ),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text("Sign In"),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildRoleStep(bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        IconButton(
          onPressed: () => setState(() => _step = 1),
          icon: const Icon(Icons.arrow_back_rounded),
        ),
        const SizedBox(height: 16),
        const Text(
          "How will you use\nKarigasetu AI?",
          style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900, height: 1.2),
        ),
        const SizedBox(height: 10),
        Text(
          "Select your account type to personalize your experience.",
          style: TextStyle(
            fontSize: 14,
            color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
          ),
        ),
        const SizedBox(height: 32),

        // 3D Card: SELLER / ARTISAN
        DepthCard(
          depth: 1.4,
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const AuthScreen(defaultRole: "SELLER")),
            );
          },
          child: const Row(
            children: [
              Text("🧑🎨", style: TextStyle(fontSize: 44)),
              SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "SELLER / ARTISAN",
                      style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
                    ),
                    SizedBox(height: 4),
                    Text(
                      "I create and sell handmade crafts. I want AI to photograph, price, and sell my products.",
                      style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8), height: 1.4),
                    ),
                  ],
                ),
              ),
              Icon(Icons.chevron_right_rounded, color: Color(0xFFE5A93B)),
            ],
          ),
        ),

        const SizedBox(height: 16),

        // 3D Card: BUYER
        DepthCard(
          depth: 1.4,
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const AuthScreen(defaultRole: "BUYER")),
            );
          },
          child: const Row(
            children: [
              Text("🛍️", style: TextStyle(fontSize: 44)),
              SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "BUYER / SOURCING",
                      style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
                    ),
                    SizedBox(height: 4),
                    Text(
                      "I discover and source authentic artisan products for retail, corporate, or exports.",
                      style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8), height: 1.4),
                    ),
                  ],
                ),
              ),
              Icon(Icons.chevron_right_rounded, color: Color(0xFFE5A93B)),
            ],
          ),
        ),
      ],
    );
  }
}
