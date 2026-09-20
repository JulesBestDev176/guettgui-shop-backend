import 'package:flutter/material.dart';

/// Member card COMPACTE (row, pas aspect ratio 1.6).
/// height auto (~80px), radius 16px, padding 14px
/// gradient: 135deg #1A3C40 0%, #1B6A44 55%, #2EA831 100%
/// Glow orb gold top-right, dots pattern 14px, shimmer animated
/// Row: avatar 44dp + nom + elevage gold + badge Actif
class GGMemberCard extends StatefulWidget {
  final String farmName;
  final String userName;
  final String role;
  final bool isActive;
  final VoidCallback? onTap;

  const GGMemberCard({
    super.key,
    required this.farmName,
    required this.userName,
    required this.role,
    this.isActive = true,
    this.onTap,
  });

  @override
  State<GGMemberCard> createState() => _GGMemberCardState();
}

class _GGMemberCardState extends State<GGMemberCard>
    with SingleTickerProviderStateMixin {
  late final AnimationController _shimmerController;

  @override
  void initState() {
    super.initState();
    _shimmerController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 5),
    )..repeat();
  }

  @override
  void dispose() {
    _shimmerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: widget.onTap,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF1A3C40),
              Color(0xFF1B6A44),
              Color(0xFF2EA831),
            ],
            stops: [0.0, 0.55, 1.0],
          ),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(16),
          child: Stack(
            children: [
              // Glow orb gold top-right (150px, blur 6px)
              Positioned(
                top: -70,
                right: -30,
                child: Container(
                  width: 150,
                  height: 150,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [
                        const Color(0xFFC8960C).withValues(alpha: 0.32),
                        const Color(0xFFC8960C).withValues(alpha: 0.0),
                      ],
                    ),
                  ),
                ),
              ),

              // Dots pattern 14px grid white 0.13
              Positioned.fill(
                child: Opacity(
                  opacity: 0.45,
                  child: CustomPaint(
                    painter: _DotsPainter(),
                  ),
                ),
              ),

              // Shimmer animated
              AnimatedBuilder(
                animation: _shimmerController,
                builder: (context, child) {
                  final dx = _shimmerController.value * 400 - 70;
                  return Positioned(
                    left: dx,
                    top: 0,
                    bottom: 0,
                    child: Container(
                      width: 70,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.white.withValues(alpha: 0.0),
                            Colors.white.withValues(alpha: 0.12),
                            Colors.white.withValues(alpha: 0.0),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),

              // Content: Row
              Padding(
                padding: const EdgeInsets.all(14),
                child: Row(
                  children: [
                    // Avatar 44dp circle white 0.92 with logo.png 30x30
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.92),
                        shape: BoxShape.circle,
                      ),
                      child: Center(
                        child: Image.asset(
                          'assets/images/logo.png',
                          width: 30,
                          height: 30,
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    // Column: nom + elevage
                    Expanded(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            widget.userName,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Colors.white,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 3),
                          Text(
                            widget.farmName.toUpperCase(),
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 1,
                              color: Color(0xFFE8C05A),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    // Badge "Actif"
                    if (widget.isActive)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.16),
                          borderRadius: BorderRadius.circular(999),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.25),
                          ),
                        ),
                        child: const Text(
                          'Actif',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Dots pattern painter: 14px grid, white circles 1px radius, opacity 0.13
class _DotsPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withValues(alpha: 0.13)
      ..style = PaintingStyle.fill;

    const spacing = 14.0;
    const radius = 1.0;

    for (double x = 0; x < size.width; x += spacing) {
      for (double y = 0; y < size.height; y += spacing) {
        canvas.drawCircle(Offset(x, y), radius, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
