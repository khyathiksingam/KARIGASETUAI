import 'package:flutter/material.dart';

class DepthCard extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry padding;
  final EdgeInsetsGeometry margin;
  final double borderRadius;
  final Color? backgroundColor;
  final Color? borderColor;
  final double depth;

  const DepthCard({
    Key? key,
    required this.child,
    this.onTap,
    this.padding = const EdgeInsets.all(20),
    this.margin = const EdgeInsets.symmetric(vertical: 8),
    this.borderRadius = 16,
    this.backgroundColor,
    this.borderColor,
    this.depth = 1.0,
  }) : super(key: key);

  @override
  State<DepthCard> createState() => _DepthCardState();
}

class _DepthCardState extends State<DepthCard> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final defaultBg = isDark ? const Color(0xFF151C2C) : Colors.white;
    final defaultBorder = isDark ? const Color(0xFF243049) : const Color(0xFFE2D9CC);

    return AnimatedContainer(
      duration: const Duration(milliseconds: 180),
      curve: Curves.easeOutCubic,
      margin: widget.margin,
      transform: Matrix4.identity()
        ..scale(_isPressed ? 0.97 : 1.0)
        ..translate(0.0, _isPressed ? 3.0 : 0.0),
      decoration: BoxDecoration(
        color: widget.backgroundColor ?? defaultBg,
        borderRadius: BorderRadius.circular(widget.borderRadius),
        border: Border.all(color: widget.borderColor ?? defaultBorder, width: 1.2),
        boxShadow: _isPressed
            ? [
                BoxShadow(
                  color: Colors.black.withOpacity(isDark ? 0.2 : 0.04),
                  blurRadius: 4 * widget.depth,
                  offset: Offset(0, 2 * widget.depth),
                ),
              ]
            : [
                BoxShadow(
                  color: Colors.black.withOpacity(isDark ? 0.45 : 0.08),
                  blurRadius: 16 * widget.depth,
                  offset: Offset(0, 8 * widget.depth),
                ),
                BoxShadow(
                  color: const Color(0xFFE5A93B).withOpacity(isDark ? 0.05 : 0.02),
                  blurRadius: 24 * widget.depth,
                  offset: const Offset(0, -2),
                ),
              ],
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(widget.borderRadius),
        child: InkWell(
          borderRadius: BorderRadius.circular(widget.borderRadius),
          onTap: widget.onTap,
          onTapDown: (_) => setState(() => _isPressed = true),
          onTapUp: (_) => setState(() => _isPressed = false),
          onTapCancel: () => setState(() => _isPressed = false),
          child: Padding(
            padding: widget.padding,
            child: widget.child,
          ),
        ),
      ),
    );
  }
}
