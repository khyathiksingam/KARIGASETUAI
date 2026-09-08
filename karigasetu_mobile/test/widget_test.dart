import 'package:flutter_test/flutter_test.dart';
import 'package:karigasetu_mobile/main.dart';

void main() {
  testWidgets('Karigasetu AI App initializes with brand and tagline', (WidgetTester tester) async {
    await tester.pumpWidget(const KarigasetuApp());
    await tester.pumpAndSettle();

    expect(find.text('KARIGASETU AI'), findsOneWidget);
    expect(find.text('"From Craft to Commerce"'), findsOneWidget);
    expect(find.text('Get Started →'), findsOneWidget);
  });
}
