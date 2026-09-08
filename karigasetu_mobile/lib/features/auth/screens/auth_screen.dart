import 'package:flutter/material.dart';
import '../../../../core/network/api_client.dart';
import '../../seller_home/screens/seller_home_screen.dart';
import '../../buyer_discovery/screens/buyer_home_screen.dart';
import 'otp_verification_screen.dart';

class AuthScreen extends StatefulWidget {
  final String defaultRole;

  const AuthScreen({Key? key, this.defaultRole = "SELLER"}) : super(key: key);

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final TextEditingController _contactController = TextEditingController();
  bool _isMobile = true;
  bool _isLoading = false;

  void _handleGoogleLogin() async {
    setState(() => _isLoading = true);
    await apiClient.demoLogin(widget.defaultRole);
    setState(() => _isLoading = false);

    if (widget.defaultRole == "SELLER") {
      Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const SellerHomeScreen()), (r) => false);
    } else {
      Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const BuyerHomeScreen()), (r) => false);
    }
  }

  void _sendOtp() async {
    final contact = _contactController.text.trim();
    if (contact.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please enter your ${_isMobile ? 'mobile number' : 'email'}")),
      );
      return;
    }

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => OtpVerificationScreen(
          contact: contact,
          isMobile: _isMobile,
          role: widget.defaultRole,
        ),
      ),
    );
  }

  void _quickJudgeLogin() async {
    setState(() => _isLoading = true);
    await apiClient.demoLogin(widget.defaultRole);
    setState(() => _isLoading = false);

    if (widget.defaultRole == "SELLER") {
      Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const SellerHomeScreen()), (r) => false);
    } else {
      Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const BuyerHomeScreen()), (r) => false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.defaultRole == "SELLER" ? "Artisan Sign In" : "Buyer Sourcing Portal"),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                widget.defaultRole == "SELLER"
                    ? "Welcome, Artisan 🎨"
                    : "Welcome, Corporate Buyer 🛍️",
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: 6),
              Text(
                "Access your AI business manager & market linkages.",
                style: TextStyle(fontSize: 14, color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
              ),
              const SizedBox(height: 28),

              // Demo One-Tap Login Banner for Judges
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFE5A93B).withOpacity(0.12),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE5A93B)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.bolt_rounded, color: Color(0xFFE5A93B), size: 18),
                        SizedBox(width: 6),
                        Text(
                          "SIH 2026 Live Evaluation",
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFFE5A93B)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      widget.defaultRole == "SELLER"
                          ? "Log in instantly as Demo Artisan (Savita Devi, Telangana)."
                          : "Log in instantly as Demo Buyer (Rajesh Kumar, FabCraft).",
                      style: const TextStyle(fontSize: 12, color: Color(0xFFCBD5E1)),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      height: 42,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _quickJudgeLogin,
                        child: Text("One-Tap Demo Login as ${widget.defaultRole}"),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 28),
              Center(
                child: Text(
                  "— OR CONTINUE WITH OAUTH / OTP —",
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8)),
                ),
              ),
              const SizedBox(height: 24),

              // Google OAuth Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: OutlinedButton.icon(
                  onPressed: _isLoading ? null : _handleGoogleLogin,
                  icon: const Icon(Icons.g_mobiledata_rounded, size: 28, color: Color(0xFFE5A93B)),
                  label: const Text("Continue with Google", style: TextStyle(fontWeight: FontWeight.bold)),
                  style: OutlinedButton.styleFrom(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Toggle between Mobile or Email OTP
              Row(
                children: [
                  Expanded(
                    child: ChoiceChip(
                      label: const Center(child: Text("Mobile OTP")),
                      selected: _isMobile,
                      onSelected: (val) => setState(() => _isMobile = true),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ChoiceChip(
                      label: const Center(child: Text("Email OTP")),
                      selected: !_isMobile,
                      onSelected: (val) => setState(() => _isMobile = false),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              TextField(
                controller: _contactController,
                keyboardType: _isMobile ? TextInputType.phone : TextInputType.emailAddress,
                decoration: InputDecoration(
                  labelText: _isMobile ? "Mobile Number" : "Email Address",
                  hintText: _isMobile ? "+91 98765 43210" : "artisan@example.com",
                  prefixIcon: Icon(_isMobile ? Icons.phone_rounded : Icons.email_rounded),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),

              const SizedBox(height: 18),

              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _sendOtp,
                  child: const Text("Send 6-Digit Verification Code"),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
