import 'dart:async';
import 'package:flutter/material.dart';
import '../../../../core/network/api_client.dart';
import '../../seller_home/screens/seller_home_screen.dart';
import '../../buyer_discovery/screens/buyer_home_screen.dart';

class OtpVerificationScreen extends StatefulWidget {
  final String contact;
  final bool isMobile;
  final String role;

  const OtpVerificationScreen({
    Key? key,
    required this.contact,
    required this.isMobile,
    required this.role,
  }) : super(key: key);

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  final List<TextEditingController> _controllers = List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(6, (_) => FocusNode());
  int _secondsLeft = 42;
  Timer? _timer;
  bool _isVerifying = false;

  @override
  void initState() {
    super.initState();
    _startCountdown();
  }

  void _startCountdown() {
    _timer?.cancel();
    _secondsLeft = 42;
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_secondsLeft > 0) {
        setState(() => _secondsLeft--);
      } else {
        t.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    for (var c in _controllers) {
      c.dispose();
    }
    for (var f in _focusNodes) {
      f.dispose();
    }
    super.dispose();
  }

  void _verifyOtp() async {
    final entered = _controllers.map((c) => c.text).join();
    if (entered.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please enter the complete 6-digit verification code.")),
      );
      return;
    }

    setState(() => _isVerifying = true);
    await Future.delayed(const Duration(milliseconds: 600));
    await apiClient.demoLogin(widget.role);
    setState(() => _isVerifying = false);

    if (widget.role == "SELLER") {
      Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const SellerHomeScreen()), (r) => false);
    } else {
      Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (_) => const BuyerHomeScreen()), (r) => false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(title: const Text("Verify Account")),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Verify your account",
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900),
              ),
              const SizedBox(height: 8),
              Text(
                "We sent a 6-digit code to ${widget.contact}.",
                style: TextStyle(fontSize: 14, color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B)),
              ),
              const SizedBox(height: 32),

              // 6 Distinct Input Boxes
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: List.generate(6, (idx) {
                  return Container(
                    width: 48,
                    height: 58,
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF151C2C) : Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: _controllers[idx].text.isNotEmpty
                            ? const Color(0xFFE5A93B)
                            : (isDark ? const Color(0xFF243049) : const Color(0xFFCBD5E1)),
                        width: 1.5,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(isDark ? 0.2 : 0.05),
                          blurRadius: 8,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: TextField(
                      controller: _controllers[idx],
                      focusNode: _focusNodes[idx],
                      textAlign: TextAlign.center,
                      keyboardType: TextInputType.number,
                      maxLength: 1,
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                      decoration: const InputDecoration(
                        counterText: "",
                        border: InputBorder.none,
                      ),
                      onChanged: (val) {
                        if (val.isNotEmpty && idx < 5) {
                          _focusNodes[idx + 1].requestFocus();
                        } else if (val.isEmpty && idx > 0) {
                          _focusNodes[idx - 1].requestFocus();
                        }
                        if (idx == 5 && val.isNotEmpty) {
                          _verifyOtp();
                        }
                        setState(() {});
                      },
                    ),
                  );
                }),
              ),

              const SizedBox(height: 24),

              Center(
                child: Text(
                  _secondsLeft > 0
                      ? "Resend code in 00:${_secondsLeft.toString().padLeft(2, '0')}"
                      : "Didn't receive code?",
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                  ),
                ),
              ),

              if (_secondsLeft == 0)
                Center(
                  child: TextButton(
                    onPressed: _startCountdown,
                    child: const Text("Resend 6-Digit Code", style: TextStyle(color: Color(0xFFE5A93B), fontWeight: FontWeight.bold)),
                  ),
                ),

              const Spacer(),

              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _isVerifying ? null : _verifyOtp,
                  child: _isVerifying
                      ? const CircularProgressIndicator(color: Color(0xFF0B0F19))
                      : const Text("Verify & Proceed →"),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
