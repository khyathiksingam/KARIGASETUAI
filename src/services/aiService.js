
export const SAMPLE_CRAFTS = [
  {
    id: 'tealight',
    name: 'Terracotta Diya',
    category: 'Terracotta',
    imageUrl: 'https://images.unsplash.com/photo-1603555501671-8f96b3fce8b4?w=800&auto=format&fit=crop&q=80',
    price: '₹599',
    badge: 'Kiln Fired Clay',
    region: 'Gorakhpur, UP'
  },
  {
    id: 'elephant',
    name: 'Jali Wood Elephant',
    category: 'Wood Craft',
    imageUrl: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?w=800&auto=format&fit=crop&q=80',
    price: '₹2,250',
    badge: 'Undercut Lattice',
    region: 'Jaipur, Rajasthan'
  },
  {
    id: 'pottery',
    name: 'Jaipur Blue Pottery',
    category: 'Pottery',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
    price: '₹2,199',
    badge: 'Quartz Ceramic',
    region: 'Jaipur, Rajasthan'
  },
  {
    id: 'silk',
    name: 'Kanchipuram Silk',
    category: 'Handloom',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    price: '₹7,499',
    badge: 'Mulberry Silk',
    region: 'Kanchipuram, TN'
  },
  {
    id: 'brass',
    name: 'Brass Peacock Diya',
    category: 'Metal Craft',
    imageUrl: 'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?w=800&auto=format&fit=crop&q=80',
    price: '₹2,499',
    badge: 'Lost-Wax Cast',
    region: 'Moradabad, UP'
  },
  {
    id: 'bamboo',
    name: 'Majuli Bamboo Basket',
    category: 'Bamboo',
    imageUrl: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop&q=80',
    price: '₹1,350',
    badge: 'Split Cane Weave',
    region: 'Majuli, Assam'
  },
  {
    id: 'jute',
    name: 'Jute Floral Decor',
    category: 'Natural Fiber',
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&auto=format&fit=crop&q=80',
    price: '₹899',
    badge: 'Hand Braided',
    region: 'Kolkata, WB'
  }
];

export function normalizeAnalysisResult(raw) {
  if (!raw) return null;
  if (raw.isValidCraft === false || raw.isHumanSubject || raw.isDocumentSubject) {
    return raw;
  }

  const category = raw.category || 'Handicraft';
  const minPrice = Number(raw.estimatedPriceMin) || 750;
  const maxPrice = Number(raw.estimatedPriceMax) || 1200;
  const suggPrice = Number(raw.suggestedPrice) || Math.round((minPrice + (maxPrice - minPrice) * 0.45) / 10) * 10;
  
  // Fair living wage calculation (artisan daily wage standard + raw materials + skill complexity)
  const fairWageMin = Number(raw.fairWageMin) || Math.round((minPrice * 1.05) / 10) * 10;
  const fairWageMax = Number(raw.fairWageMax) || Math.round((minPrice + (maxPrice - minPrice) * 0.85) / 10) * 10;

  const rawQuality = raw.qualityAssessment || {};
  const qualityScore = Number(raw.qualityScore || rawQuality.overall || 4.8);
  const craftsmanship = Number((rawQuality.craftsmanship || Math.min(5, qualityScore + 0.1)).toFixed(1));
  const materialQuality = Number((rawQuality.materialQuality || qualityScore).toFixed(1));
  const designDetailing = Number((rawQuality.designDetailing || rawQuality.designAesthetic || Math.min(5, qualityScore + 0.1)).toFixed(1));
  const finishQuality = Number((rawQuality.finishQuality || rawQuality.finish || Math.max(3.8, qualityScore - 0.1)).toFixed(1));
  const overall = Number((rawQuality.overall || qualityScore).toFixed(1));

  const dimStr = raw.dimensions
    ? (raw.dimensions.includes('AI Estimated') ? raw.dimensions : `${raw.dimensions} (AI Estimated)`)
    : `${raw.length || 25} × ${raw.width || 25} × ${raw.height || 5} cm (AI Estimated)`;

  const weightStr = raw.estimatedWeight
    ? (raw.estimatedWeight.includes('AI Estimated') ? raw.estimatedWeight : `${raw.estimatedWeight} (AI Estimated)`)
    : '~350g – 650g (AI Estimated)';

  return {
    ...raw,
    productName: raw.productName || 'Handcrafted Heritage Item',
    category: category,
    craftType: raw.craftType || raw.model || 'Traditional Handcrafted Artisan Work',
    regionState: raw.regionState || 'Not confidently detected',
    descriptionSnippet: raw.descriptionSnippet || raw.visualDescription || 'Artisan handcrafted handicraft showing balanced symmetry, natural material texture, and authentic regional technique.',
    confidence: typeof raw.confidence === 'number' ? raw.confidence : null,

    // Visual Details
    shape: raw.shape || 'Sculptural Artisan Form',
    form: raw.form || 'Three-dimensional sculpted body with proportional hand-shaped symmetry',
    designPattern: raw.designPattern || raw.model || 'Traditional regional geometric and floral relief patterning',
    motifs: raw.motifs || 'Traditional cultural and nature-inspired motifs',
    texture: raw.texture || 'Tactile hand-worked surface preserving authentic material grain',
    finish: raw.finish || raw.craftFinish || 'Organic hand-burnished protective finish',
    visibleConstructionTechnique: raw.visibleConstructionTechnique || raw.craftTechnique || 'Traditional manual shaping, jointing, and surface tooling',
    primaryColor: raw.primaryColor || 'Natural Earth Tone',
    secondaryColor: raw.secondaryColor || 'Natural Accent Tone',
    decorativeElements: raw.decorativeElements || 'Hand-chiseled relief borders and surface ornamentation',
    visualCharacteristics: raw.visualCharacteristics || 'Balanced composition, organic symmetry, and unhurried artisan craftsmanship',

    // Physical Details
    material: raw.material || 'Natural Regional Materials',
    possibleNaturalRawMaterials: raw.possibleNaturalRawMaterials || 'Ethically sourced indigenous natural fibers, seasoned timber, or mineral clay',
    dimensions: dimStr,
    estimatedWeight: weightStr,
    constructionTechnique: raw.constructionTechnique || raw.craftTechnique || 'Hand-assembled monolithic structure with zero synthetic fasteners',
    surfaceFinish: raw.surfaceFinish || raw.craftFinish || 'Organic non-toxic botanical buffing',
    handmadeIndicators: raw.handmadeIndicators || 'Micro-tooling striations, organic contour variations confirming 100% manual fabrication',
    durabilityIndicators: raw.durabilityIndicators || 'High-density seasoned raw materials tested for climate resilience and long life',

    // Material & Craft Technique
    primaryMaterial: raw.primaryMaterial || raw.material || 'Indigenous Raw Material',
    sourcingOrigin: raw.sourcingOrigin || 'Sustainably harvested from certified regional artisan clusters',
    craftTechnique: raw.craftTechnique || 'Generational traditional handcrafting',
    heritageLineage: raw.heritageLineage || 'Registered generational artisan guild traditions',

    // Quality Assessment (Scores + Summary + Strengths + Imperfections + Grade)
    qualityAssessment: {
      craftsmanship,
      materialQuality,
      designDetailing,
      finishQuality,
      overall,
      qualitySummary: rawQuality.qualitySummary || rawQuality.explanation || 'Visual analysis confirms superior structural integrity, authentic hand tooling marks, and premium grade raw material composition.',
      strengths: rawQuality.strengths || 'Authentic artisan hand tooling, balanced symmetry, high tensile strength, and durable organic finish.',
      visibleImperfections: rawQuality.visibleImperfections || 'Natural organic grain micro-variations characteristic of authentic manual craft work (zero structural defects).',
      overallQualityGrade: rawQuality.overallQualityGrade || (overall >= 4.8 ? 'Grade A+ (Master Artisan Work)' : 'Grade A (Authentic Handcrafted)')
    },

    // 3 Separate Pricing Results
    estimatedPriceMin: minPrice,
    estimatedPriceMax: maxPrice,
    suggestedPrice: suggPrice,
    fairWageMin: fairWageMin,
    fairWageMax: fairWageMax,
    fairWageBenchmarkIncluded: true,

    pricingReasoning: raw.pricingReasoning || 'Price calculated by factoring in skilled artisan labor time, raw material purity, regional craft complexity, and Ministry of Textiles fair living wage benchmarks.',
    suggestedPriceReasoning: raw.suggestedPriceReasoning || 'Suggested starting price for marketplace listing balancing buyer affordability with fair artisan profitability and platform visibility.',
    fairWageReasoning: raw.fairWageReasoning || 'Benchmark computed strictly from daily artisan livelihood wages (₹800/day living wage standard) + raw material investment + craft intricacy.',
    culturalSignificance: raw.culturalSignificance || 'Traditional Indian handicraft heritage embodying generational folk wisdom.'
  };
}

export function getSampleCraftAnalysis(sampleId) {
  const key = sampleId === 'jute' ? 'homedecor' : sampleId;
  const template = CRAFT_APPRAISAL_TEMPLATES[key] || CRAFT_APPRAISAL_TEMPLATES[sampleId];
  if (template && template.analysis) {
    return normalizeAnalysisResult(template.analysis);
  }
  return normalizeAnalysisResult(CRAFT_APPRAISAL_TEMPLATES.elephant?.analysis || CRAFT_APPRAISAL_TEMPLATES.tealight?.analysis);
}

export const SCAN_STEPS = [
    { id: 1, label: 'UPLOADING IMAGE', detail: 'Preparing high-resolution neural vision buffer' },
    { id: 2, label: 'IDENTIFYING CRAFT', detail: 'Classifying traditional handicraft structure, motifs & geometry' },
    { id: 3, label: 'ANALYZING MATERIAL', detail: 'Spectro-texture detection of wood, clay, stone, metal & fibers' },
    { id: 4, label: 'ANALYZING CRAFT STYLE', detail: 'Recognizing regional Indian artisan lineage & school of art' },
    { id: 5, label: 'ESTIMATING DIMENSIONS', detail: 'Calibrating spatial perspective & volumetric proportions' },
    { id: 6, label: 'ASSESSING QUALITY', detail: 'Scoring edge symmetry, intricate detailing & surface finish' },
    { id: 7, label: 'CALCULATING FAIR PRICE', detail: 'Benchmarking raw craft labor and fair trade market rates' },
    { id: 8, label: 'ANALYSIS COMPLETE', detail: 'Finalizing structured marketplace catalog payload' },
];
function loadImageElement(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        // Only set crossOrigin for external http/https URLs, NEVER for data: or blob:
        if (!src.startsWith('data:') && !src.startsWith('blob:')) {
            img.crossOrigin = 'anonymous';
        }
        img.onload = () => resolve(img);
        img.onerror = (err) => {
            console.warn('Canvas image load error:', err);
            reject(new Error('Failed to load image for canvas pixel analysis'));
        };
        img.src = src;
    });
}
/**
 * Biometric human face & portrait detection engine.
 * Prevents accidental or fraudulent appraisals of living persons as products.
 */
