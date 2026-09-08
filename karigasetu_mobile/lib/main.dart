import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'core/network/offline_sync_manager.dart';
import 'features/onboarding/screens/onboarding_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => offlineSyncManager),
      ],
      child: const KarigasetuApp(),
    ),
  );
}

class KarigasetuApp extends StatefulWidget {
  const KarigasetuApp({Key? key}) : super(key: key);

  @override
  State<KarigasetuApp> createState() => _KarigasetuAppState();
}

class _KarigasetuAppState extends State<KarigasetuApp> {
  ThemeMode _themeMode = ThemeMode.dark;

  void toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KARIGASETU AI - From Craft to Commerce',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: _themeMode,
      home: const OnboardingScreen(),
    );
  }
}
