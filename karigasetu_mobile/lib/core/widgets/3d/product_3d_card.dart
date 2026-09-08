import 'package:flutter/material.dart';

class Product3DCard extends StatefulWidget {
  final String title;
  final String price;
  final String craftType;
  final String? artisanName;
  final String? location;
  final String imageUrl;
  final bool verifiedArtisan;
  final VoidCallback? onTap;

  const Product3DCard({
    Key? key,
    required this.title,
    required this.price,
    required this.craftType,
    this.artisanName,
    this.location,
    required this.imageUrl,
    this.verifiedArtisan = true,
    this.onTap,
  }) : super(key: key);

  @override
  State<Product3DCard> createState() => _Product3DCardState();
}

class _Product3DCardState extends State<Product3DCard> {
  double _rotateX = 0.0;
  double _rotateY = 0.0;
  bool _isHovered = false;

  void _onPointerMove(PointerMoveEvent event, Size size) {
    final centerX = size.width / 2;
    final centerY = size.height / 2;
    // Map pointer position to small angles (-0.1 to 0.1 rad)
    setState(() {
      _rotateY = (event.localPosition.dx - centerX) / centerX * 0.10;
      _rotateX = -(event.localPosition.dy - centerY) / centerY * 0.10;
    });
  }

  void _resetRotation() {
    setState(() {
      _rotateX = 0.0;
      _rotateY = 0.0;
      _isHovered = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xFF151C2C) : Colors.white;
    final borderColor = isDark ? const Color(0xFF243049) : const Color(0xFFE2D9CC);

    return LayoutBuilder(
      builder: (context, constraints) {
        final cardSize = Size(constraints.maxWidth, 300);

        return MouseRegion(
          onEnter: (_) => setState(() => _isHovered = true),
          onExit: (_) => _resetRotation(),
          onHover: (e) {
            final centerX = constraints.maxWidth / 2;
            final centerY = 150.0;
            setState(() {
              _rotateY = (e.localPosition.dx - centerX) / centerX * 0.12;
              _rotateX = -(e.localPosition.dy - centerY) / centerY * 0.12;
            });
          },
          child: Listener(
            onPointerMove: (e) => _onPointerMove(e, cardSize),
            onPointerUp: (_) => _resetRotation(),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 160),
              curve: Curves.easeOutCubic,
              transform: Matrix4.identity()
                ..setEntry(3, 2, 0.001) // perspective
                ..rotateX(_rotateX)
                ..rotateY(_rotateY)
                ..scale(_isHovered ? 1.02 : 1.0),
              decoration: BoxDecoration(
                color: cardBg,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: borderColor, width: 1.2),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(isDark ? 0.4 : 0.08),
                    blurRadius: _isHovered ? 24 : 14,
                    offset: Offset(-_rotateY * 20, 8 + _rotateX * 20),
                  ),
                  BoxShadow(
                    color: const Color(0xFFE5A93B).withOpacity(_isHovered ? 0.15 : 0.0),
                    blurRadius: 20,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: widget.onTap,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Parallax product image container with depth
                        Stack(
                          children: [
                            Container(
                              height: 160,
                              width: double.infinity,
                              color: isDark ? const Color(0xFF0F1523) : const Color(0xFFF1EDE6),
                              child: Transform.translate(
                                offset: Offset(-_rotateY * 12, -_rotateX * 12),
                                child: Image.network(
                                  widget.imageUrl,
                                  fit: BoxFit.cover,
                                  errorBuilder: (_, __, ___) => Container(
                                    color: const Color(0xFF1E283D),
                                    child: const Center(
                                      child: Icon(Icons.image_outlined, size: 48, color: Color(0xFFE5A93B)),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            // Verified Artisan Floating Badge
                            if (widget.verifiedArtisan)
                              Positioned(
                                top: 12,
                                right: 12,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF151C2C).withOpacity(0.85),
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(color: const Color(0xFF10B981), width: 1),
                                  ),
                                  child: const Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 13),
                                      SizedBox(width: 4),
                                      Text(
                                        "Verified Artisan",
                                        style: TextStyle(
                                          color: Color(0xFF10B981),
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                          ],
                        ),

                        // Content Details
                        Padding(
                          padding: const EdgeInsets.all(14),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                widget.title,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w700,
                                  color: isDark ? Colors.white : const Color(0xFF1E293B),
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                widget.craftType,
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Color(0xFFE5A93B),
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              const SizedBox(height: 10),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.between,
                                children: [
                                  Text(
                                    widget.price,
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w900,
                                      color: isDark ? Colors.white : const Color(0xFF0F172A),
                                    ),
                                  ),
                                  if (widget.location != null)
                                    Text(
                                      widget.location!.split(",")[0],
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B),
                                      ),
                                    ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