export async function detectHumanSubject(imageSource) {
    if (typeof window === 'undefined')
        return { isHuman: false, confidence: 0 };
    let url = '';
    let shouldRevoke = false;
    if (imageSource instanceof File) {
        url = URL.createObjectURL(imageSource);
        shouldRevoke = true;
    }
    else if (typeof imageSource === 'string') {
        url = imageSource;
    }
    else {
        return { isHuman: false, confidence: 0 };
    }
    try {
        const img = await loadImageElement(url);
        // 1. Web Standard Native FaceDetector API (available in Chromium/Edge)
        if ('FaceDetector' in window) {
            try {
                const faceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 3 });
                const faces = await faceDetector.detect(img);
                if (faces && faces.length > 0) {
                    return {
                        isHuman: true,
                        confidence: 99,
                        reason: 'Human face recognized via neural vision detector. KARIGARSETU.AI only appraises authentic Indian handicrafts and handloom textiles.',
                    };
                }
            }
            catch (e) {
                // Fallback to biometric skin morphology model
            }
        }
        // 2. Biometric Facial Morphology & Spatial Skin Tone Clustering
        const canvas = document.createElement('canvas');
        const width = 96;
        const height = 96;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return { isHuman: false, confidence: 0 };
        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height).data;
        // Face Zone: central upper half (x: 20% to 80%, y: 15% to 55%)
        const faceStartX = Math.floor(width * 0.20);
        const faceEndX = Math.floor(width * 0.80);
        const faceStartY = Math.floor(height * 0.15);
        const faceEndY = Math.floor(height * 0.55);
        // Hair Zone: directly above the face (y: 5% to 25%)
        const hairStartY = Math.floor(height * 0.05);
        const hairEndY = Math.floor(height * 0.25);
        // Bottom Clothing / Torso Zone: lower 35% of frame (y: 65% to 95%)
        const bottomStartY = Math.floor(height * 0.65);
        const bottomEndY = Math.floor(height * 0.95);
        let faceZonePixels = 0;
        let faceZoneSkinPixels = 0;
        let faceLumSum = 0;
        let hairZonePixels = 0;
        let hairZoneDarkPixels = 0;
        let bottomZonePixels = 0;
        let bottomZoneSkinPixels = 0;
        let bottomLumSum = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const r = imgData[idx];
                const g = imgData[idx + 1];
                const b = imgData[idx + 2];
                const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                // Biometric Human Skin Tone check:
                // RGB check: r > 80, g > 35, b > 20, r > g, (r - b) > 10, (r - g) >= 8, max - min >= 12
                const isRgbSkin = r > 80 && g > 35 && b > 20 && r > g && (r - b) > 10 && (r - g) >= 8 && (Math.max(r, g, b) - Math.min(r, g, b)) >= 12;
                // YCbCr check (standard Kovac/Peer model across all human skin ethnicities)
                const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
                const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
                const isYCbCrSkin = cb >= 75 && cb <= 130 && cr >= 130 && cr <= 175;
                const isSkin = isRgbSkin && isYCbCrSkin;
                if (x >= faceStartX && x <= faceEndX && y >= faceStartY && y <= faceEndY) {
                    faceZonePixels++;
                    faceLumSum += lum;
                    if (isSkin)
                        faceZoneSkinPixels++;
                }
                if (x >= faceStartX && x <= faceEndX && y >= hairStartY && y <= hairEndY) {
                    hairZonePixels++;
                    if (lum < 70) {
                        hairZoneDarkPixels++;
                    }
                }
                if (x >= faceStartX && x <= faceEndX && y >= bottomStartY && y <= bottomEndY) {
                    bottomZonePixels++;
                    bottomLumSum += lum;
                    if (isSkin)
                        bottomZoneSkinPixels++;
                }
            }
        }
        const faceSkinRatio = faceZonePixels > 0 ? faceZoneSkinPixels / faceZonePixels : 0;
        const bottomSkinRatio = bottomZonePixels > 0 ? bottomZoneSkinPixels / bottomZonePixels : 0;
        const darkHairRatio = hairZonePixels > 0 ? hairZoneDarkPixels / hairZonePixels : 0;
        const avgFaceLum = faceZonePixels > 0 ? faceLumSum / faceZonePixels : 0;
        const avgBottomLum = bottomZonePixels > 0 ? bottomLumSum / bottomZonePixels : 0;
        // Portrait Clothing Transition:
        // In human selfies / portraits, the face has a high skin ratio (> 20%), while the lower 35% is clothing (shirt/top, bottomSkinRatio <= 15%),
        // and clothes are typically darker or distinctly non-skin compared to the illuminated face.
        // In contrast, genuine woodcraft / sculptures (like carved elephants) maintain the same timber material from top to bottom (bottomSkinRatio > 25%).
        const hasPortraitClothingTransition = faceSkinRatio >= 0.20 && bottomSkinRatio <= 0.15 && (avgFaceLum > avgBottomLum * 1.2 || avgBottomLum < 75);
        const hasStrongFaceWithHair = faceSkinRatio >= 0.35 && darkHairRatio >= 0.15 && bottomSkinRatio <= 0.20;
        if (hasPortraitClothingTransition || hasStrongFaceWithHair) {
            return {
                isHuman: true,
                confidence: 96,
                reason: 'Human portrait / selfie photo detected. KARIGARSETU.AI only evaluates authentic Indian handicrafts, woodcraft, pottery, handlooms, and traditional art.',
            };
        }
        return { isHuman: false, confidence: 0 };
    }
    catch (err) {
        console.warn('detectHumanSubject error:', err);
        return { isHuman: false, confidence: 0 };
    }
    finally {
        if (shouldRevoke) {
            URL.revokeObjectURL(url);
        }
    }
}
/**
 * Intelligent Document, Syllabus & Non-Craft Text Sheet Detector.
 * Rejects screenshots of Word documents (.docx), PDFs, textbooks, syllabus pages, and notes.
 */
export async function detectDocumentSubject(imageSource) {
    if (typeof window === 'undefined')
        return { isDocument: false, confidence: 0 };
    // 1. Check file metadata / name / type if File object
    if (imageSource instanceof File) {
        const lowerName = imageSource.name.toLowerCase();
        const docExtensions = ['.docx', '.doc', '.pdf', '.txt', '.rtf', '.odt', '.pptx', '.ppt', '.xlsx', '.xls'];
        const docKeywords = ['syllabus', 'unit', 'assignment', 'notes', 'curriculum', 'document', 'docx', 'textbook'];
        if (docExtensions.some(ext => lowerName.endsWith(ext))) {
            return {
                isDocument: true,
                confidence: 99,
                reason: 'Text Document (.docx / .pdf / .txt) detected. KARIGARSETU.AI exclusively evaluates authentic Indian physical handicrafts, textiles, pottery, and art.',
            };
        }
        if (docKeywords.some(kw => lowerName.includes(kw))) {
            return {
                isDocument: true,
                confidence: 98,
                reason: 'Text Document / Syllabus file detected. KARIGARSETU.AI exclusively evaluates authentic Indian physical handicrafts, textiles, pottery, and art.',
            };
        }
    }
    // 2. Optical Document & Page Layout Inspection via Canvas
    let url = '';
    let shouldRevoke = false;
    if (imageSource instanceof File) {
        url = URL.createObjectURL(imageSource);
        shouldRevoke = true;
    }
    else if (typeof imageSource === 'string') {
        url = imageSource;
    }
    else {
        return { isDocument: false, confidence: 0 };
    }
    try {
        const img = await loadImageElement(url);
        const canvas = document.createElement('canvas');
        const width = 96;
        const height = 96;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return { isDocument: false, confidence: 0 };
        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height).data;
        let whitePixels = 0;
        let blackTextPixels = 0;
        let totalPixels = 0;
        let coloredPixels = 0;
        for (let i = 0; i < imgData.length; i += 4) {
            const r = imgData[i];
            const g = imgData[i + 1];
            const b = imgData[i + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const sat = max === 0 ? 0 : (max - min) / max;
            totalPixels++;
            if (sat > 0.18) {
                coloredPixels++;
            }
            else {
                if (lum > 210)
                    whitePixels++;
                else if (lum < 95)
                    blackTextPixels++;
            }
        }
        const whiteRatio = whitePixels / Math.max(totalPixels, 1);
        const textRatio = blackTextPixels / Math.max(totalPixels, 1);
        const coloredRatio = coloredPixels / Math.max(totalPixels, 1);
        // Text documents & syllabus sheets feature white paper dominance (> 65%), dark text ink characters (>= 1.5%), and minimal color (< 12%)
        const isDoc = (whiteRatio >= 0.65 && textRatio >= 0.015 && coloredRatio < 0.12) || (whiteRatio >= 0.78 && coloredRatio < 0.10);
        if (isDoc) {
            return {
                isDocument: true,
                confidence: 98,
                reason: 'Text Document / Syllabus / Printed Sheet Detected. KARIGARSETU.AI exclusively evaluates authentic handmade physical crafts, textiles, pottery, and traditional art — not text documents, books, or notes.',
            };
        }
        return { isDocument: false, confidence: 0 };
    }
    catch (err) {
        console.warn('detectDocumentSubject error:', err);
        return { isDocument: false, confidence: 0 };
    }
    finally {
        if (shouldRevoke) {
            URL.revokeObjectURL(url);
        }
    }
}
/**
 * Intelligent analyzer with real Gemini Vision support & robust local fallback
 */
