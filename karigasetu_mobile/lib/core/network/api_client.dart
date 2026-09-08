import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiClient {
  static const String baseUrl = 'http://127.0.0.1:8000/api/v1';
  String? authToken;

  ApiClient({this.authToken});

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (authToken != null) 'Authorization': 'Bearer $authToken',
      };

  // Auth: Instant Demo Login
  Future<Map<String, dynamic>> demoLogin(String role) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/auth/demo-login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'role': role}),
      );
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        authToken = data['access_token'];
        return data;
      }
    } catch (_) {}
    // Offline local fallback
    return {
      'access_token': 'demo_token',
      'user': {'role': role, 'status': 'ACTIVE'},
      'profile': {'name': role == 'SELLER' ? 'Savita Devi' : 'Rajesh Kumar'}
    };
  }

  // Seller Dashboard
  Future<Map<String, dynamic>> getSellerDashboard() async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/seller/dashboard'), headers: _headers);
      if (res.statusCode == 200) return jsonDecode(res.body);
    } catch (_) {}
    return {
      'artisan_name': 'Savita',
      'greeting': 'Good Morning, Savita 👋',
      'subtitle': 'Your craft is ready for the world.',
      'hero_sales': {
        'monthly_sales_inr': 42850.0,
        'growth_percentage': 18.4,
        'chart_series': [28000.0, 31500.0, 36200.0, 39400.0, 42850.0]
      },
      'kpis': {'products_count': 24, 'buyers_count': 18, 'pending_rfqs': 3},
      'ai_business_insight': {
        'title': '✨ AI BUSINESS INSIGHT',
        'message': 'Demand for your handmade bags increased this week (+28%). Consider increasing production.'
      }
    };
  }

  // Vision Quality & Enhance
  Future<Map<String, dynamic>> checkImageQuality() async {
    try {
      final res = await http.post(Uri.parse('$baseUrl/ai/image-quality'), headers: _headers);
      if (res.statusCode == 200) return jsonDecode(res.body);
    } catch (_) {}
    return {
      'quality_score': 92,
      'sharpness': 94,
      'lighting': 89,
      'background': 93,
      'verdict': 'OPTIMAL',
      'tip': 'Image is crisp and well-lit. Ideal for catalogue generation.'
    };
  }

  Future<Map<String, dynamic>> enhanceImage() async {
    try {
      final res = await http.post(Uri.parse('$baseUrl/ai/image-enhance'), headers: _headers);
      if (res.statusCode == 200) return jsonDecode(res.body);
    } catch (_) {}
    return {
      'original_image_url': 'http://127.0.0.1:8000/static/demo/leather_bag_raw.jpg',
      'enhanced_image_url': 'http://127.0.0.1:8000/static/demo/leather_bag_enhanced.jpg',
      'enhancements_applied': ['AUTOCONTRAST_NORMALIZATION', 'STUDIO_LIGHTING_BOOST', 'WEAVE_TEXTURE_SHARPEN']
    };
  }

  // Multilingual Speech STT
  Future<Map<String, dynamic>> transcribeSpeech({String? speechText, String targetLang = 'en'}) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/ai/speech-to-text'),
        headers: _headers,
        body: jsonEncode({'simulated_speech': speechText, 'target_language': targetLang}),
      );
      if (res.statusCode == 200) return jsonDecode(res.body);
    } catch (_) {}
    return {
      'detected_language': 'te',
      'language_name': 'Telugu',
      'original_transcript': 'ఇది నేను చేతితో తయారు చేసిన చీర. దీనికి రెండు రోజులు పట్టింది.',
      'english_translation': 'This is a handwoven saree made by hand. It took two days to weave.'
    };
  }

  // Structured Catalog Generation
  Future<Map<String, dynamic>> generateCatalog(String transcript, String craftHint) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/ai/generate-catalog'),
        headers: _headers,
        body: jsonEncode({'voice_transcript': transcript, 'craft_type_hint': craftHint}),
      );
      if (res.statusCode == 200) return jsonDecode(res.body);
    } catch (_) {}
    return {
      'product_name': 'Handwoven Mulberry Silk Ikat Saree',
      'category': 'Textiles & Apparels',
      'material': 'Pure Mulberry Silk',
      'craft_type': 'Pochampally Ikat',
      'dimensions': '5.5m x 1.15m',
      'weight': '620g',
      'production_time': '2 days',
      'description': 'Authentic double-ikat pure silk handloom saree with geometric motifs.',
      'keywords': ['handloom', 'ikat', 'silk saree', 'pochampally'],
      'confidence': 0.94
    };
  }

  // Explainable AI Pricing
  Future<Map<String, dynamic>> suggestPrice({
    required double materialCost,
    required double labourHours,
    required String category,
  }) async {
    try {
      final res = await http.post(
        Uri.parse('$baseUrl/ai/suggest-price'),
        headers: _headers,
        body: jsonEncode({
          'material_cost': materialCost,
          'labour_hours': labourHours,
          'labour_rate_per_hour': 50.0,
          'packaging_cost': 50.0,
          'shipping_cost': 80.0,
          'desired_margin_percent': 25.0,
          'category': category,
        }),
      );
      if (res.statusCode == 200) return jsonDecode(res.body);
    } catch (_) {}
    return {
      'recommended_price': 1199.0,
      'min_price': 1000.0,
      'max_price': 1400.0,
      'expected_margin': 479.0,
      'confidence': 0.88,
      'explanation': 'Material (₹420) + Labour (₹300) + Packaging (₹50) + Shipping (₹80) + Market Demand (+₹180) + Margin (+₹169).'
    };
  }

  // Natural Language Search
  Future<List<dynamic>> searchProducts(String query) async {
    try {
      final res = await http.get(Uri.parse('$baseUrl/search/products?q=${Uri.encodeComponent(query)}'), headers: _headers);
      if (res.statusCode == 200) return jsonDecode(res.body);
    } catch (_) {}
    return [
      {
        'id': 'prod-1',
        'name': 'Handwoven Mulberry Silk Ikat Saree',
        'price': 3850.0,
        'category': 'Textiles & Apparels',
        'craft_type': 'Pochampally Ikat',
        'quality_score': 94,
        'image_url': 'http://127.0.0.1:8000/static/demo/saree_enhanced.jpg',
        'artisan_name': 'Savita Devi',
        'artisan_location': 'Telangana, India'
      },
      {
        'id': 'prod-18',
        'name': 'Shantiniketan Leather Messenger Bag',
        'price': 1890.0,
        'category': 'Leather Goods',
        'craft_type': 'Embossed Leatherwork',
        'quality_score': 92,
        'image_url': 'http://127.0.0.1:8000/static/demo/messenger_bag.jpg',
        'artisan_name': 'Anirban Mukherjee',
        'artisan_location': 'West Bengal, India'
      }
    ];
  }
}

final apiClient = ApiClient();
