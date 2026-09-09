// Multi-Language Translation Service (i18n) for KARIGASETU.AI
// Supports 7 Indian Languages: English, Hindi, Telugu, Tamil, Kannada, Marathi, Bengali
import React from 'react';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা' },
];

const TRANSLATIONS = {
  en: {
    // Navigation
    home: 'Home',
    marketplace: 'Marketplace',
    howItWorks: 'How It Works',
    aiAnalyzer: 'AI Product Analyzer',
    artisanPortal: 'Artisan Portal',
    myOrders: 'My Orders',
    wishlist: 'Wishlist',
    cart: 'Cart',
    login: 'Login',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    loggedInAs: 'Logged in as',
    credits: 'Credits',
    artisanDashboard: 'Artisan Dashboard',
    myProducts: 'My Products',
    exploreCrafts: 'Explore Crafts',

    // Brand Tagline
    tagline: 'From Artisan to Market — Powered by AI',
    subtagline: 'PEOPLE | CRAFTS | CULTURE | A BRIGHTER TOMORROW',

    // Analyzer & Scanning
    scanTitle: 'AI Product Analyzer',
    scanSubtitle: 'Neural computer vision appraisal for authentic Indian handicrafts',
    uploadPrompt: 'Upload craft photos for automated multi-spectral analysis',
    dragDrop: 'Drag and drop handicraft photos here, or',
    browseFiles: 'Browse Device',
    openCamera: 'Use Camera',
    imagesAnalyzed: 'Images Analyzed',
    frontView: 'Front View (Required)',
    backView: 'Back View',
    sideView: 'Side View',
    detailView: 'Close-up Detail',
    analyzeButton: 'Run AI Product Analysis',
    analyzing: 'Analyzing Craft Pixels...',

    // Analyzer Sections
    section1: '01 Product Identification',
    section2: '02 Visual & Physical Details',
    section3: '03 Quality Assessment',
    section4: '04 Fair Market Appraisal',
    section5: '05 AI Confidence Gauge',
    section6: '06 Artisan Confirmation',

    // Identification Fields
    craftName: 'Identified Craft Name',
    category: 'Craft Category',
    traditionalType: 'Traditional Craft Type',
    regionState: 'Region / State of Origin',
    giStatus: 'GI Status',
    giNotVerified: 'GI Status: Not Verified',
    description: 'Visual Description',
    notConfidentlyDetected: 'Not confidently detected',

    // Quality Fields
    materialAuthenticity: 'Material Authenticity',
    craftsmanshipPrecision: 'Craftsmanship Precision',
    structuralIntegrity: 'Structural Integrity',
    surfaceFinish: 'Surface Finish',
    symmetryAlignment: 'Symmetry & Alignment',
    qualitySummary: 'AI Quality Assessment Summary',

    // Pricing Fields
    materialCost: 'Raw Material Cost',
    artisanLabor: 'Artisan Labor (Fair Living Wage)',
    minSustainablePrice: 'Minimum Sustainable Price',
    marketPriceRange: 'Market Price Range',
    suggestedPrice: 'AI Suggested Listing Price',
    pricingBasis: 'Transparent Pricing Basis',

    // Actions
    editDetails: 'Edit / Confirm AI Details',
    publishToMarketplace: 'Publish to Marketplace',
    listYourCraft: 'List Your Craft',
    noProductsYet: 'No artisan products listed yet. Be the first artisan to add a craft.',
    noMatchingProducts: 'No matching handicrafts found. Try adjusting your filters.',
    resetFilters: 'Reset All Filters',
    testWithSampleCrafts: 'Test AI Analyzer with Sample Crafts',
    sampleCraftsDesc: 'Evaluators can select sample handicraft images below to test the AI analyzer across distinct craft disciplines:',
  },

  hi: {
    home: 'होम',
    marketplace: 'मार्केटप्लेस',
    howItWorks: 'यह कैसे काम करता है',
    aiAnalyzer: 'एआई उत्पाद विश्लेषक',
    artisanPortal: 'कारीगर पोर्टल',
    myOrders: 'मेरे ऑर्डर',
    wishlist: 'पसंदीदा सूची',
    cart: 'कार्ट',
    login: 'लॉग इन',
    signUp: 'साइन अप',
    signOut: 'लॉग आउट',
    loggedInAs: 'लॉग इन किया गया',
    credits: 'क्रेडिट्स',
    artisanDashboard: 'कारीगर डैशबोर्ड',
    myProducts: 'मेरे उत्पाद',
    exploreCrafts: 'शिल्प देखें',

    tagline: 'कारीगर से बाजार तक — एआई द्वारा संचालित',
    subtagline: 'जन | शिल्प | संस्कृति | एक उज्ज्वल कल',

    scanTitle: 'एआई उत्पाद विश्लेषक',
    scanSubtitle: 'प्रामाणिक भारतीय हस्तशिल्प के लिए कंप्यूटर विज़न मूल्यांकन',
    uploadPrompt: 'स्वचालित बहु-दृष्टिकोण विश्लेषण के लिए शिल्प की तस्वीरें अपलोड करें',
    dragDrop: 'हस्तशिल्प की तस्वीरें यहाँ खींचें और छोड़ें, या',
    browseFiles: 'डिवाइस से चुनें',
    openCamera: 'कैमरा खोलें',
    imagesAnalyzed: 'विश्लेषण की गई छवियाँ',
    frontView: 'सामने का दृश्य (अनिवार्य)',
    backView: 'पीछे का दृश्य',
    sideView: 'किनारे का दृश्य',
    detailView: 'नजदीकी विवरण',
    analyzeButton: 'एआई उत्पाद विश्लेषण शुरू करें',
    analyzing: 'शिल्प पिक्सल का विश्लेषण हो रहा है...',

    section1: '01 उत्पाद पहचान',
    section2: '02 दृश्य और भौतिक विवरण',
    section3: '03 गुणवत्ता मूल्यांकन',
    section4: '04 निष्पक्ष बाजार मूल्यांकन',
    section5: '05 एआई विश्वास गेज',
    section6: '06 कारीगर पुष्टि',

    craftName: 'पहचाना गया शिल्प नाम',
    category: 'शिल्प श्रेणी',
    traditionalType: 'पारंपरिक शिल्प प्रकार',
    regionState: 'उत्पत्ति क्षेत्र / राज्य',
    giStatus: 'जीआई स्थिति',
    giNotVerified: 'जीआई स्थिति: सत्यापित नहीं',
    description: 'दृश्य विवरण',
    notConfidentlyDetected: 'विश्वास के साथ नहीं पहचाना गया',

    materialAuthenticity: 'सामग्री प्रामाणिकता',
    craftsmanshipPrecision: 'कारीगरी सटीकता',
    structuralIntegrity: 'संरचनात्मक अखंडता',
    surfaceFinish: 'सतह की फिनिश',
    symmetryAlignment: 'समरूपता और संरेखण',
    qualitySummary: 'एआई गुणवत्ता मूल्यांकन सारांश',

    materialCost: 'कच्चे माल की लागत',
    artisanLabor: 'कारीगर श्रम (निष्पक्ष जीवन मजदूरी)',
    minSustainablePrice: 'न्यूनतम टिकाऊ मूल्य',
    marketPriceRange: 'बाजार मूल्य सीमा',
    suggestedPrice: 'एआई अनुशंसित लिस्टिंग मूल्य',
    pricingBasis: 'पारदर्शी मूल्य निर्धारण आधार',

    editDetails: 'एआई विवरण संपादित / पुष्टि करें',
    publishToMarketplace: 'मार्केटप्लेस में प्रकाशित करें',
    listYourCraft: 'अपना शिल्प सूचीबद्ध करें',
    noProductsYet: 'अभी तक कोई कारीगर उत्पाद सूचीबद्ध नहीं है। शिल्प जोड़ने वाले पहले कारीगर बनें।',
    noMatchingProducts: 'कोई मेल खाता हस्तशिल्प नहीं मिला। कृपया अपने फ़िल्टर समायोजित करें।',
    resetFilters: 'सभी फ़िल्टर रीसेट करें',
    testWithSampleCrafts: 'नमूना शिल्पों के साथ एआई विश्लेषक का परीक्षण करें',
    sampleCraftsDesc: 'मूल्यांकनकर्ता विभिन्न शिल्प शैलियों पर एआई विश्लेषक का परीक्षण करने के लिए नीचे नमूना चित्र चुन सकते हैं:',
  },

  te: {
    home: 'హోమ్',
    marketplace: 'మార్కెట్‌ప్లేస్',
    howItWorks: 'ఇది ఎలా పనిచేస్తుంది',
    aiAnalyzer: 'AI ఉత్పత్తి విశ్లేషణ',
    artisanPortal: 'చేతివృత్తుల పోర్టల్',
    myOrders: 'నా ఆర్డర్లు',
    wishlist: 'కోరికల జాబితా',
    cart: 'కార్ట్',
    login: 'లాగిన్',
    signUp: 'సైన్ అప్',
    signOut: 'లాగ్ అవుట్',
    loggedInAs: 'లాగిన్ అయ్యారు',
    credits: 'క్రెడిట్స్',
    artisanDashboard: 'చేతివృత్తుల డాష్‌బోర్డ్',
    myProducts: 'నా ఉత్పత్తులు',
    exploreCrafts: 'చేతిపనులను అన్వేషించండి',

    tagline: 'చేతివృత్తుల నుండి మార్కెట్‌కు — AI ఆధారితం',
    subtagline: 'ప్రజలు | కళలు | సంస్కృతి | ఉజ్వల భవిష్యత్తు',

    scanTitle: 'AI ఉత్పత్తి విశ్లేషణ',
    scanSubtitle: 'ప్రామాణిక భారతీయ చేతిపనుల కోసం న్యూరల్ కంప్యూటర్ విజన్ అంచనా',
    uploadPrompt: 'AI విశ్లేషణ కోసం చేతిపనుల ఫోటోలను అప్‌లోడ్ చేయండి',
    dragDrop: 'ఫోటోలను ఇక్కడ డ్రాగ్ చేయండి, లేదా',
    browseFiles: 'పరికరంలో ఎంచుకోండి',
    openCamera: 'కెమెరా వాడండి',
    imagesAnalyzed: 'విశ్లేషించిన చిత్రాలు',
    frontView: 'ముందు దృశ్యం (తప్పనిసరి)',
    backView: 'వెనుక దృశ్యం',
    sideView: 'పక్క దృశ్యం',
    detailView: 'సమీప వివరాలు',
    analyzeButton: 'AI విశ్లేషణ ప్రారంభించండి',
    analyzing: 'చిత్ర వివరాలు విశ్లేషించబడుతున్నాయి...',

    section1: '01 ఉత్పత్తి గుర్తింపు',
    section2: '02 దృశ్య మరియు భౌతిక వివరాలు',
    section3: '03 నాణ్యత అంచనా',
    section4: '04 న్యాయమైన మార్కెట్ ధర అంచనా',
    section5: '05 AI విశ్వాస స్థాయి',
    section6: '06 కళాకారుని ధృవీకరణ',

    craftName: 'గుర్తించబడిన కళారూపం',
    category: 'కళా వర్గం',
    traditionalType: 'సాంప్రదాయ కళా రకం',
    regionState: 'ప్రాంతం / రాష్ట్రం',
    giStatus: 'GI స్థితి',
    giNotVerified: 'GI స్థితి: ధృవీకరించబడలేదు',
    description: 'విజువల్ వివరణ',
    notConfidentlyDetected: 'ఖచ్చితంగా గుర్తించబడలేదు',

    materialAuthenticity: 'పదార్థ ప్రామాణికత',
    craftsmanshipPrecision: 'నైపుణ్య ఖచ్చితత్వం',
    structuralIntegrity: 'నిర్మాణ దృఢత్వం',
    surfaceFinish: 'ఉపరితల ఫినిషింగ్',
    symmetryAlignment: 'సమరూపత',
    qualitySummary: 'AI నాణ్యత అంచనా సారాంశం',

    materialCost: 'ముడిసరుకు ఖర్చు',
    artisanLabor: 'శ్రమ వేతనం (న్యాయమైన జీవన వేతనం)',
    minSustainablePrice: 'కనీస స్థిరమైన ధర',
    marketPriceRange: 'మార్కెట్ ధర శ్రేణి',
    suggestedPrice: 'AI సూచించిన లిస్టింగ్ ధర',
    pricingBasis: 'పారదర్శక ధర విధానం',

    editDetails: 'వివరాలను సవరించండి / ధృవీకరించండి',
    publishToMarketplace: 'మార్కెట్‌లో ప్రచురించండి',
    listYourCraft: 'మీ కళారూపాన్ని జోడించండి',
    noProductsYet: 'ఇంకా ఉత్పత్తులు జాబితా చేయబడలేదు. మీ కళారూపాన్ని మొదటిగా చేర్చండి.',
    noMatchingProducts: 'సరిపోలే ఉత్పత్తులు కనుగొనబడలేదు. ఫిల్టర్లను మార్చండి.',
    resetFilters: 'ఫిల్టర్లను రీసెట్ చేయండి',
    testWithSampleCrafts: 'నమూనా చిత్రాలతో AIని పరీక్షించండి',
    sampleCraftsDesc: 'పరీక్షించడానికి క్రింది నమూనా చిత్రాలను ఎంచుకోవచ్చు:',
  },

  ta: {
    home: 'முகப்பு',
    marketplace: 'சந்தை',
    howItWorks: 'செயல்படும் விதம்',
    aiAnalyzer: 'AI தயாரிப்பு பகுப்பாய்வு',
    artisanPortal: 'கைவினைஞர் போர்டல்',
    myOrders: 'எனது ஆர்டர்கள்',
    wishlist: 'விருப்பப்பட்டியல்',
    cart: 'கூடை',
    login: 'உள்நுழைக',
    signUp: 'பதிவு செய்க',
    signOut: 'வெளியேறுக',
    loggedInAs: 'உள்நுழைந்துள்ளீர்',
    credits: 'கிரெடிட்கள்',
    artisanDashboard: 'கைவினைஞர் டாஷ்போர்டு',
    myProducts: 'எனது தயாரிப்புகள்',
    exploreCrafts: 'கைவினைப் பொருட்களை ஆராய்க',

    tagline: 'கைவினைஞரிடமிருந்து சந்தைக்கு — AI மூலம்',
    subtagline: 'மக்கள் | கைவினை | கலாச்சாரம் | ஒளிமயமான எதிர்காலம்',

    scanTitle: 'AI தயாரிப்பு பகுப்பாய்வு',
    scanSubtitle: 'பாரம்பரிய இந்திய கைவினைப் பொருட்களுக்கான கணினி பார்வை மதிப்பீடு',
    uploadPrompt: 'பகுப்பாய்வுக்கு புகைப்படங்களைப் பதிவேற்றுக',
    dragDrop: 'புகைப்படங்களை இங்கே இழுத்து விடவும், அல்லது',
    browseFiles: 'கோப்புகளைத் தேர்ந்தெடுக்கவும்',
    openCamera: 'கேமரா பயன்படுத்துக',
    imagesAnalyzed: 'பகுப்பாய்வு செய்யப்பட்ட படங்கள்',
    frontView: 'முன் தோற்றம் (கட்டாயம்)',
    backView: 'பின் தோற்றம்',
    sideView: 'பக்கத் தோற்றம்',
    detailView: 'நெருக்கமான விவரம்',
    analyzeButton: 'AI பகுப்பாய்வைத் தொடங்கு',
    analyzing: 'படங்கள் பகுப்பாய்வு செய்யப்படுகின்றன...',

    section1: '01 தயாரிப்பு அடையாளம்',
    section2: '02 காட்சி & உடல் விவரங்கள்',
    section3: '03 தர மதிப்பீடு',
    section4: '04 நியாயமான சந்தை மதிப்பீடு',
    section5: '05 AI நம்பிக்கை அளவீடு',
    section6: '06 கைவினைஞர் உறுதிப்படுத்தல்',

    craftName: 'கண்டறியப்பட்ட கைவினைப் பெயர்',
    category: 'கைவினைப் பிரிவு',
    traditionalType: 'பாரம்பரிய கைவினை வகை',
    regionState: 'பகுதி / மாநிலம்',
    giStatus: 'GI நிலை',
    giNotVerified: 'GI நிலை: சரிபார்க்கப்படவில்லை',
    description: 'விளக்கம்',
    notConfidentlyDetected: 'உறுதியாக கண்டறியப்படவில்லை',

    materialAuthenticity: 'பொருள் உண்மைத்தன்மை',
    craftsmanshipPrecision: 'கைவினைத் துல்லியம்',
    structuralIntegrity: 'கட்டமைப்பு ஒருமைப்பாடு',
    surfaceFinish: 'மேற்பரப்பு பூச்சு',
    symmetryAlignment: 'சமச்சீர்மை',
    qualitySummary: 'AI தர மதிப்பீட்டு சுருக்கம்',

    materialCost: 'மூலப்பொருள் செலவு',
    artisanLabor: 'கைவினைஞர் ஊதியம் (நியாயமான வாழ்க்கை ஊதியம்)',
    minSustainablePrice: 'குறைந்தபட்ச நிலையான விலை',
    marketPriceRange: 'சந்தை விலை வரம்பு',
    suggestedPrice: 'AI பரிந்துரைக்கப்பட்ட விலை',
    pricingBasis: 'வெளிப்படையான விலை அடிப்படை',

    editDetails: 'விவரங்களைத் திருத்து / உறுதிப்படுத்து',
    publishToMarketplace: 'சந்தையில் வெளியிடு',
    listYourCraft: 'உங்கள் கைவினைப் பொருளைப் பட்டியலிடுக',
    noProductsYet: 'இன்னும் கைவினைப் பொருட்கள் பட்டியலிடப்படவில்லை. முதல் நபராக சேர்க்கவும்.',
    noMatchingProducts: 'பொருந்தும் பொருட்கள் எதுவும் கிடைக்கவில்லை.',
    resetFilters: 'அனைத்து வடிகட்டிகளையும் மீட்டமைக்கவும்',
    testWithSampleCrafts: 'மாதிரி கைவினைகளுடன் AI சோதிக்கவும்',
    sampleCraftsDesc: 'AI சோதிக்க கீழே உள்ள மாதிரி படங்களைத் தேர்ந்தெடுக்கலாம்:',
  },

  kn: {
    home: 'ಮುಖಪುಟ',
    marketplace: 'ಮಾರುಕಟ್ಟೆ',
    howItWorks: 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
    aiAnalyzer: 'AI ಉತ್ಪನ್ನ ವಿಶ್ಲೇಷಕ',
    artisanPortal: 'ಕುಶಲಕರ್ಮಿ ಪೋರ್ಟಲ್',
    myOrders: 'ನನ್ನ ಆದೇಶಗಳು',
    wishlist: 'ಮೆಚ್ಚಿನವುಗಳು',
    cart: 'ಕಾರ್ಟ್',
    login: 'ಲಾಗಿನ್',
    signUp: 'ಸೈನ್ ಅಪ್',
    signOut: 'ಲಾಗ್ ಔಟ್',
    loggedInAs: 'ಲಾಗಿನ್ ಆಗಿರುವವರು',
    credits: 'ಕ್ರೆಡಿಟ್‌ಗಳು',
    artisanDashboard: 'ಕುಶಲಕರ್ಮಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    myProducts: 'ನನ್ನ ಉತ್ಪನ್ನಗಳು',
    exploreCrafts: 'ಕರಕುಶಲಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',

    tagline: 'ಕುಶಲಕರ್ಮಿಯಿಂದ ಮಾರುಕಟ್ಟೆಗೆ — AI ಚಾಲಿತ',
    subtagline: 'ಜನರು | ಕರಕುಶಲ | ಸಂಸ್ಕೃತಿ | ಉಜ್ವಲ ಭವಿಷ್ಯ',

    scanTitle: 'AI ಉತ್ಪನ್ನ ವಿಶ್ಲೇಷಕ',
    scanSubtitle: 'ಭಾರತೀಯ ಕರಕುಶಲ ವಸ್ತುಗಳಿಗೆ ಕಂಪ್ಯೂಟರ್ ದೃಷ್ಟಿ ಮೌಲ್ಯಮಾಪನ',
    uploadPrompt: 'ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಕರಕುಶಲ ಫೋಟೋಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    dragDrop: 'ಫೋಟೋಗಳನ್ನು ಇಲ್ಲಿ ಎಳೆಯಿರಿ, ಅಥವಾ',
    browseFiles: 'ಫೈಲ್‌ಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ',
    openCamera: 'ಕ್ಯಾಮೆರಾ ಬಳಸಿ',
    imagesAnalyzed: 'ವಿಶ್ಲೇಷಿಸಿದ ಚಿತ್ರಗಳು',
    frontView: 'ಮುಂಭಾಗದ ನೋಟ (ಅಗತ್ಯ)',
    backView: 'ಹಿಂಭಾಗದ ನೋಟ',
    sideView: 'ಪಾರ್ಶ್ವ ನೋಟ',
    detailView: 'ಹತ್ತಿರದ ವಿವರ',
    analyzeButton: 'AI ವಿಶ್ಲೇಷಣೆ ಪ್ರಾರಂಭಿಸಿ',
    analyzing: 'ಚಿತ್ರದ ವಿವರಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',

    section1: '01 ಉತ್ಪನ್ನ ಗುರುತಿಸುವಿಕೆ',
    section2: '02 ದೃಶ್ಯ ಮತ್ತು ಭೌತಿಕ ವಿವರಗಳು',
    section3: '03 ಗುಣಮಟ್ಟ ಮೌಲ್ಯಮಾಪನ',
    section4: '04 ನ್ಯಾಯಯುತ ಮಾರುಕಟ್ಟೆ ಮೌಲ್ಯಮಾಪನ',
    section5: '05 AI ವಿಶ್ವಾಸಾರ್ಹತೆ',
    section6: '06 ಕುಶಲಕರ್ಮಿ ದೃಢೀಕರಣ',

    craftName: 'ಕರಕುಶಲ ಹೆಸರು',
    category: 'ವರ್ಗ',
    traditionalType: 'ಸಾಂಪ್ರದಾಯಿಕ ಕರಕುಶಲ ಮಾದರಿ',
    regionState: 'ಪ್ರದೇಶ / ರಾಜ್ಯ',
    giStatus: 'GI ಸ್ಥಿತಿ',
    giNotVerified: 'GI ಸ್ಥಿತಿ: ಪರಿಶೀಲಿಸಲಾಗಿಲ್ಲ',
    description: 'ವಿವರಣೆ',
    notConfidentlyDetected: 'ಖಚಿತವಾಗಿ ಪತ್ತೆಯಾಗಿಲ್ಲ',

    materialAuthenticity: 'ವಸ್ತುವಿನ ನೈಜತೆ',
    craftsmanshipPrecision: 'ಕುಶಲತೆ ನಿಖರತೆ',
    structuralIntegrity: 'ರಚನಾತ್ಮಕ ಸಮಗ್ರತೆ',
    surfaceFinish: 'ಮೇಲ್ಮೈ ಫಿನಿಶ್',
    symmetryAlignment: 'ಸಮರೂಪತೆ',
    qualitySummary: 'AI ಗುಣಮಟ್ಟ ಮೌಲ್ಯಮಾಪನ ಸಾರಾಂಶ',

    materialCost: 'ಕಚ್ಚಾ ವಸ್ತು ವೆಚ್ಚ',
    artisanLabor: 'ಕುಶಲಕರ್ಮಿ ಶ್ರಮ (ನ್ಯಾಯಯುತ ಜೀವನ ವೇತನ)',
    minSustainablePrice: 'ಕನಿಷ್ಠ ಸಮರ್ಥನೀಯ ಬೆಲೆ',
    marketPriceRange: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಶ್ರೇಣಿ',
    suggestedPrice: 'AI ಸೂಚಿಸಿದ ಬೆಲೆ',
    pricingBasis: 'ಪಾರದರ್ಶಕ ಬೆಲೆ ಆಧಾರ',

    editDetails: 'ವಿವರಗಳನ್ನು ತಿದ್ದುಪಡಿ ಮಾಡಿ / ದೃಢೀಕರಿಸಿ',
    publishToMarketplace: 'ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಪ್ರಕಟಿಸಿ',
    listYourCraft: 'ನಿಮ್ಮ ಕರಕುಶಲ ವಸ್ತುವನ್ನು ಸೇರಿಸಿ',
    noProductsYet: 'ಇನ್ನೂ ಯಾವುದೇ ಕರಕುಶಲ ವಸ್ತುಗಳು ಪಟ್ಟಿಯಾಗಿಲ್ಲ. ಮೊದಲಿಗರಾಗಿ ಸೇರಿಸಿ.',
    noMatchingProducts: 'ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಯ ಉತ್ಪನ್ನಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',
    resetFilters: 'ಎಲ್ಲಾ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ',
    testWithSampleCrafts: 'ಮಾದರಿ ಚಿತ್ರಗಳೊಂದಿಗೆ AI ಪರೀಕ್ಷಿಸಿ',
    sampleCraftsDesc: 'AI ಪರೀಕ್ಷಿಸಲು ಕೆಳಗಿನ ಮಾದರಿ ಚಿತ್ರಗಳನ್ನು ಆರಿಸಿ:',
  },

  mr: {
    home: 'मुख्यपृष्ठ',
    marketplace: 'बाजारपेठ',
    howItWorks: 'हे कसे कार्य करते',
    aiAnalyzer: 'AI उत्पादन विश्लेषक',
    artisanPortal: 'कारीगर पोर्टल',
    myOrders: 'माझे ऑर्डर्स',
    wishlist: 'आवडती यादी',
    cart: 'कार्ट',
    login: 'लॉग इन',
    signUp: 'साइन अप',
    signOut: 'लॉग आउट',
    loggedInAs: 'लॉग इन केलेले वापरकर्ता',
    credits: 'क्रेडिट्स',
    artisanDashboard: 'कारीगर डॅशबोर्ड',
    myProducts: 'माझी उत्पादने',
    exploreCrafts: 'हस्तकला एक्सप्लोर करा',

    tagline: 'कारीगरापासून बाजारपेठेपर्यंत — AI द्वारे समर्थित',
    subtagline: 'लोक | हस्तकला | संस्कृती | उज्ज्वल भविष्य',

    scanTitle: 'AI उत्पादन विश्लेषक',
    scanSubtitle: 'अस्सल भारतीय हस्तकलेसाठी संगणकीय दृष्टी मूल्यांकन',
    uploadPrompt: 'विश्लेषणासाठी हस्तकलेचे फोटो अपलोड करा',
    dragDrop: 'फोटो येथे ड्रॅग आणि ड्रॉप करा, किंवा',
    browseFiles: 'डिव्हाइसमधून निवडा',
    openCamera: 'कॅमेरा वापरा',
    imagesAnalyzed: 'विश्लेषित केलेल्या प्रतिमा',
    frontView: 'समोरील दृश्य (आवश्यक)',
    backView: 'मागील दृश्य',
    sideView: 'बाजूचे दृश्य',
    detailView: 'जवळचे तपशील',
    analyzeButton: 'AI विश्लेषण सुरू करा',
    analyzing: 'प्रतिमेचे विश्लेषण केले जात आहे...',

    section1: '01 उत्पादन ओळख',
    section2: '02 दृश्य आणि भौतिक तपशील',
    section3: '03 गुणवत्ता मूल्यांकन',
    section4: '04 रास्त बाजार मूल्यांकन',
    section5: '05 AI विश्वास पातळी',
    section6: '06 कारीगर पुष्टीकरण',

    craftName: 'ओळखलेले हस्तकला नाव',
    category: 'हस्तकला श्रेणी',
    traditionalType: 'पारंपारिक हस्तकला प्रकार',
    regionState: 'उत्पत्ती प्रदेश / राज्य',
    giStatus: 'GI स्थिती',
    giNotVerified: 'GI स्थिती: पडताळणी झालेली नाही',
    description: 'तपशील',
    notConfidentlyDetected: 'निश्चितपणे आढळले नाही',

    materialAuthenticity: 'साहित्याची सत्यता',
    craftsmanshipPrecision: 'कारागिरी अचूकता',
    structuralIntegrity: 'संरचनात्मक मजबुती',
    surfaceFinish: 'पृष्ठभाग फिनिश',
    symmetryAlignment: 'सममिती',
    qualitySummary: 'AI गुणवत्ता मूल्यांकन सारांश',

    materialCost: 'कच्च्या मालाचा खर्च',
    artisanLabor: 'कारीगर मजुरी (वाजवी जीवन वेतन)',
    minSustainablePrice: 'किमान शाश्वत किंमत',
    marketPriceRange: 'बाजार किंमत श्रेणी',
    suggestedPrice: 'AI सुचवलेली किंमत',
    pricingBasis: 'पारदर्शक किंमत आधार',

    editDetails: 'तपशील संपादित करा / पुष्टी करा',
    publishToMarketplace: 'मार्केटप्लेसमध्ये प्रकाशित करा',
    listYourCraft: 'आपली हस्तकला जोडा',
    noProductsYet: 'अद्याप कोणतीही उत्पादने सूचीबद्ध नाहीत. पहिले कारीगर बना.',
    noMatchingProducts: 'कोणतीही जुळणारी उत्पादने आढळली नाहीत.',
    resetFilters: 'सर्व फिल्टर्स रीसेट करा',
    testWithSampleCrafts: 'नमुना हस्तकलेसह AI तपासा',
    sampleCraftsDesc: 'AI तपासण्यासाठी खालील नमुना प्रतिमा निवडा:',
  },

  bn: {
    home: 'হোম',
    marketplace: 'মার্কেটপ্লেস',
    howItWorks: 'এটি কীভাবে কাজ করে',
    aiAnalyzer: 'AI পণ্য বিশ্লেষক',
    artisanPortal: 'কারিগর পোর্টাল',
    myOrders: 'আমার অর্ডার',
    wishlist: 'পছন্দের তালিকা',
    cart: 'কার্ট',
    login: 'লগইন',
    signUp: 'সাইন আপ',
    signOut: 'লগ আউট',
    loggedInAs: 'লগ ইন আছেন',
    credits: 'ক্রেডিট',
    artisanDashboard: 'কারিগর ড্যাশবোর্ড',
    myProducts: 'আমার পণ্যসমূহ',
    exploreCrafts: 'হস্তশিল্প অন্বেষণ করুন',

    tagline: 'কারিগর থেকে বাজারে — AI চালিত',
    subtagline: 'মানুষ | শিল্প | সংস্কৃতি | উজ্জ্বল ভবিষ্যৎ',

    scanTitle: 'AI পণ্য বিশ্লেষক',
    scanSubtitle: 'খাঁটি ভারতীয় হস্তশিল্পের জন্য কম্পিউটার ভিশন মূল্যায়ন',
    uploadPrompt: 'বিশ্লেষণের জন্য হস্তশিল্পের ছবি আপলোড করুন',
    dragDrop: 'ছবি এখানে টেনে আনুন, অথবা',
    browseFiles: 'ডিভাইস থেকে ব্রাউজ করুন',
    openCamera: 'ক্যামেরা ব্যবহার করুন',
    imagesAnalyzed: 'বিশ্লেষিত ছবি',
    frontView: 'সামনের দৃশ্য (আবশ্যক)',
    backView: 'পেছনের দৃশ্য',
    sideView: 'পাশের দৃশ্য',
    detailView: 'নিকটবর্তী বিস্তারিত',
    analyzeButton: 'AI বিশ্লেষণ শুরু করুন',
    analyzing: 'ছবির বিবরণ বিশ্লেষণ করা হচ্ছে...',

    section1: '01 পণ্য সনাক্তকরণ',
    section2: '02 ভিজ্যুয়াল এবং শারীরিক বিবরণ',
    section3: '03 গুণমান মূল্যায়ন',
    section4: '04 ন্যায্য বাজার মূল্যায়ন',
    section5: '05 AI বিশ্বাসযোগ্যতা গেজ',
    section6: '06 কারিগরের নিশ্চিতকরণ',

    craftName: 'শনাক্তকৃত শিল্পের নাম',
    category: 'শিল্পের বিভাগ',
    traditionalType: 'ঐতিহ্যবাহী শিল্পের ধরন',
    regionState: 'অঞ্চল / রাজ্য',
    giStatus: 'GI স্থিতি',
    giNotVerified: 'GI স্থিতি: যাচাই করা হয়নি',
    description: 'বিবরণ',
    notConfidentlyDetected: 'নিশ্চিতভাবে শনাক্ত করা যায়নি',

    materialAuthenticity: 'উপাদানের সত্যতা',
    craftsmanshipPrecision: 'কারুকার্য নির্ভুলতা',
    structuralIntegrity: 'কাঠামোগত অখণ্ডতা',
    surfaceFinish: 'পৃষ্ঠতল ফিনিশ',
    symmetryAlignment: 'প্রতিসাম্য',
    qualitySummary: 'AI গুণমান মূল্যায়ন সারাংশ',

    materialCost: 'কাঁচামালের খরচ',
    artisanLabor: 'কারিগর পারিশ্রমিক (ন্যায্য জীবন মজুরি)',
    minSustainablePrice: 'ন্যূনতম টেকসই মূল্য',
    marketPriceRange: 'বাজার মূল্য পরিসর',
    suggestedPrice: 'AI প্রস্তাবিত মূল্য',
    pricingBasis: 'স্বচ্ছ মূল্য ভিত্তি',

    editDetails: 'বিবরণ সম্পাদনা / নিশ্চিত করুন',
    publishToMarketplace: 'মার্কেটপ্লেসে প্রকাশ করুন',
    listYourCraft: 'আপনার শিল্প তালিকাভুক্ত করুন',
    noProductsYet: 'এখনও কোনো কারিগর পণ্য তালিকাভুক্ত হয়নি। প্রথম কারিগর হিসেবে যোগ করুন।',
    noMatchingProducts: 'কোনো মানানসই পণ্য পাওয়া যায়নি।',
    resetFilters: 'সব ফিল্টার রিসেট করুন',
    testWithSampleCrafts: 'নমুনা ছবি দিয়ে AI পরীক্ষা করুন',
    sampleCraftsDesc: 'AI পরীক্ষা করতে নিচের নমুনা ছবিগুলো নির্বাচন করুন:',
  },
};

const STORAGE_KEY = 'karigarsetu_preferred_language';

export function getStoredLanguage() {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem(STORAGE_KEY) || 'en';
}

export function setStoredLanguage(langCode) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, langCode);
    window.dispatchEvent(new CustomEvent('karigarsetu-language-changed', { detail: { lang: langCode } }));
  }
}

export function t(key, lang = null) {
  const currentLang = lang || getStoredLanguage();
  const langDict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  return langDict[key] || TRANSLATIONS.en[key] || key;
}

export function useI18n() {
  const [currentLang, setCurrentLangState] = React.useState(getStoredLanguage);

  React.useEffect(() => {
    const handleLangChange = (e) => {
      if (e.detail && e.detail.lang) {
        setCurrentLangState(e.detail.lang);
      }
    };
    window.addEventListener('karigarsetu-language-changed', handleLangChange);
    return () => {
      window.removeEventListener('karigarsetu-language-changed', handleLangChange);
    };
  }, []);

  const changeLanguage = (langCode) => {
    setCurrentLangState(langCode);
    setStoredLanguage(langCode);
  };

  const translate = (key) => t(key, currentLang);

  return {
    language: currentLang,
    changeLanguage,
    t: translate,
    languages: SUPPORTED_LANGUAGES,
  };
}