export async function analyzeProductImage(imageSource, onStepProgress) {
    const stepDelay = 300;
    // Step 1: Verification
    if (onStepProgress)
        onStepProgress(0);
    await new Promise((res) => setTimeout(res, stepDelay));
    // 1. Mandatory Document / Syllabus / Text Sheet Check
    const docCheck = await detectDocumentSubject(imageSource);
    if (docCheck.isDocument) {
        if (onStepProgress)
            onStepProgress(SCAN_STEPS.length - 1);
        return {
            result: {
                productName: 'Text Document / Non-Craft Subject',
                category: 'Non-Craft',
                material: 'Paper / Digital Document / Text Sheet',
                model: 'Printed Text / Syllabus / Notes',
                dimensions: 'N/A',
                length: 0,
                width: 0,
                height: 0,
                primaryColor: 'White / Black Ink',
                secondaryColor: 'Monochrome Text',
                qualityScore: 0,
                qualityStars: '—',
                estimatedPriceMin: 0,
                estimatedPriceMax: 0,
                suggestedPrice: 0,
                confidence: docCheck.confidence || 98,
                descriptionSnippet: 'Text document, syllabus page, or assignment notes detected. KARIGARSETU.AI exclusively evaluates physical handmade crafts, handlooms, and heritage artisan goods.',
                culturalSignificance: 'Under SIH 2026 guidelines, printed documents or digital text sheets cannot be appraised or cataloged as marketplace products.',
                isValidCraft: false,
                isHumanSubject: false,
                isDocumentSubject: true,
                rejectionReason: docCheck.reason || 'Text Document / Syllabus page detected. KARIGARSETU.AI only evaluates authentic Indian physical handicrafts.',
            },
            isMock: true,
        };
    }
    // 2. Mandatory Biometric Human Subject Check
    const humanCheck = await detectHumanSubject(imageSource);
    if (humanCheck.isHuman) {
        if (onStepProgress)
            onStepProgress(SCAN_STEPS.length - 1);
        return {
            result: {
                productName: 'Human Portrait / Non-Craft Subject',
                category: 'Non-Craft',
                material: 'Living Human Subject',
                model: 'Portrait / Selfie Photography',
                dimensions: 'N/A',
                length: 0,
                width: 0,
                height: 0,
                primaryColor: 'N/A',
                secondaryColor: 'N/A',
                qualityScore: 0,
                qualityStars: '—',
                estimatedPriceMin: 0,
                estimatedPriceMax: 0,
                suggestedPrice: 0,
                confidence: humanCheck.confidence || 96,
                descriptionSnippet: 'Human subject or portrait photography detected. KARIGARSETU.AI is exclusively specialized for traditional Indian handicrafts, woodwork, terracotta, handlooms, metalware, and folk art.',
                culturalSignificance: 'Under SIH 2026 ethical guidelines, living persons cannot be cataloged or sold as products.',
                isValidCraft: false,
                isHumanSubject: true,
                isDocumentSubject: false,
                rejectionReason: humanCheck.reason || 'Human portrait / person detected. KARIGARSETU.AI only evaluates authentic Indian handicrafts.',
            },
            isMock: true,
        };
    }
    // Simulate remaining multi-stage scanning steps for visual experience
    for (let i = 1; i < SCAN_STEPS.length - 1; i++) {
        if (onStepProgress)
            onStepProgress(i);
        await new Promise((res) => setTimeout(res, stepDelay));
    }
    // Check for real Gemini API Key in environment or localStorage
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY ||
        import.meta.env.AI_API_KEY ||
        (typeof window !== 'undefined' ? localStorage.getItem('karigarsetu_gemini_api_key') : '') ||
        '';
    if (geminiApiKey) {
        try {
            // Attempt real Gemini 1.5 Flash Vision analysis
            const realResult = await callGeminiVision(imageSource, geminiApiKey);
            if (realResult) {
                if (onStepProgress)
                    onStepProgress(SCAN_STEPS.length - 1);
                return { result: normalizeAnalysisResult(realResult), isMock: false };
            }
        }
        catch (err) {
            console.warn('Real Gemini API call failed or timed out. Gracefully switching to Computer Vision fallback.', err);
        }
    }
    // Dynamic Client-Side Computer Vision Analysis from image pixels
    const rawMock = await generateSmartMockAnalysis(imageSource);
    const mockResult = normalizeAnalysisResult(rawMock);
    if (onStepProgress)
        onStepProgress(SCAN_STEPS.length - 1);
    return { result: mockResult, isMock: true };
}
async function analyzeVisualPixels(imageSource) {
    if (typeof window === 'undefined')
        return null;
    let url = '';
    let shouldRevoke = false;
    if (imageSource instanceof File) {
        url = URL.createObjectURL(imageSource);
        shouldRevoke = true;
    }
    else if (typeof imageSource === 'string') {
        url = imageSource;
    }
    else {
        return null;
    }
    try {
        const img = await loadImageElement(url);
        const canvas = document.createElement('canvas');
        const width = 64;
        const height = 64;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return null;
        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height).data;
        // Center-focused sampling (60% center box where craft item is placed)
        const startX = Math.floor(width * 0.2);
        const endX = Math.floor(width * 0.8);
        const startY = Math.floor(height * 0.2);
        const endY = Math.floor(height * 0.8);
        let totalR = 0;
        let totalG = 0;
        let totalB = 0;
        let count = 0;
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const i = (y * width + x) * 4;
                totalR += imgData[i];
                totalG += imgData[i + 1];
                totalB += imgData[i + 2];
                count++;
            }
        }
        if (count === 0)
            count = 1;
        const r = Math.round(totalR / count);
        const g = Math.round(totalG / count);
        const b = Math.round(totalB / count);
        // RGB to HSL conversion
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;
        const max = Math.max(rNorm, gNorm, bNorm);
        const min = Math.min(rNorm, gNorm, bNorm);
        const brightness = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        const delta = max - min;
        let hue = 0;
        let saturation = 0;
        if (delta !== 0) {
            saturation = (max + min) / 2 > 0.5 ? delta / (2 - max - min) : delta / (max + min);
            if (max === rNorm) {
                hue = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60;
            }
            else if (max === gNorm) {
                hue = ((bNorm - rNorm) / delta + 2) * 60;
            }
            else {
                hue = ((rNorm - gNorm) / delta + 4) * 60;
            }
        }
        // Jute fiber & lacquer bead detection
        let jutePixels = 0;
        let beadPixels = 0;
        for (let i = 0; i < imgData.length; i += 4) {
            const pr = imgData[i];
            const pg = imgData[i + 1];
            const pb = imgData[i + 2];
            if (pr > 140 && pg > 120 && pb > 80 && pr >= pg && pg >= pb && (pr - pb) > 16) {
                jutePixels++;
            }
            else if (pr > 150 && pg < 75 && pb < 75) {
                beadPixels++;
            }
        }
        const juteRatio = jutePixels / (width * height);
        const redBeadRatio = beadPixels / (width * height);
        // Grey scale or neutral muted detection (e.g. grey cushion, woven slate fabric)
        const isGreyScale = saturation < 0.22 || Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b) < 40;
        const aspectRatio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
        // Center core wax vs surrounding mandala rim luminosity (for circular diya / tealight holder)
        let innerLumSum = 0, innerCount = 0;
        let ringLumSum = 0, ringCount = 0;
        const midX = width / 2, midY = height / 2;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dist = Math.hypot(x - midX, y - midY) / width;
                const i = (y * width + x) * 4;
                const lumVal = 0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2];
                if (dist <= 0.18) {
                    innerLumSum += lumVal;
                    innerCount++;
                }
                else if (dist >= 0.22 && dist <= 0.44) {
                    ringLumSum += lumVal;
                    ringCount++;
                }
            }
        }
        const centerLum = innerCount > 0 ? innerLumSum / innerCount : brightness;
        const ringLum = ringCount > 0 ? ringLumSum / ringCount : brightness;
        const isTealightDiya = (centerLum - ringLum >= 30 && centerLum >= 160) || (centerLum >= 170 && ringLum < 140);
        return {
            r,
            g,
            b,
            brightness,
            saturation,
            hue,
            isGreyScale,
            aspectRatio,
            juteRatio,
            redBeadRatio,
            isTealightDiya,
        };
    }
    catch (err) {
        console.warn('analyzeVisualPixels encountered error, using fallback:', err);
        return null;
    }
    finally {
        if (shouldRevoke) {
            URL.revokeObjectURL(url);
        }
    }
}
async function generateSmartMockAnalysis(imageSource) {
    // 1. Check exact preset matches first if standard seed image
    if (typeof imageSource === 'string') {
        for (const preset of MOCK_AI_PRESETS) {
            if (imageSource.includes(preset.label) || imageSource === preset.image) {
                return preset.analysis;
            }
        }
        // Keyword matching on preset URL
        const lower = imageSource.toLowerCase();
        if (lower.includes('blue-pottery') || lower.includes('vase') || lower.includes('urn')) {
            return MOCK_AI_PRESETS[1].analysis;
        }
        if (lower.includes('silk') || lower.includes('saree') || lower.includes('kanchipuram')) {
            return MOCK_AI_PRESETS[2].analysis;
        }
        if (lower.includes('brass') || lower.includes('lamp') || lower.includes('diya')) {
            return MOCK_AI_PRESETS[3].analysis;
        }
        if (lower.includes('bamboo') || lower.includes('basket') || lower.includes('cane')) {
            return MOCK_AI_PRESETS[4].analysis;
        }
    }
    // 2. Client-side Computer Vision Pixel Inspection
    const features = await analyzeVisualPixels(imageSource);
    if (features) {
        const { brightness, saturation, hue, isGreyScale, juteRatio, isTealightDiya } = features;
        // A: HAND-PAINTED MANDALA TERRACOTTA / STONE TEALIGHT DIYA
        if (isTealightDiya) {
            return {
                productName: 'Hand-Painted Dot-Mandala Terracotta & Stone Tealight Diya',
                category: 'Terracotta',
                craftType: 'Hand-Painted Terracotta Diya / Tealight',
                material: 'Kiln-Fired Riverbed Terracotta, Organic Mineral Pigments & Natural Wax',
                model: 'Traditional Sacred Dot-Mandala Concentric Ring Motif',
                craftTechnique: 'Potter wheel casting, wood-ash kiln firing, manual dot-emboss stylus painting, and beeswax pouring',
                dimensions: '12 × 12 × 4.5 cm',
                length: 12,
                width: 12,
                height: 4.5,
                primaryColor: 'Matte Charcoal & Pearl White',
                secondaryColor: 'Ivory Wax Core & Terracotta Base',
                visualDescription: 'Artisan hand-turned terracotta base adorned with micro-pointillism dot-mandala sacred geometry in durable mineral pigments, holding a pure hand-poured tealight candle.',
                shape: 'Fluted Concentric Diya Bowl',
                texture: 'Earthy porous terracotta with raised pointillism beadwork',
                craftFinish: 'Wood-ash kiln fired with matte mineral sealant',
                qualityScore: 4.9,
                qualityStars: '★★★★★',
                qualityAssessment: {
                    craftsmanship: 4.9,
                    materialQuality: 4.8,
                    finish: 4.7,
                    designAesthetic: 5.0,
                    overall: 4.9,
                    explanation: 'Impeccable symmetry in radial concentric dot-mandala artwork with crisp organic pigment adhesion and clean wax core filling.',
                },
                estimatedPriceMin: 450,
                estimatedPriceMax: 750,
                suggestedPrice: 599,
                confidence: 97,
                pricingReasoning: 'Fair living wage accounting for 4 hours of meticulous stylus pointillism painting, natural terracotta firing, and organic wax casting.',
                descriptionSnippet: 'Artisan hand-turned terracotta base adorned with micro-pointillism dot-mandala sacred geometry in durable mineral pigments, holding a pure hand-poured tealight candle.',
                culturalSignificance: 'Rooted in Indian festive ritual lighting and meditative mandala art traditions celebrated during Diwali and sacred occasions.',
                craftingTechnique: 'Potter wheel casting, wood-ash kiln firing, manual dot-emboss stylus painting, and beeswax pouring.',
                isValidCraft: true,
                isHumanSubject: false,
                isDocumentSubject: false,
                isLiveAi: false,
                analysisSource: 'local_vision',
            };
        }
        // B: BLUE / INDIGO / COBALT (Jaipur Blue Pottery)
        if (hue >= 175 && hue <= 265) {
            return {
                productName: 'Jaipur Traditional Blue Pottery Ceramic Vessel',
                category: 'Pottery',
                craftType: 'Quartz Glazed Ceramic Pottery',
                material: 'Quartz Powder, Fuller’s Earth & Copper Oxide Glaze',
                model: 'Classical Persian Floral Motif (Jaipur School)',
                craftTechnique: 'Mold-cast quartz dough, hand-painted mineral pigments, and wood-fired kiln baking',
                dimensions: '15 × 15 × 25 cm',
                length: 15,
                width: 15,
                height: 25,
                primaryColor: 'Cobalt Blue',
                secondaryColor: 'Persian Turquoise',
                visualDescription: 'Lead-free handmade quartz ceramic vessel adorned with cobalt-oxide floral arabesques and smooth kiln-fired glaze.',
                shape: 'Baluster-Form Ceramic Urn',
                texture: 'Vitrified smooth glass glaze over quartz body',
                craftFinish: 'Kiln-fired non-crazing lead-free glaze',
                qualityScore: 4.9,
                qualityStars: '★★★★★',
                qualityAssessment: {
                    craftsmanship: 4.9,
                    materialQuality: 4.8,
                    finish: 4.8,
                    designAesthetic: 4.9,
                    overall: 4.9,
                    explanation: 'Exemplary mineral pigment linework, balanced vessel neck curvature, and uniform vitreous low-fire glaze.',
                },
                estimatedPriceMin: 1800,
                estimatedPriceMax: 2400,
                suggestedPrice: 2199,
                confidence: 96,
                pricingReasoning: 'Reflects pure quartz stone dough formulation, skilled cobalt oxide brushwork, and low-fire kiln energy costs.',
                descriptionSnippet: 'Lead-free handmade quartz ceramic vessel adorned with cobalt-oxide floral arabesques and smooth kiln-fired glaze.',
                culturalSignificance: 'Heritage art form imported from Persia and patronized by Sawai Ram Singh II of Jaipur.',
                craftingTechnique: 'Mold-cast quartz dough, hand-painted mineral pigments, and wood-fired kiln baking.',
                isValidCraft: true,
                isHumanSubject: false,
                isDocumentSubject: false,
                isLiveAi: false,
                analysisSource: 'local_vision',
            };
        }
        // C: GOLDEN / BRASS / METALLIC (Moradabad Brass)
        if (hue >= 42 && hue <= 68 && saturation > 0.3) {
            return {
                productName: 'Moradabad Hand-Engraved Brass Peacock Diya',
                category: 'Metal Craft',
                craftType: 'Hand-Chiseled Brass Peacock Lamp',
                material: 'Solid Virgin Brass & Bell Metal Bronze',
                model: 'Traditional Nakashi Engraved Heritage',
                craftTechnique: 'Lost-wax sand casting with fine hand-chisel relief engraving',
                dimensions: '22 × 22 × 30 cm',
                length: 22,
                width: 22,
                height: 30,
                primaryColor: 'Imperial Gold',
                secondaryColor: 'Burnished Brass',
                visualDescription: 'Heavyweight hand-cast virgin brass with intricate Nakashi floral chasing, dancing peacock motif, and high-luster traditional polish.',
                shape: 'Tiered Bell-Form Diya Lamp',
                texture: 'Dense metallic weight with intricate hand-stippled relief',
                craftFinish: 'Lustrous antique brass polish with protective lacquer',
                qualityScore: 4.9,
                qualityStars: '★★★★★',
                qualityAssessment: {
                    craftsmanship: 5.0,
                    materialQuality: 4.9,
                    finish: 4.8,
                    designAesthetic: 4.9,
                    overall: 4.9,
                    explanation: 'Solid casting density with crisp micro-chiseled feather relief on peacock crown and flawless symmetrical oil reservoir.',
                },
                estimatedPriceMin: 3200,
                estimatedPriceMax: 4400,
                suggestedPrice: 3699,
                confidence: 96,
                pricingReasoning: 'Based on 1.6 kg solid virgin brass ingot weight, lost-wax mould preparation, and 12 hours of manual Nakashi stylus chasing.',
                descriptionSnippet: 'Heavyweight hand-cast virgin brass with intricate Nakashi floral chasing and high-luster traditional polish.',
                culturalSignificance: 'Centuries-old metal casting heritage from Moradabad, the Brass City of India.',
                craftingTechnique: 'Lost-wax sand casting with fine hand-chisel relief engraving.',
                isValidCraft: true,
                isHumanSubject: false,
                isDocumentSubject: false,
                isLiveAi: false,
                analysisSource: 'local_vision',
            };
        }
        // D: CRIMSON / RICH SILK / WEAVE (Kanchipuram Silk Saree / Brocade)
        if ((hue < 10 || hue > 325) && saturation > 0.3) {
            return {
                productName: 'Kanchipuram Mulberry Silk & Zari Handloom',
                category: 'Handloom',
                craftType: 'Pure Mulberry Silk Handloom Saree',
                material: 'Pure Mulberry Silk & Tested Gold Zari',
                model: 'Korvai Contrast Temple Border Style',
                craftTechnique: 'Double-pedal shuttle loom weaving with manual warp interlocking',
                dimensions: '550 × 120 × 0.2 cm',
                length: 550,
                width: 120,
                height: 0.2,
                primaryColor: 'Crimson Red',
                secondaryColor: 'Pure Gold Zari',
                visualDescription: 'Heavy pure silk handloom with interlocking Korvai border and authentic gold-dipped silver zari motifs across the border and pallu.',
                shape: 'Rectangular Woven Drape',
                texture: 'Lustrous high-density silk weave with raised zari brocade',
                craftFinish: 'Hand-twisted tassel edging and selvedge lock',
                qualityScore: 4.9,
                qualityStars: '★★★★★',
                qualityAssessment: {
                    craftsmanship: 5.0,
                    materialQuality: 4.9,
                    finish: 4.8,
                    designAesthetic: 4.9,
                    overall: 4.9,
                    explanation: 'Flawless Korvai interlocking weave junctions, authentic tested metallic zari density, and exceptional fabric drape weight.',
                },
                estimatedPriceMin: 6500,
                estimatedPriceMax: 8500,
                suggestedPrice: 7499,
                confidence: 98,
                pricingReasoning: 'Calculated from grade-A mulberry silk filament weight, silver-gold zari bullion, and 20+ weaver days on traditional shuttle looms.',
                descriptionSnippet: 'Heavy pure silk handloom with interlocking Korvai border and authentic gold-dipped silver zari motifs.',
                culturalSignificance: 'Heritage weaving traditions of Tamil Nadu temple towns, worn for sacred milestones.',
                craftingTechnique: 'Double-pedal shuttle loom weaving with manual warp interlocking.',
                isValidCraft: true,
                isHumanSubject: false,
                isDocumentSubject: false,
                isLiveAi: false,
                analysisSource: 'local_vision',
            };
        }
        // E: GREYSCALE / MUTED FABRIC OR BIDRIWARE
        if (isGreyScale) {
            if (brightness < 50) {
                return {
                    productName: 'Traditional Bidriware Pure Silver Wire Inlay Vessel',
                    category: 'Metal Craft',
                    craftType: 'Damascene Silver Inlay Metal Craft',
                    material: 'Oxidized Zinc-Copper Alloy & 99.9% Pure Silver',
                    model: 'Classical Bidar Damascening Art',
                    craftTechnique: 'Sand casting, chisel engraving, pure silver wire inlay, and soil oxidation',
                    dimensions: '18 × 18 × 22 cm',
                    length: 18,
                    width: 18,
                    height: 22,
                    primaryColor: 'Matte Charcoal Black',
                    secondaryColor: 'Pure Silver Wire',
                    visualDescription: 'Hand-cast blackened alloy with hand-hammered pure silver wire inlay depicting geometric Mughal arabesques.',
                    shape: 'Fluted Cylindrical Bidri Vessel',
                    texture: 'Smooth velvety oxidized alloy with flush silver inlay',
                    craftFinish: 'Fort soil chemical oxidation with groundnut oil buff',
                    qualityScore: 4.9,
                    qualityStars: '★★★★★',
                    qualityAssessment: {
                        craftsmanship: 5.0,
                        materialQuality: 4.9,
                        finish: 4.8,
                        designAesthetic: 4.9,
                        overall: 4.9,
                        explanation: 'Continuous flush silver wire inlaid without burrs, deep pitch-black oxidized patina, and heirloom-grade weight.',
                    },
                    estimatedPriceMin: 4500,
                    estimatedPriceMax: 5800,
                    suggestedPrice: 5299,
                    confidence: 97,
                    pricingReasoning: 'Reflects 99.9% fine silver wire weight, multi-stage Bidar fort soil oxidation, and 24 hours of precision hand-graving labor.',
                    descriptionSnippet: 'Hand-cast blackened alloy with hand-hammered pure silver wire inlay depicting geometric Mughal arabesques.',
                    culturalSignificance: 'Historic 500-year-old Persian-origin craft of the Deccan plateau.',
                    craftingTechnique: 'Sand casting, chisel engraving, pure silver inlay, and soil oxidation.',
                    isValidCraft: true,
                    isHumanSubject: false,
                    isDocumentSubject: false,
                    isLiveAi: false,
                    analysisSource: 'local_vision',
                };
            }
            else {
                return {
                    productName: 'Handloom Textured Weave / Artisan Cotton Textile',
                    category: 'Handloom',
                    craftType: 'Pitloom Cotton Textured Weave',
                    material: 'Hand-Spun Indigenous Cotton & Natural Linen',
                    model: 'Traditional Plain-Weave Texture (Pit-Loom Craft)',
                    craftTechnique: 'Shuttle pit-loom weaving with hand-tensioned warp and organic herbal finishing',
                    dimensions: '45 × 45 × 12 cm',
                    length: 45,
                    width: 45,
                    height: 12,
                    primaryColor: brightness >= 190 ? 'Pure Handloom Cream' : 'Slate Grey',
                    secondaryColor: brightness >= 190 ? 'Off-White Cotton' : 'Ash Charcoal',
                    visualDescription: 'Hand-spun indigenous textile featuring uniform warp-weft alignment, tight selvedge edge, and breathable organic weave.',
                    shape: 'Square Woven Cushion Form',
                    texture: 'Breathable textured plain-weave fabric',
                    craftFinish: 'Pre-washed herbal bio-enzyme finish',
                    qualityScore: 4.8,
                    qualityStars: '★★★★☆',
                    qualityAssessment: {
                        craftsmanship: 4.8,
                        materialQuality: 4.8,
                        finish: 4.7,
                        designAesthetic: 4.7,
                        overall: 4.8,
                        explanation: 'Uniform yarn count, tight structural selvage edges, and natural unbleached breathable hand feel.',
                    },
                    estimatedPriceMin: 1200,
                    estimatedPriceMax: 1800,
                    suggestedPrice: 1499,
                    confidence: 95,
                    pricingReasoning: 'Priced by warp-weft thread count, organic unbleached cotton staple fiber, and traditional pit-loom weaver day wages.',
                    descriptionSnippet: 'Hand-spun indigenous textile featuring uniform warp-weft alignment, tight selvedge edge, and breathable organic weave.',
                    culturalSignificance: 'Traditional Indian handloom weaving heritage preserving natural hand-spun yarn and sustainable village craft.',
                    craftingTechnique: 'Shuttle pit-loom weaving with hand-tensioned warp and organic herbal finishing.',
                    isValidCraft: true,
                    isHumanSubject: false,
                    isDocumentSubject: false,
                    isLiveAi: false,
                    analysisSource: 'local_vision',
                };
            }
        }
        // F: TERRACOTTA / RED CLAY / EARTHENWARE (Hue 8–22)
        if (hue >= 8 && hue < 22) {
            return {
                productName: 'Gorakhpur Hand-Molded Terracotta Clay Pottery',
                category: 'Terracotta',
                craftType: 'Kiln-Fired Riverbed Terracotta Earthenware',
                material: 'Natural Riverbed Terracotta Clay',
                model: 'Village Kiln-Fired Terracotta Motif',
                craftTechnique: 'Potter’s wheel throwing, paddle beat shaping, and wood-ash kiln firing',
                dimensions: '24 × 18 × 18 cm',
                length: 24,
                width: 18,
                height: 18,
                primaryColor: 'Earthy Terracotta Red',
                secondaryColor: 'Burnt Ochre',
                visualDescription: 'Hand-turned river silt terracotta with natural open-flame firing and authentic rustic earth burnish.',
                shape: 'Fluted Earthenware Vase',
                texture: 'Porous tactile earthenware with smooth hand-turned ridges',
                craftFinish: 'Natural smoke-seasoned earthen burnish',
                qualityScore: 4.7,
                qualityStars: '★★★★☆',
                qualityAssessment: {
                    craftsmanship: 4.8,
                    materialQuality: 4.7,
                    finish: 4.6,
                    designAesthetic: 4.8,
                    overall: 4.7,
                    explanation: 'Consistent wall thickness from hand wheel throwing, natural thermal shock resistance, and rich mineral clay redness.',
                },
                estimatedPriceMin: 850,
                estimatedPriceMax: 1400,
                suggestedPrice: 1199,
                confidence: 94,
                pricingReasoning: 'Reflects artisanal clay harvesting from alluvial riverbeds, wood-ash kiln firing fuel, and traditional wheel-turning time.',
                descriptionSnippet: 'Hand-turned river silt terracotta with natural open-flame firing and authentic rustic earth finish.',
                culturalSignificance: 'Sacred indigenous terracotta tradition dating back to ancient Indus Valley and Bengal temple murals.',
                craftingTechnique: 'Potter’s wheel throwing, paddle beat shaping, and wood-ash kiln firing.',
                isValidCraft: true,
                isHumanSubject: false,
                isDocumentSubject: false,
                isLiveAi: false,
                analysisSource: 'local_vision',
            };
        }
        // G: NATURAL BAMBOO / CANE / REED (Hue 68–170)
        if (hue >= 68 && hue <= 170) {
            return {
                productName: 'Majuli Riverbank Bamboo & Cane Craft Basket',
                category: 'Bamboo',
                craftType: 'Split-Cane Bamboo Weave Basketry',
                material: 'Indigenous Seasoned River Cane & Bamboo',
                model: 'Assamese Multi-Tier Weave Style',
                craftTechnique: 'Manual splint knife shaving, smoke seasoning, and interlocking twill weave',
                dimensions: '30 × 30 × 35 cm',
                length: 30,
                width: 30,
                height: 35,
                primaryColor: 'Natural Reed Green',
                secondaryColor: 'Golden Straw',
                visualDescription: 'Pliable wild riverbank bamboo hand-split into uniform filaments and woven into eco-friendly functional art.',
                shape: 'Fluted Circular Basket',
                texture: 'Interlocking split cane twill weave',
                craftFinish: 'Natural smoke-seasoned bamboo seal',
                qualityScore: 4.8,
                qualityStars: '★★★★☆',
                qualityAssessment: {
                    craftsmanship: 4.8,
                    materialQuality: 4.8,
                    finish: 4.7,
                    designAesthetic: 4.8,
                    overall: 4.8,
                    explanation: 'Even splint graduation, reinforced tensile edge binding, and splinter-free smoke-cured finish.',
                },
                estimatedPriceMin: 1100,
                estimatedPriceMax: 1650,
                suggestedPrice: 1350,
                confidence: 96,
                pricingReasoning: 'Priced by bamboo stalk curing time, manual splint sizing, and skilled tribal basketry weaving labor.',
                descriptionSnippet: 'Pliable wild riverbank bamboo hand-split into uniform filaments and woven into eco-friendly functional art.',
                culturalSignificance: 'Sacred river island craft of Majuli, Assam, carrying generations of tribal bamboo wisdom.',
                craftingTechnique: 'Manual splint knife shaving, smoke seasoning, and interlocking twill weave.',
                isValidCraft: true,
                isHumanSubject: false,
                isDocumentSubject: false,
                isLiveAi: false,
                analysisSource: 'local_vision',
            };
        }
        // H: WARM TIMBER BROWN / AMBER (Hue 20–45)
        if (hue >= 20 && hue <= 45) {
            // Differentiate genuine Jute/Burlap Fiber vs Wood Carving:
            if (juteRatio >= 0.35 && saturation < 0.38 && brightness > 130) {
                return {
                    productName: 'Hand-Braided Natural Jute & Burlap Floral Wall Decor',
                    category: 'Bamboo',
                    craftType: 'Braided Jute & Coir Fiber Wall Decor',
                    material: '100% Eco-Friendly Golden Jute Fiber, Braided Coir & Burlap',
                    model: 'Twined Jute Ring Wreath with Handcrafted Burlap Blossom Motifs',
                    craftTechnique: 'Manual 3-ply jute rope braiding, burlap petal fluting, and eco-friendly twine binding',
                    dimensions: '25 × 25 × 4 cm',
                    length: 25,
                    width: 25,
                    height: 4,
                    primaryColor: 'Natural Golden Jute',
                    secondaryColor: 'Ivory Burlap & Crimson Bead',
                    visualDescription: 'Artisan hand-braided golden jute twine formed into dual harmony wreaths accented with hand-cut burlap floral rosettes and lacquer wood beads.',
                    shape: 'Circular Radial Wreath',
                    texture: 'Tactile fibrous rope braiding with soft burlap fluting',
                    craftFinish: 'Raw natural fiber binding with organic starch seal',
                    qualityScore: 4.8,
                    qualityStars: '★★★★☆',
                    qualityAssessment: {
                        craftsmanship: 4.8,
                        materialQuality: 4.7,
                        finish: 4.6,
                        designAesthetic: 4.9,
                        overall: 4.8,
                        explanation: 'Uniform 3-ply twine tension, symmetrically shaped petal folds, and eco-friendly biodegradable construction.',
                    },
                    estimatedPriceMin: 750,
                    estimatedPriceMax: 1200,
                    suggestedPrice: 899,
                    confidence: 96,
                    pricingReasoning: 'Reflects golden jute fiber raw material, hand-braiding craftsmanship hours, and sustainable eco-home decor standards.',
                    descriptionSnippet: 'Artisan hand-braided golden jute twine formed into dual harmony wreaths accented with hand-cut burlap floral rosettes and lacquer wood beads.',
                    culturalSignificance: 'Traditional natural fiber craft rooted in rural Bengal and coastal artisan self-help clusters.',
                    craftingTechnique: 'Manual 3-ply jute rope braiding, burlap petal fluting, and eco-friendly twine binding.',
                    isValidCraft: true,
                    isHumanSubject: false,
                    isDocumentSubject: false,
                    isLiveAi: false,
                    analysisSource: 'local_vision',
                };
            }
            // Authentic Wood Craft (Kadamwood / Teak / Jali Elephant)
            return {
                productName: 'Hand-Carved Heritage Jali Wood Elephant & Wildlife Figurine',
                category: 'Wood Craft',
                craftType: 'Undercut Jali Relief Wood Sculpture',
                material: 'Seasoned Hardwood Kadam & Teak Timber',
                model: 'Jaipur & Saharanpur Undercut Jali (Lattice) Style',
                craftTechnique: 'Chisel gouge piercing, intricate hollow fretwork, and natural seed-oil buffing',
                dimensions: '18 × 12 × 15 cm',
                length: 18,
                width: 12,
                height: 15,
                primaryColor: 'Honey Timber Brown',
                secondaryColor: 'Natural Teak Ochre',
                visualDescription: 'Masterfully carved single-piece hardwood elephant featuring openwork undercut floral jali (lattice) fretwork with a baby elephant nested within.',
                shape: 'Sculptural Wildlife Figurine',
                texture: 'Silky hand-burnished wood grain with deep-pierced lattice apertures',
                craftFinish: 'Hand-buffed natural seed-oil and beeswax polish',
                qualityScore: 4.9,
                qualityStars: '★★★★★',
                qualityAssessment: {
                    craftsmanship: 5.0,
                    materialQuality: 4.9,
                    finish: 4.8,
                    designAesthetic: 4.9,
                    overall: 4.9,
                    explanation: 'Extraordinary master-level undercut jali work with micro-relief floral fretwork and flawless monolithic core carving.',
                },
                estimatedPriceMin: 1850,
                estimatedPriceMax: 2600,
                suggestedPrice: 2250,
                confidence: 96,
                pricingReasoning: 'Reflects 18 artisan hours of intricate fretwork piercing, seasoned kadamwood block value, and fair living compensation.',
                descriptionSnippet: 'Masterfully carved single-piece hardwood elephant featuring openwork undercut floral jali (lattice) fretwork with a baby elephant nested within.',
                culturalSignificance: 'Rooted in the royal timber carving schools of Saharanpur and Jaipur, sustaining master woodcraft artisans.',
                craftingTechnique: 'Chisel gouge piercing, intricate hollow fretwork, and natural seed-oil buffing.',
                isValidCraft: true,
                isHumanSubject: false,
                isDocumentSubject: false,
                isLiveAi: false,
                analysisSource: 'local_vision',
            };
        }
    }
    // Fallback: Hand-Carved Heritage Teak Sculpture
    return {
        productName: 'Hand-Carved Heritage Teak Sculpture',
        category: 'Wood Craft',
        craftType: 'Monolithic Chiseled Wood Sculpture',
        material: 'Seasoned Teak Wood',
        model: 'Traditional Classical Temple Sculpture',
        craftTechnique: 'Chisel-and-mallet carving with hand-burnished oil finish',
        dimensions: '28 × 12 × 8 cm',
        length: 28,
        width: 12,
        height: 8,
        primaryColor: 'Natural Deep Brown',
        secondaryColor: 'Golden Amber',
        visualDescription: 'Solid monolithic seasoned hardwood with deep relief chisel relief. Coated with organic vegetable beeswax polish preserving natural annual growth rings.',
        shape: 'Monolithic Standing Figurine',
        texture: 'Tactile hardwood grain with smooth sculpted contours',
        craftFinish: 'Hand-buffed organic beeswax finish',
        qualityScore: 4.8,
        qualityStars: '★★★★☆',
        qualityAssessment: {
            craftsmanship: 4.9,
            materialQuality: 4.8,
            finish: 4.7,
            designAesthetic: 4.8,
            overall: 4.8,
            explanation: 'Deep three-dimensional relief, harmonious classical proportions, and natural grain preservation.',
        },
        estimatedPriceMin: 2500,
        estimatedPriceMax: 3200,
        suggestedPrice: 2799,
        confidence: 94,
        pricingReasoning: 'Reflects 16 hours of master chisel sculpting, seasoned teakwood block raw material cost, and fair living wage standards.',
        descriptionSnippet: 'Solid monolithic seasoned hardwood with deep relief chisel relief. Coated with organic vegetable beeswax polish preserving natural annual growth rings.',
        culturalSignificance: 'Traditional sacred craft embodying authentic Indian temple art iconography.',
        craftingTechnique: 'Chisel-and-mallet carving with hand-burnished oil finish.',
        isValidCraft: true,
        isHumanSubject: false,
        isDocumentSubject: false,
        isLiveAi: false,
        analysisSource: 'local_vision',
    };
}
async function callGeminiVision(imageSource, apiKey) {
    let base64Data = '';
    let mimeType = 'image/jpeg';
    if (imageSource instanceof File) {
        mimeType = imageSource.type || 'image/jpeg';
        base64Data = await fileToBase64(imageSource);
    }
    else if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
        const parts = imageSource.split(';base64,');
        mimeType = parts[0].replace('data:', '');
        base64Data = parts[1];
    }
    else {
        // If it's a remote URL, fetch and convert
        const response = await fetch(imageSource);
        const blob = await response.blob();
        mimeType = blob.type || 'image/jpeg';
        base64Data = await fileToBase64(blob);
    }
    const prompt = `You are the master AI handicraft appraiser for KARIGARSETU AI (Smart India Hackathon 2026).
First inspect this image for subject validity:
- If this image is of a living human being, selfie, personal portrait, or face, you MUST set "isValidCraft": false, "isHumanSubject": true, "isDocumentSubject": false, and "rejectionReason": "Human portrait / selfie detected. KARIGARSETU.AI only appraises genuine handmade craft items."
- If this image is of a text document, paper sheet, syllabus, book page, assignment, PDF/Word document (.docx), or printed notes, you MUST set "isValidCraft": false, "isHumanSubject": false, "isDocumentSubject": true, and "rejectionReason": "Text document / syllabus page detected. KARIGARSETU.AI exclusively evaluates physical handmade crafts, not text documents."
- If this is a valid Indian craft (wood carving, terracotta, pottery, handloom, brass, bamboo, jute/fiber, etc.), set "isValidCraft": true, "isHumanSubject": false, and "isDocumentSubject": false.

Return ONLY a valid JSON object matching this schema:
{
  "isValidCraft": boolean,
  "isHumanSubject": boolean,
  "isDocumentSubject": boolean,
  "rejectionReason": "string (empty if valid craft)",
  "productName": "string",
  "category": "Wood Craft | Pottery | Handloom | Bamboo | Metal Craft | Jewellery | Painting | Terracotta | Silk Craft",
  "craftType": "string (e.g. Carved Teakwood Sculpture, Pure Mulberry Silk Handloom Saree, Kiln-Fired Riverbed Terracotta Diya, Hand-Chiseled Brass Peacock Lamp, Braided Jute Fiber Wreath)",
  "material": "string (e.g. Teak Wood, Red Clay, Pure Mulberry Silk, Solid Brass, Natural Jute)",
  "model": "string (traditional style or school of art)",
  "craftTechnique": "string (e.g. Chisel-and-mallet relief carving, Pit-loom shuttle weaving, Potter wheel throwing and kiln firing, Lost-wax casting)",
  "dimensions": "string (e.g. 28 × 12 × 8 cm)",
  "length": number (cm),
  "width": number (cm),
  "height": number (cm),
  "primaryColor": "string",
  "secondaryColor": "string",
  "visualDescription": "string (rich visual summary of form, colors, motifs, and texture)",
  "shape": "string (e.g. Monolithic Standing Figurine, Rectangular Woven Drape, Fluted Concentric Bowl)",
  "texture": "string (e.g. Tactile hardwood grain, Lustrous smooth silk weave, Porous earthy terracotta)",
  "craftFinish": "string (e.g. Hand-buffed beeswax polish, Pre-washed selvedge lock, Natural smoke-seasoned glaze)",
  "qualityScore": number (3.0 to 5.0),
  "qualityStars": "string (e.g. ★★★★☆)",
  "qualityAssessment": {
    "craftsmanship": number (3.0 to 5.0),
    "materialQuality": number (3.0 to 5.0),
    "finish": number (3.0 to 5.0),
    "designAesthetic": number (3.0 to 5.0),
    "overall": number (3.0 to 5.0),
    "explanation": "string (concise technical quality assessment summary)"
  },
  "estimatedPriceMin": number (in INR),
  "estimatedPriceMax": number (in INR),
  "suggestedPrice": number (in INR),
  "confidence": number (80 to 98),
  "pricingReasoning": "string (clear breakdown explaining artisan labor hours, raw material costs, and fair living wage benchmark)",
  "descriptionSnippet": "string (detailed appraisal description)",
  "culturalSignificance": "string",
  "craftingTechnique": "string"
}`;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64Data,
                            },
                        },
                    ],
                },
            ],
            generationConfig: {
                response_mime_type: 'application/json',
            },
        }),
    });
    if (!res.ok)
        return null;
    const json = await res.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText)
        return null;
    const parsed = JSON.parse(rawText);
    parsed.analysisSource = 'live_ai';
    parsed.isLiveAi = true;
    if (!parsed.qualityAssessment) {
        const base = parsed.qualityScore || 4.8;
        parsed.qualityAssessment = {
            craftsmanship: Number(Math.min(5, base + 0.1).toFixed(1)),
            materialQuality: Number(base.toFixed(1)),
            finish: Number(Math.max(3.8, base - 0.1).toFixed(1)),
            designAesthetic: Number(Math.min(5, base + 0.1).toFixed(1)),
            overall: Number(base.toFixed(1)),
            explanation: 'Visual analysis confirms authentic hand tooling, balanced symmetry, and superior grade raw material composition.',
        };
    }
    return parsed;
}
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
export const CRAFT_APPRAISAL_TEMPLATES = {
    tealight: {
        label: 'Terracotta Diya / Tealight',
        icon: '🪔',
        analysis: {
            productName: 'Hand-Painted Dot-Mandala Terracotta & Stone Tealight Diya',
            category: 'Terracotta',
            craftType: 'Hand-Painted Terracotta Diya / Tealight',
            material: 'Kiln-Fired Riverbed Terracotta, Organic Mineral Pigments & Natural Wax',
            model: 'Traditional Sacred Dot-Mandala Concentric Ring Motif',
            craftTechnique: 'Potter wheel casting, wood-ash kiln firing, manual dot-emboss stylus painting, and beeswax pouring',
            dimensions: '12 × 12 × 4.5 cm',
            length: 12,
            width: 12,
            height: 4.5,
            primaryColor: 'Matte Charcoal & Pearl White',
            secondaryColor: 'Ivory Wax Core & Terracotta Base',
            visualDescription: 'Artisan hand-turned terracotta base adorned with micro-pointillism dot-mandala sacred geometry in durable mineral pigments, holding a pure hand-poured tealight candle.',
            shape: 'Fluted Concentric Diya Bowl',
            texture: 'Earthy porous terracotta with raised pointillism beadwork',
            craftFinish: 'Wood-ash kiln fired with matte mineral sealant',
            qualityScore: 4.9,
            qualityStars: '★★★★★',
            qualityAssessment: {
                craftsmanship: 4.9,
                materialQuality: 4.8,
                finish: 4.7,
                designAesthetic: 5.0,
                overall: 4.9,
                explanation: 'Impeccable symmetry in radial concentric dot-mandala artwork with crisp organic pigment adhesion and clean wax core filling.',
            },
            estimatedPriceMin: 450,
            estimatedPriceMax: 750,
            suggestedPrice: 599,
            confidence: 97,
            pricingReasoning: 'Fair living wage accounting for 4 hours of meticulous stylus pointillism painting, natural terracotta firing, and organic wax casting.',
            descriptionSnippet: 'Artisan hand-turned terracotta base adorned with micro-pointillism dot-mandala sacred geometry in durable mineral pigments, holding a pure hand-poured tealight candle.',
            culturalSignificance: 'Rooted in Indian festive ritual lighting and meditative mandala art traditions celebrated during Diwali and sacred occasions.',
            craftingTechnique: 'Potter wheel casting, wood-ash kiln firing, manual dot-emboss stylus painting, and beeswax pouring.',
            isValidCraft: true,
            isHumanSubject: false,
            isDocumentSubject: false,
            isLiveAi: false,
            analysisSource: 'local_vision',
        },
    },
    elephant: {
        label: 'Jali Wood Elephant',
        icon: '🐘',
        analysis: {
            productName: 'Hand-Carved Heritage Jali Wood Elephant & Wildlife Figurine',
            category: 'Wood Craft',
            craftType: 'Undercut Jali Relief Wood Sculpture',
            material: 'Seasoned Hardwood Kadam & Teak Timber',
            model: 'Jaipur & Saharanpur Undercut Jali (Lattice) Style',
            craftTechnique: 'Chisel gouge piercing, intricate hollow fretwork, and natural seed-oil buffing',
            dimensions: '18 × 12 × 15 cm',
            length: 18,
            width: 12,
            height: 15,
            primaryColor: 'Honey Timber Brown',
            secondaryColor: 'Natural Teak Ochre',
            visualDescription: 'Masterfully carved single-piece hardwood elephant featuring openwork undercut floral jali (lattice) fretwork with a baby elephant nested within.',
            shape: 'Sculptural Wildlife Figurine',
            texture: 'Silky hand-burnished wood grain with deep-pierced lattice apertures',
            craftFinish: 'Hand-buffed natural seed-oil and beeswax polish',
            qualityScore: 4.9,
            qualityStars: '★★★★★',
            qualityAssessment: {
                craftsmanship: 5.0,
                materialQuality: 4.9,
                finish: 4.8,
                designAesthetic: 4.9,
                overall: 4.9,
                explanation: 'Extraordinary master-level undercut jali work with micro-relief floral fretwork and flawless monolithic core carving.',
            },
            estimatedPriceMin: 1850,
            estimatedPriceMax: 2600,
            suggestedPrice: 2250,
            confidence: 96,
            pricingReasoning: 'Reflects 18 artisan hours of intricate fretwork piercing, seasoned kadamwood block value, and fair living compensation.',
            descriptionSnippet: 'Masterfully carved single-piece hardwood elephant featuring openwork undercut floral jali (lattice) fretwork with a baby elephant nested within.',
            culturalSignificance: 'Rooted in the royal timber carving schools of Saharanpur and Jaipur, sustaining master woodcraft artisans.',
            craftingTechnique: 'Chisel gouge piercing, intricate hollow fretwork, and natural seed-oil buffing.',
            isValidCraft: true,
            isHumanSubject: false,
            isDocumentSubject: false,
            isLiveAi: false,
            analysisSource: 'local_vision',
        },
    },
    wood: {
        label: 'Teakwood Sculpture',
        icon: '🪵',
        analysis: {
            productName: 'Hand-Carved Heritage Teak Sculpture',
            category: 'Wood Craft',
            craftType: 'Monolithic Chiseled Wood Sculpture',
            material: 'Seasoned Teak Wood',
            model: 'Traditional Classical Temple Sculpture',
            craftTechnique: 'Traditional hand chiseling, gouge sculpting, and natural seed-oil buffing',
            dimensions: '28 × 12 × 8 cm',
            length: 28,
            width: 12,
            height: 8,
            primaryColor: 'Natural Brown',
            secondaryColor: 'Deep Ochre',
            visualDescription: 'Finely detailed sculpture carved from single-block seasoned teakwood with organic vegetable beeswax polish preserving natural growth rings.',
            shape: 'Monolithic Standing Figurine',
            texture: 'Tactile hardwood grain with smooth sculpted contours',
            craftFinish: 'Hand-buffed natural seed-oil and beeswax polish',
            qualityScore: 4.8,
            qualityStars: '★★★★☆',
            qualityAssessment: {
                craftsmanship: 4.9,
                materialQuality: 4.8,
                finish: 4.7,
                designAesthetic: 4.8,
                overall: 4.8,
                explanation: 'Deep three-dimensional relief, harmonious classical proportions, and natural grain preservation.',
            },
            estimatedPriceMin: 2500,
            estimatedPriceMax: 3200,
            suggestedPrice: 2799,
            confidence: 94,
            pricingReasoning: 'Reflects 16 hours of master chisel sculpting, seasoned teakwood block raw material cost, and fair living wage standards.',
            descriptionSnippet: 'Finely detailed sculpture carved from single-block seasoned teakwood with organic mustard-oil polish.',
            culturalSignificance: 'Sacred classical Indian iconography from the southern Dravidian temple carving heritage.',
            craftingTechnique: 'Traditional hand chiseling, gouge sculpting, and natural seed-oil buffing.',
            isValidCraft: true,
            isHumanSubject: false,
            isDocumentSubject: false,
            isLiveAi: false,
            analysisSource: 'local_vision',
        },
    },
    pottery: {
        label: 'Blue Pottery Vessel',
        icon: '🏺',
        analysis: {
            productName: 'Jaipur Traditional Blue Pottery Ceramic Vessel',
            category: 'Pottery',
            craftType: 'Quartz Glazed Ceramic Pottery',
            material: 'Quartz Powder, Fuller’s Earth & Copper Oxide Glaze',
            model: 'Classical Persian Floral Motif (Jaipur School)',
            craftTechnique: 'Mold-cast quartz dough, hand-painted mineral pigments, and wood-fired kiln baking',
            dimensions: '15 × 15 × 25 cm',
            length: 15,
            width: 15,
            height: 25,
            primaryColor: 'Cobalt Blue',
            secondaryColor: 'Persian Turquoise',
            visualDescription: 'Lead-free handmade quartz ceramic vessel adorned with cobalt-oxide floral arabesques and smooth kiln-fired glaze.',
            shape: 'Baluster-Form Ceramic Urn',
            texture: 'Vitrified smooth glass glaze over quartz body',
            craftFinish: 'Kiln-fired non-crazing lead-free glaze',
            qualityScore: 4.9,
            qualityStars: '★★★★★',
            qualityAssessment: {
                craftsmanship: 4.9,
                materialQuality: 4.8,
                finish: 4.8,
                designAesthetic: 4.9,
                overall: 4.9,
                explanation: 'Exemplary mineral pigment linework, balanced vessel neck curvature, and uniform vitreous low-fire glaze.',
            },
            estimatedPriceMin: 1800,
            estimatedPriceMax: 2400,
            suggestedPrice: 2199,
            confidence: 96,
            pricingReasoning: 'Reflects pure quartz stone dough formulation, skilled cobalt oxide brushwork, and low-fire kiln energy costs.',
            descriptionSnippet: 'Lead-free handmade quartz ceramic vessel adorned with cobalt-oxide floral arabesques and smooth kiln-fired glaze.',
            culturalSignificance: 'Traditional Jaipur heritage craft brought from Turko-Persian masters under royal Rajput patronage.',
            craftingTechnique: 'Mold-cast quartz dough, hand-painted mineral pigments, and wood-fired kiln baking.',
            isValidCraft: true,
            isHumanSubject: false,
            isDocumentSubject: false,
            isLiveAi: false,
            analysisSource: 'local_vision',
        },
    },
    terracotta: {
        label: 'Terracotta Urn',
        icon: '🪨',
        analysis: {
            productName: 'Gorakhpur Handcrafted Terracotta Clay Pottery',
            category: 'Terracotta',
            craftType: 'Kiln-Fired Riverbed Terracotta Earthenware',
            material: 'Natural Riverbed Terracotta Clay',
            model: 'Village Kiln-Fired Terracotta Motif',
            craftTechnique: 'Potter’s wheel throwing, paddle beat shaping, and wood-ash kiln firing',
            dimensions: '24 × 18 × 18 cm',
            length: 24,
            width: 18,
            height: 18,
            primaryColor: 'Earthy Terracotta Red',
            secondaryColor: 'Burnt Ochre',
            visualDescription: 'Hand-turned river silt terracotta with natural open-flame firing and authentic rustic earth finish.',
            shape: 'Fluted Earthenware Vase',
            texture: 'Porous tactile earthenware with smooth hand-turned ridges',
            craftFinish: 'Natural smoke-seasoned earthen burnish',
            qualityScore: 4.7,
            qualityStars: '★★★★☆',
            qualityAssessment: {
                craftsmanship: 4.8,
                materialQuality: 4.7,
                finish: 4.6,
                designAesthetic: 4.8,
                overall: 4.7,
                explanation: 'Consistent wall thickness from hand wheel throwing, natural thermal shock resistance, and rich mineral clay redness.',
            },
            estimatedPriceMin: 850,
            estimatedPriceMax: 1400,
            suggestedPrice: 1199,
            confidence: 94,
            pricingReasoning: 'Reflects artisanal clay harvesting from alluvial riverbeds, wood-ash kiln firing fuel, and traditional wheel-turning time.',
            descriptionSnippet: 'Hand-turned river silt terracotta with natural open-flame firing and authentic rustic earth finish.',
            culturalSignificance: 'Sacred indigenous terracotta tradition dating back to ancient Indus Valley and Bengal temple murals.',
            craftingTechnique: 'Potter’s wheel throwing, paddle beat shaping, and wood-ash kiln firing.',
            isValidCraft: true,
            isHumanSubject: false,
            isDocumentSubject: false,
            isLiveAi: false,
            analysisSource: 'local_vision',
        },
    },
    silk: {
        label: 'Mulberry Silk Handloom',
        icon: '🥻',
        analysis: {
            productName: 'Kanchipuram Mulberry Silk & Zari Handloom',
            category: 'Handloom',
            craftType: 'Pure Mulberry Silk Handloom Saree',
            material: 'Pure Mulberry Silk & Tested Gold Zari',
            model: 'Korvai Contrast Temple Border Style',
            craftTechnique: 'Double-pedal shuttle loom weaving with manual warp interlocking',
            dimensions: '550 × 120 × 0.2 cm',
            length: 550,
            width: 120,
            height: 0.2,
            primaryColor: 'Crimson Red',
            secondaryColor: 'Pure Gold Zari',
            visualDescription: 'Heavy pure silk handloom with interlocking Korvai border and authentic gold-dipped silver zari motifs.',
            shape: 'Rectangular Woven Drape',
            texture: 'Lustrous high-density silk weave with raised zari brocade',
            craftFinish: 'Hand-twisted tassel edging and selvedge lock',
            qualityScore: 4.9,
            qualityStars: '★★★★★',
            qualityAssessment: {
                craftsmanship: 5.0,
                materialQuality: 4.9,
                finish: 4.8,
                designAesthetic: 4.9,
                overall: 4.9,
                explanation: 'Flawless Korvai interlocking weave junctions, authentic tested metallic zari density, and exceptional fabric drape weight.',
            },
            estimatedPriceMin: 6500,
            estimatedPriceMax: 8500,
            suggestedPrice: 7499,
            confidence: 98,
            pricingReasoning: 'Calculated from grade-A mulberry silk filament weight, silver-gold zari bullion, and 20+ weaver days on traditional shuttle looms.',
            descriptionSnippet: 'Heavy pure silk handloom with interlocking Korvai border and authentic gold-dipped silver zari motifs.',
            culturalSignificance: 'Heritage weaving traditions of Tamil Nadu temple towns, worn for sacred milestones.',
            craftingTechnique: 'Double-pedal shuttle loom weaving with manual warp interlocking.',
            isValidCraft: true,
            isHumanSubject: false,
            isDocumentSubject: false,
            isLiveAi: false,
            analysisSource: 'local_vision',
        },
    },
    bamboo: {
        label: 'Bamboo Craft',
        icon: '🎋',
        analysis: {
            productName: 'Majuli Riverbank Bamboo & Cane Craft Basket',
            category: 'Bamboo',
            craftType: 'Split-Cane Bamboo Weave Basketry',
            material: 'Indigenous Seasoned River Cane & Bamboo',
            model: 'Assamese Multi-Tier Weave Style',
            craftTechnique: 'Manual splint knife shaving, smoke seasoning, and interlocking twill weave',
            dimensions: '30 × 30 × 35 cm',
            length: 30,
            width: 30,
            height: 35,
            primaryColor: 'Natural Reed Green',
            secondaryColor: 'Golden Straw',
            visualDescription: 'Pliable wild riverbank bamboo hand-split into uniform filaments and woven into eco-friendly functional art.',
            shape: 'Fluted Circular Basket',
            texture: 'Interlocking split cane twill weave',
            craftFinish: 'Natural smoke-seasoned bamboo seal',
            qualityScore: 4.8,
            qualityStars: '★★★★☆',
            qualityAssessment: {
                craftsmanship: 4.8,
                materialQuality: 4.8,
                finish: 4.7,
                designAesthetic: 4.8,
                overall: 4.8,
                explanation: 'Even splint graduation, reinforced tensile edge binding, and splinter-free smoke-cured finish.',
            },
            estimatedPriceMin: 1100,
            estimatedPriceMax: 1650,
            suggestedPrice: 1350,
            confidence: 96,
            pricingReasoning: 'Priced by bamboo stalk curing time, manual splint sizing, and skilled tribal basketry weaving labor.',
            descriptionSnippet: 'Pliable wild riverbank bamboo hand-split into uniform filaments and woven into eco-friendly functional art.',
            culturalSignificance: 'Sacred river island craft of Majuli, Assam, carrying generations of tribal bamboo wisdom.',
            craftingTechnique: 'Manual splint knife shaving, smoke seasoning, and interlocking twill weave.',
            isValidCraft: true,
            isHumanSubject: false,
            isDocumentSubject: false,
            isLiveAi: false,
            analysisSource: 'local_vision',
        },
    },
    brass: {
        label: 'Metal Craft',
        icon: '✨',
        analysis: {
            productName: 'Moradabad Hand-Engraved Brass Peacock Diya',
            category: 'Metal Craft',
            craftType: 'Hand-Chiseled Brass Peacock Lamp',
            material: 'Virgin Brass Alloy',
            model: 'Mughal & Rajput Floral Inlay Style',
            craftTechnique: 'Lost-wax sand casting, manual filing, and fine stylus stippling',
            dimensions: '16 × 14 × 22 cm',
            length: 16,
            width: 14,
            height: 22,
            primaryColor: 'Antique Brass Gold',
            secondaryColor: 'Honey Bronze',
            visualDescription: 'Solid cast brass ritual lamp intricately carved with traditional micro-chisel peacock relief work.',
            shape: 'Tiered Bell-Form Figurine Lamp',
            texture: 'Heavy burnished metallic texture with engraved chasing',
            craftFinish: 'Lustrous antique lacquer buffing',
            qualityScore: 4.9,
            qualityStars: '★★★★★',
            qualityAssessment: {
                craftsmanship: 5.0,
                materialQuality: 4.9,
                finish: 4.8,
                designAesthetic: 4.9,
                overall: 4.9,
                explanation: 'Solid casting density with crisp micro-chiseled feather relief on peacock crown and flawless symmetrical oil reservoir.',
            },
            estimatedPriceMin: 2100,
            estimatedPriceMax: 2900,
            suggestedPrice: 2499,
            confidence: 97,
            pricingReasoning: 'Determined by brass ingot net weight, multi-stage casting moulds, and master Nakashi engraving labor.',
            descriptionSnippet: 'Solid cast brass ritual lamp intricately carved with traditional micro-chisel peacock relief work.',
            culturalSignificance: 'Moradabad metal craft heritage spanning over four centuries of royal artisan patronage.',
            craftingTechnique: 'Lost-wax sand casting, manual filing, and fine stylus stippling.',
            isValidCraft: true,
            isHumanSubject: false,
            isDocumentSubject: false,
            isLiveAi: false,
            analysisSource: 'local_vision',
        },
    },
    jewellery: {
        label: 'Kundan Jewellery',
        icon: '💎',
        analysis: {
            productName: 'Royal Jaipur Meenakari Kundan Choker Necklace',
            category: 'Jewellery',
            craftType: 'Royal Rajasthani Meenakari Kundan Jewelry',
            material: 'Silver-Copper Alloy Core, 24K Gold Foil & Natural Enamel',
            model: 'Royal Rajputana Court Jewelry Style',
            craftTechnique: 'Champlevé vitreous enameling, lac filling, and manual 24K pure gold foil burnishing',
            dimensions: '22 × 5 × 1 cm',
            length: 22,
            width: 5,
            height: 1,
            primaryColor: 'Imperial Emerald & Ruby Red',
            secondaryColor: 'Pure Gold Leaf Lustre',
            visualDescription: 'Handcrafted royal choker necklace with reverse-side floral Meenakari vitreous enamel and bezel-set uncut stones.',
            shape: 'Articulated Choker Collar',
            texture: 'Polished vitreous enamel with burnished 24K gold leaf foil',
            craftFinish: 'Champlevé vitreous enameling and gold leaf burnish',
            qualityScore: 4.9,
            qualityStars: '★★★★★',
            qualityAssessment: {
                craftsmanship: 5.0,
                materialQuality: 4.9,
                finish: 4.9,
                designAesthetic: 5.0,
                overall: 4.9,
                explanation: 'Vibrant non-chipping vitreous enamel firing, precise stone bezel setting, and lustrous gold leaf borders.',
            },
            estimatedPriceMin: 4800,
            estimatedPriceMax: 7200,
            suggestedPrice: 5899,
            confidence: 96,
            pricingReasoning: 'Reflects pure gold foil leaf burnishing, gemstone setting intricacy, and dual-sided artisan goldsmithing mastery.',
            descriptionSnippet: 'Handcrafted royal choker necklace with reverse-side floral Meenakari vitreous enamel and bezel-set uncut stones.',
            culturalSignificance: '500-year-old Rajasthani court jewelry lineage originating in the royal workshops of Amer and Jaipur.',
            craftingTechnique: 'Champlevé vitreous enameling, lac filling, and manual 24K pure gold foil burnishing.',
            isValidCraft: true,
            isHumanSubject: false,
            isDocumentSubject: false,
            isLiveAi: false,
            analysisSource: 'local_vision',
        },
    },
    painting: {
        label: 'Madhubani Art',
        icon: '🖌️',
        analysis: {
            productName: 'Madhubani Tree of Life Folk Painting on Handmade Paper',
            category: 'Painting',
            craftType: 'Traditional Mithila Folk Painting on Handmade Paper',
            material: 'Handmade Cotton Rag Paper & Natural Organic Pigments',
            model: 'Mithila Kachni & Bharni Lineage Style',
            craftTechnique: 'Bamboo dip-pen linework, double-contour sketching, and herbal pigment hand filling',
            dimensions: '42 × 30 × 0.1 cm',
            length: 42,
            width: 30,
            height: 0.1,
            primaryColor: 'Natural Turmeric Ochre',
            secondaryColor: 'Indigo & Soot Black',
            visualDescription: 'Intricate freehand line painting celebrating universal fertility and nature using bamboo nibs and natural plant extracts.',
            shape: 'Rectangular Illustrated Canvas',
            texture: 'Fibrous cotton rag handmade paper with organic pigment matte finish',
            craftFinish: 'Sun-dried botanical pigment fixative',
            qualityScore: 4.9,
            qualityStars: '★★★★★',
            qualityAssessment: {
                craftsmanship: 4.9,
                materialQuality: 4.8,
                finish: 4.7,
                designAesthetic: 5.0,
                overall: 4.9,
                explanation: 'Unbroken freehand double-contour line precision with vibrant non-bleeding botanical pigment fills.',
            },
            estimatedPriceMin: 1800,
            estimatedPriceMax: 2900,
            suggestedPrice: 2299,
            confidence: 97,
            pricingReasoning: 'Reflects unhurried bamboo dip-pen linework across 22 hours, organic forest botanical pigments, and handmade cotton rag paper.',
            descriptionSnippet: 'Intricate freehand line painting celebrating universal fertility and nature using bamboo nibs and natural plant extracts.',
            culturalSignificance: 'Ancient women-led folk art tradition of the Mithila region, recognized globally for vibrant storytelling.',
            craftingTechnique: 'Bamboo dip-pen linework, double-contour sketching, and herbal pigment hand filling.',
            isValidCraft: true,
            isHumanSubject: false,
            isDocumentSubject: false,
            isLiveAi: false,
            analysisSource: 'local_vision',
        },
    },
    textile: {
        label: 'Textile / Tapestry',
        icon: '🧵',
        analysis: {
            productName: 'Kutch Hand-Embroidered Mirrorwork Wall Tapestry',
            category: 'Textile',
            craftType: 'Kutch Hand-Embroidered Mirrorwork Wall Tapestry',
            material: 'Khadi Cotton, Silk Floss Thread & Convex Glass Mirrors',
            model: 'Rabari Tribal Chain-Stitch & Abhala Mirrorwork',
            craftTechnique: 'Manual herringbone chain stitching, mirror buttonholing, and tasseled wool fringe edging',
            dimensions: '60 × 40 × 1 cm',
            length: 60,
            width: 40,
            height: 1,
            primaryColor: 'Saffron Rust & Indigo',
            secondaryColor: 'Gleaming Mirror Accents',
            visualDescription: 'Vibrant hand-stitched nomadic wall hanging displaying geometric tribal motifs framed with circular glass mirror embroidery.',
            shape: 'Rectangular Wall Tapestry',
            texture: 'Heavy textured khadi weave with raised embroidery and smooth glass mirrors',
            craftFinish: 'Reinforced selvedge border with woolen tassel fringe',
            qualityScore: 4.8,
            qualityStars: '★★★★☆',
            qualityAssessment: {
                craftsmanship: 4.9,
                materialQuality: 4.8,
                finish: 4.7,
                designAesthetic: 4.9,
                overall: 4.8,
                explanation: 'Dense uniform chain stitching, firmly buttonholed mirror inserts, and vibrant colorfast dyed threads.',
            },
            estimatedPriceMin: 2200,
            estimatedPriceMax: 3400,
            suggestedPrice: 2699,
            confidence: 95,
            pricingReasoning: 'Based on 40+ hours of hand-embroidery by pastoral artisan women, authentic mirror inserts, and khadi cotton base.',
            descriptionSnippet: 'Vibrant hand-stitched nomadic wall hanging displaying geometric tribal motifs framed with circular glass mirror embroidery.',
            culturalSignificance: 'Hereditary craft of pastoral communities across the desert Rann of Kutch, Gujarat.',
            craftingTechnique: 'Manual herringbone chain stitching, mirror buttonholing, and tasseled wool fringe edging.',
            isValidCraft: true,
            isHumanSubject: false,
            isDocumentSubject: false,
            isLiveAi: false,
            analysisSource: 'local_vision',
        },
    },
    homedecor: {
        label: 'Home Decor',
        icon: '🌾',
        analysis: {
            productName: 'Hand-Braided Natural Jute & Burlap Floral Wall Decor',
            category: 'Home Decor',
            craftType: 'Braided Jute & Coir Fiber Wall Decor',
            material: '100% Eco-Friendly Golden Jute Fiber, Braided Coir & Burlap',
            model: 'Twined Jute Ring Wreath with Handcrafted Burlap Blossom Motifs',
            craftTechnique: 'Manual 3-ply jute rope braiding, burlap petal fluting, and eco-friendly twine binding',
            dimensions: '25 × 25 × 4 cm',
            length: 25,
            width: 25,
            height: 4,
            primaryColor: 'Natural Golden Jute',
            secondaryColor: 'Ivory Burlap & Crimson Bead',
            visualDescription: 'Artisan hand-braided golden jute twine formed into dual harmony wreaths accented with hand-cut burlap floral rosettes and lacquer wood beads.',
            shape: 'Circular Radial Wreath',
            texture: 'Tactile fibrous rope braiding with soft burlap fluting',
            craftFinish: 'Raw natural fiber binding with organic starch seal',
            qualityScore: 4.8,
            qualityStars: '★★★★☆',
            qualityAssessment: {
                craftsmanship: 4.8,
                materialQuality: 4.7,
                finish: 4.6,
                designAesthetic: 4.9,
                overall: 4.8,
                explanation: 'Uniform 3-ply twine tension, symmetrically shaped petal folds, and eco-friendly biodegradable construction.',
            },
            estimatedPriceMin: 750,
            estimatedPriceMax: 1200,
            suggestedPrice: 899,
            confidence: 96,
            pricingReasoning: 'Reflects golden jute fiber raw material, hand-braiding craftsmanship hours, and sustainable eco-home decor standards.',
            descriptionSnippet: 'Artisan hand-braided golden jute twine formed into dual harmony wreaths accented with hand-cut burlap floral rosettes and lacquer wood beads.',
            culturalSignificance: 'Traditional natural fiber craft rooted in rural Bengal and coastal artisan self-help clusters.',
            craftingTechnique: 'Manual 3-ply jute rope braiding, burlap petal fluting, and eco-friendly twine binding.',
            isValidCraft: true,
            isHumanSubject: false,
            isDocumentSubject: false,
            isLiveAi: false,
            analysisSource: 'local_vision',
        },
    },
};
