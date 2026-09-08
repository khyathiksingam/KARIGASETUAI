import 'package:flutter/material.dart';

class ScanningReticlePainter extends CustomPainter {
  final double progress;

  ScanningReticlePainter({required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    final bracketPaint = Paint()
      ..color = const Color(0xFFE5A93B)
      ..strokeWidth = 3.5
      ..style = PaintingStyle.stroke;

    final bracketLength = 28.0;

    // Top-Left Bracket
    canvas.drawLine(const Offset(16, 16), Offset(16 + bracketLength, 16), bracketPaint);
    canvas.drawLine(const Offset(16, 16), Offset(16, 16 + bracketLength), bracketPaint);

    // Top-Right Bracket
    canvas.drawLine(Offset(size.width - 16, 16), Offset(size.width - 16 - bracketLength, 16), bracketPaint);
    canvas.drawLine(Offset(size.width - 16, 16), Offset(size.width - 16, 16 + bracketLength), bracketPaint);

    // Bottom-Left Bracket
    canvas.drawLine(Offset(16, size.height - 16), Offset(16 + bracketLength, size.height - 16), bracketPaint);
    canvas.drawLine(Offset(16, size.height - 16), Offset(16, size.height - 16 - bracketLength), bracketPaint);

    // Bottom-Right Bracket
    canvas.drawLine(Offset(size.width - 16, size.height - 16), Offset(size.width - 16 - bracketLength, size.height - 16), bracketPaint);
    canvas.drawLine(Offset(size.width - 16, size.height - 16), Offset(size.width - 16, size.height - 16 - bracketLength), bracketPaint);

    // Glowing Laser Line
    final scanY = size.height * progress;
    final laserPaint = Paint()
      ..shader = LinearGradient(
        colors: [
          const Color(0xFFE5A93B).withOpacity(0.0),
          const Color(0xFFE5A93B).withOpacity(0.9),
          const Color(0xFFE5A93B).withOpacity(0.0),
        ],
      ).createShader(Rect.fromLTWH(0, scanY, size.width, 2.5));

    canvas.drawRect(Rect.fromLTWH(16, scanY, size.width - 32, 2.5), laserPaint);
  }

  @override
  bool shouldRepaint(covariant ScanningReticlePainter oldDelegate) => oldDelegate.progress != progress;
}
