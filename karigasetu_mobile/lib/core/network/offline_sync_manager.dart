import 'package:flutter/material.dart';

class OfflineSyncManager extends ChangeNotifier {
  int _pendingSyncCount = 3;
  bool _isOnline = true;

  int get pendingSyncCount => _pendingSyncCount;
  bool get isOnline => _isOnline;

  void toggleConnectivity() {
    _isOnline = !_isOnline;
    notifyListeners();
  }

  void addDraft() {
    _pendingSyncCount++;
    notifyListeners();
  }

  Future<void> syncAll() async {
    if (_pendingSyncCount == 0) return;
    await Future.delayed(const Duration(seconds: 1));
    _pendingSyncCount = 0;
    notifyListeners();
  }
}

final offlineSyncManager = OfflineSyncManager();
