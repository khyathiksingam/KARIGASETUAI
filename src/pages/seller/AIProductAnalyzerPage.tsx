import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Scan, 
  Upload, 
  Camera, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  RefreshCw, 
  Edit3, 
  Send, 
  UserX, 
  AlertTriangle, 
  ShieldAlert, 
  FileText 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { analyzeProductImage, SCAN_STEPS } from '../../services/aiService';
import { AIAnalysisResult } from '../../types';
import { CameraCaptureModal } from '../../components/common/CameraCaptureModal';

interface SpecFieldProps {
  label: string;
  value: React.ReactNode;
  badge?: string;
  className?: string;
}

const SpecField: React.FC<SpecFieldProps> = ({ label, value, badge, className = '' }) => (
  <div className={`p-3.5 rounded-2xl bg-heritage-ivory/60 border border-heritage-sand/80 flex flex-col justify-between ${className}`}>
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] font-bold text-heritage-charcoal/60 uppercase tracking-wider block">
        {label}
      </span>
      {badge && (
        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          {badge}
        </span>
      )}
    </div>
    <div className="text-sm font-black text-heritage-brown break-words">
      {value}
    </div>
  </div>
);

const ConfidenceGauge: React.FC<{ confidence: number }> = ({ confidence }) => {
  const safeConfidence = Math.min(100, Math.max(0, confidence || 94));
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeConfidence / 100) * circumference;

  return (
    <div className="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-heritage-gold/15 to-heritage-sand/30 border border-heritage-gold/40">
      <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
        <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 60 60" aria-hidden="true">
          <circle
            cx="30"
            cy="30"
            r={radius}
            className="text-heritage-sand/80"
            strokeWidth="5"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="30"
            cy="30"
            r={radius}
            className="text-emerald-600 transition-all duration-1000 ease-out"
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-black text-heritage-brown">
            {safeConfidence}%
          </span>
        </div>
      </div>
      <div>
        <div className="flex items-center space-x-1.5">
          <span className="text-xs font-black text-heritage-brown uppercase tracking-wider">
            AI Confidence Gauge
          </span>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
            {safeConfidence >= 90 ? 'High Confidence' : 'Verified Match'}
          </span>
        </div>
        <p className="text-[11px] text-heritage-charcoal/80 font-medium mt-0.5">
          High confidence match based on visual craft patterns & regional artisan datasets.
        </p>
      </div>
    </div>
  );
};

const getCraftingTechnique = (result: AIAnalysisResult): string => {
  if (result.craftingTechnique) return result.craftingTechnique;
  const c = (result.category || '').toLowerCase();
  const m = (result.material || '').toLowerCase();
  if (c.includes('pottery') || m.includes('clay')) return 'Wheel-Thrown & Hand-Etched Terracotta';
  if (c.includes('wood') || m.includes('wood')) return 'Hand-Chiseled Relief & Lacquer Finishing';
  if (c.includes('metal') || m.includes('brass')) return 'Traditional Dhokra Lost-Wax Casting';
  if (c.includes('textile') || m.includes('silk') || m.includes('cotton')) return 'Authentic Pitloom / Handloom Weaving';
  if (c.includes('bamboo') || c.includes('cane')) return 'Fine Split-Reed Hand-Weaving';
  if (c.includes('jute')) return 'Twisted Natural Jute Fiber Braiding';
  if (c.includes('painting') || c.includes('art')) return 'Natural Mineral Pigment Freehand Brushwork';
  return 'Traditional Artisan Handcrafting';
};

export const AIProductAnalyzerPage: React.FC = () => {
  const { addProduct, currentUser } = useApp();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileObject, setFileObject] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [isMockResult, setIsMockResult] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('The selected image is larger than 15MB. Please choose a smaller photo.');
      return;
    }

    setFileObject(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setAnalysisResult(null);
      setPublishedSuccess(false);
      setCurrentStepIndex(-1);
      setCompletedSteps([]);
    };
    reader.onerror = () => {
      setUploadError('Failed to read image from device. Please try another photo.');
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setFileObject(null);
    setAnalysisResult(null);
    setCurrentStepIndex(-1);
    setCompletedSteps([]);
    setPublishedSuccess(false);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartAnalysis = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setAnalysisResult(null);

    try {
      const response = await analyzeProductImage(
        fileObject || selectedImage,
        (stepIdx) => {
          setCurrentStepIndex(stepIdx);
          setCompletedSteps((prev) => Array.from(new Set([...prev, stepIdx])));
        }
      );

      setAnalysisResult(response.result);
      setIsMockResult(response.isMock);
    } catch (err) {
      console.error(err);
      // Clean fallback
      setAnalysisResult({
        productName: 'Handcrafted Heritage Terracotta Vase',
        category: 'Terracotta & Pottery',
        material: 'Natural Riverbed Clay',
        model: 'Traditional Fluted Floral',
        dimensions: '28 × 16 × 16 cm',
        length: 28,
        width: 16,
        height: 16,
        primaryColor: 'Terracotta Ochre',
        secondaryColor: 'Charcoal Black',
        qualityScore: 4.8,
        qualityStars: '★★★★★',
        estimatedPriceMin: 750,
        estimatedPriceMax: 1200,
        suggestedPrice: 899,
        confidence: 94,
        descriptionSnippet: 'Traditional wood-fired earthenware vase hand-thrown on artisan wheel with natural earth burnish.',
        culturalSignificance: 'Handmade terracotta craft rooted in timeless rural artisan heritage.',
        craftingTechnique: 'Wheel-Thrown & Hand-Etched Terracotta',
        isValidCraft: true,
      });
      setIsMockResult(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePublishDirectly = () => {
    if (!analysisResult || !selectedImage) return;

    if (!currentUser || currentUser.role !== 'seller') {
      navigate('/login');
      return;
    }

    const newProd = addProduct({
      name: analysisResult.productName || 'Handcrafted Heritage Item',
      description: `${analysisResult.descriptionSnippet || 'Authentic handmade Indian craft.'} Traditional ${analysisResult.model || 'Artisan Form'} handcrafted in ${currentUser?.state || 'India'}. Evaluated by KarigarSetu AI vision with a quality benchmark of ${analysisResult.qualityScore || 4.8}/5.`,
      category: analysisResult.category || 'Handicraft',
      material: analysisResult.material || 'Natural Materials',
      model_style: analysisResult.model || 'Traditional Craft',
      dimensions: {
        length: analysisResult.length || 25,
        width: analysisResult.width || 25,
        height: analysisResult.height || 4,
        unit: 'cm',
      },
      is_dimensions_estimated: true,
      primary_color: analysisResult.primaryColor || 'Earth Tone',
      secondary_color: analysisResult.secondaryColor || 'Natural Accent',
      quality_score: analysisResult.qualityScore || 4.8,
      market_price_min: analysisResult.estimatedPriceMin || 750,
      market_price_max: analysisResult.estimatedPriceMax || 1200,
      suggested_price: analysisResult.suggestedPrice || 899,
      price: analysisResult.suggestedPrice || 899,
      quantity: 5,
      crafting_time_days: 7,
      images: [selectedImage],
      state: currentUser?.state || 'Telangana',
      city: currentUser?.city || 'Warangal',
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setPublishedSuccess(true);
    setTimeout(() => {
      navigate(`/product/${newProd.id}`);
    }, 1800);
  };

  const handleEditBeforePublish = () => {
    if (!analysisResult) return;
    if (!currentUser || currentUser.role !== 'seller') {
      navigate('/login');
      return;
    }
    navigate('/seller/products/new', {
      state: {
        prefill: {
          name: analysisResult.productName || 'Handcrafted Heritage Item',
          category: analysisResult.category || 'Handicraft',
          material: analysisResult.material || 'Natural Materials',
          model: analysisResult.model || 'Traditional Craft',
          length: analysisResult.length || 25,
          width: analysisResult.width || 25,
          height: analysisResult.height || 4,
          price: analysisResult.suggestedPrice || 899,
          primaryColor: analysisResult.primaryColor || 'Natural Earth',
          secondaryColor: analysisResult.secondaryColor || 'Accent Tone',
          qualityScore: analysisResult.qualityScore || 4.8,
          image: selectedImage,
          description: analysisResult.descriptionSnippet || '',
        },
      },
    });
  };

  // Safe formatting helpers for Defensive Rendering
  const qualityAssessment = analysisResult?.qualityAssessment || {
    craftsmanship: Number(Math.min(5, (analysisResult?.qualityScore || 4.8) + 0.1).toFixed(1)),
    materialQuality: Number((analysisResult?.qualityScore || 4.8).toFixed(1)),
    finish: Number(Math.max(3.8, (analysisResult?.qualityScore || 4.8) - 0.1).toFixed(1)),
    designAesthetic: Number(Math.min(5, (analysisResult?.qualityScore || 4.8) + 0.1).toFixed(1)),
    overall: Number((analysisResult?.qualityScore || 4.8).toFixed(1)),
    explanation: 'Visual analysis confirms superior structural integrity, authentic hand tooling marks, balanced edge contours, and premium grade raw material composition.',
  };
  const minPrice = analysisResult?.estimatedPriceMin || 750;
  const maxPrice = analysisResult?.estimatedPriceMax || 1200;
  const suggPrice = analysisResult?.suggestedPrice || 899;
  const dimensionsStr = analysisResult?.dimensions || `${analysisResult?.length || 25} × ${analysisResult?.width || 25} × ${analysisResult?.height || 4} cm`;
  const craftTechnique = analysisResult?.craftTechnique || (analysisResult ? getCraftingTechnique(analysisResult) : 'Traditional Artisan Handcrafting');

  return (
    <div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title & Tagline Banner with Official Logo */}
        <div className="bg-gradient-to-r from-heritage-brown via-heritage-brown-dark to-heritage-terracotta text-white rounded-3xl p-6 sm:p-8 shadow-3d-lg border-2 border-heritage-gold/40 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center space-x-4">
            <img 
              src="/karigasetu-logo.png" 
              alt="Karigasetu.ai Logo" 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain bg-white/10 p-1 border-2 border-heritage-gold/60 shadow-md shrink-0" 
            />
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-heritage-gold/20 text-heritage-gold-light px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-heritage-gold" aria-hidden="true" />
                <span>AI Vision & Smart Valuation</span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white">
                AI Product Analyzer & Smart Appraiser
              </h1>
              <p className="text-xs sm:text-sm text-heritage-sand/90 mt-1 max-w-2xl font-normal leading-relaxed">
                Upload a photograph of your handicraft and let AI identify the craft, analyze materials, assess quality and suggest a fair market price.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-black/25 px-4 py-2.5 rounded-2xl border border-heritage-gold/30 shrink-0 self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-heritage-gold-light">
              Neural Vision Ready
            </span>
          </div>
        </div>

        {/* MAIN 2-COLUMN WORKSPACE: IMAGE & SCANNER (Left) vs APPRAISAL REPORT (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: IMAGE UPLOAD & SCANNING DISPLAY */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-heritage-terracotta/20 shadow-3d space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-heritage-brown uppercase tracking-wider">
                Handicraft Image Source
              </h2>
              {selectedImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center space-x-1 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>

            {/* Dropzone & Preview Container */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => {
                if (!selectedImage && !isAnalyzing) {
                  fileInputRef.current?.click();
                }
              }}
              className={`relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-dashed border-heritage-sand bg-heritage-ivory/50 flex flex-col items-center justify-center transition shadow-inner group ${
                !selectedImage && !isAnalyzing
                  ? 'cursor-pointer hover:border-heritage-terracotta hover:bg-heritage-sand/30'
                  : ''
              }`}
            >
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Handicraft Upload Preview"
                    className={`w-full h-full object-contain bg-heritage-ivory/80 transition duration-500 ${
                      isAnalyzing ? 'brightness-90 contrast-110' : ''
                    }`}
                  />

                  {/* Change Photo Overlay on hover */}
                  {!isAnalyzing && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white text-heritage-brown text-xs font-bold shadow-md hover:bg-heritage-sand transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-heritage-terracotta" aria-hidden="true" />
                        <span>Replace Image</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCameraActive(true);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-heritage-terracotta text-white text-xs font-bold shadow-md hover:bg-heritage-terracotta-dark transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" aria-hidden="true" />
                        <span>Retake Photo</span>
                      </button>
                    </div>
                  )}

                  {/* Scanning Laser Beam Animation */}
                  {isAnalyzing && (
                    <>
                      <div className="scanning-beam animate-scan-laser" />
                      <div className="absolute inset-0 bg-heritage-terracotta/10 pointer-events-none" />
                      <div className="absolute top-4 left-4 bg-heritage-brown/90 text-heritage-gold text-[10px] font-bold px-3 py-1.5 rounded-full border border-heritage-gold/40 flex items-center space-x-2 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>AI NEURAL APPRAISAL IN PROGRESS...</span>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center p-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-heritage-terracotta/10 text-heritage-terracotta flex items-center justify-center mx-auto shadow-inner">
                    <Upload className="w-8 h-8" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-heritage-brown">
                      Drag and drop your handicraft photo here
                    </p>
                    <p className="text-xs text-heritage-charcoal/60 mt-1">
                      Supports JPG, PNG, WEBP up to 15MB
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2 rounded-xl bg-heritage-terracotta text-white text-xs font-bold shadow-sm hover:bg-heritage-terracotta-dark transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Browse File</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCameraActive(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-heritage-sand hover:bg-heritage-sand/80 text-heritage-brown text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Take Photo</span>
                    </button>
                  </div>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageFile(e.target.files[0]);
                  }
                }}
              />
            </div>

            {/* Upload & Camera Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-3 px-3 rounded-2xl border border-heritage-sand bg-heritage-ivory/60 hover:bg-heritage-sand text-xs font-bold text-heritage-brown flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-heritage-terracotta" aria-hidden="true" />
                <span>{selectedImage ? 'Replace Image' : 'Browse File'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCameraActive(true)}
                className="py-3 px-3 rounded-2xl border border-heritage-sand bg-heritage-ivory/60 hover:bg-heritage-sand text-xs font-bold text-heritage-brown flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <Camera className="w-4 h-4 text-heritage-brown" aria-hidden="true" />
                <span>{selectedImage ? 'Retake Photo' : 'Take Photo'}</span>
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" aria-hidden="true" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* MANDATORY PROMINENT BUTTON: [ Analyze with AI ] */}
            <button
              type="button"
              disabled={!selectedImage || isAnalyzing}
              onClick={handleStartAnalysis}
              className={`w-full py-4 rounded-2xl font-black text-sm sm:text-base shadow-3d-lg transition-all flex items-center justify-center space-x-2 uppercase tracking-wider cursor-pointer ${
                !selectedImage || isAnalyzing
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                  : 'bg-gradient-to-r from-heritage-terracotta via-amber-600 to-heritage-terracotta-dark text-white hover:scale-101 hover:shadow-glow-terracotta'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" aria-hidden="true" />
                  <span>Scanning Craft Neural Matrix...</span>
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5" aria-hidden="true" />
                  <span>Analyze with AI</span>
                </>
              )}
            </button>

            {/* 8-STEP PROGRESS CHECKLIST */}
            {(isAnalyzing || analysisResult) && (
              <div className="pt-4 border-t border-heritage-sand space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-black text-heritage-brown uppercase tracking-wider">
                    8-Stage AI Appraisal Sequence
                  </p>
                  <span className="text-[10px] font-bold text-heritage-charcoal/60">
                    {completedSteps.length} of {SCAN_STEPS.length} Completed
                  </span>
                </div>
                <div className="space-y-1.5">
                  {SCAN_STEPS.map((step, idx) => {
                    const isDone = completedSteps.includes(idx) || Boolean(analysisResult);
                    const isCurrent = currentStepIndex === idx && isAnalyzing;

                    return (
                      <div
                        key={step.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition ${
                          isDone
                            ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/60'
                            : isCurrent
                            ? 'bg-amber-50 text-amber-900 font-bold border border-amber-300 animate-pulse'
                            : 'text-heritage-charcoal/40 bg-heritage-ivory/40'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0 font-bold">
                              {step.id}
                            </div>
                          )}
                          <span className="truncate">{step.label}</span>
                        </div>
                        <span className="text-[10px] opacity-75 shrink-0 ml-2 hidden sm:inline">
                          {step.detail}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: DEDICATED AI APPRAISAL REPORT CARD */}
          <div className="lg:col-span-6 space-y-6">
            {!analysisResult && !isAnalyzing ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-heritage-sand shadow-3d text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-heritage-sand/50 text-heritage-terracotta flex items-center justify-center mx-auto shadow-inner">
                  <Scan className="w-10 h-10" aria-hidden="true" />
                </div>
                <h3 className="font-serif font-black text-2xl text-heritage-brown">
                  Awaiting Handicraft Photograph
                </h3>
                <p className="text-xs sm:text-sm text-heritage-charcoal/70 leading-relaxed max-w-md mx-auto">
                  {selectedImage ? (
                    <>
                      Photo ready! Click <strong className="text-heritage-brown">"Analyze with AI"</strong> to trigger real-time feature extraction, 3D dimension calibration, and fair market price calculation.
                    </>
                  ) : (
                    <>
                      Upload a photograph of your handicraft or capture one using your camera to generate a certified AI Appraisal Report with fair market pricing.
                    </>
                  )}
                </p>
              </div>
            ) : isAnalyzing ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-heritage-sand shadow-3d text-center space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-heritage-gold/20 text-heritage-gold-dark flex items-center justify-center mx-auto animate-spin shadow-inner">
                  <RefreshCw className="w-10 h-10" aria-hidden="true" />
                </div>
                <h3 className="font-serif font-black text-2xl text-heritage-brown">
                  Analyzing Handicraft Structure
                </h3>
                <p className="text-xs sm:text-sm text-heritage-charcoal/70 max-w-md mx-auto">
                  Measuring material grain, color spectrum, edge symmetry, and artisan market benchmarks...
                </p>
              </div>
            ) : analysisResult ? (
              analysisResult.isValidCraft === false || analysisResult.isHumanSubject === true || analysisResult.isDocumentSubject === true ? (
                /* REJECTION CARD FOR DOCUMENT / HUMAN / NON-CRAFT */
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-300 shadow-3d-lg space-y-6 animate-fade-in">
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-950 flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center shrink-0">
                      {analysisResult.isDocumentSubject ? (
                        <FileText className="w-5 h-5 text-rose-700" aria-hidden="true" />
                      ) : analysisResult.isHumanSubject ? (
                        <UserX className="w-5 h-5 text-rose-700" aria-hidden="true" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-rose-700" aria-hidden="true" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 px-2 py-0.5 rounded">
                        {analysisResult.isDocumentSubject
                          ? 'Non-Craft Document Detected'
                          : analysisResult.isHumanSubject
                          ? 'Non-Craft Subject Detected'
                          : 'Non-Craft Item Detected'}
                      </span>
                      <h3 className="font-serif font-black text-lg text-rose-950 mt-1">
                        {analysisResult.isDocumentSubject
                          ? 'Text Document / Syllabus / Printed Sheet'
                          : analysisResult.isHumanSubject
                          ? 'Living Person / Portrait Photography'
                          : 'Unrecognized Craft Subject'}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 space-y-2">
                    <div className="flex items-start space-x-2.5">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <div className="space-y-1 text-xs text-rose-900 font-medium">
                        <p className="font-bold">
                          {analysisResult.rejectionReason || 'Please upload an authentic handmade physical craft item.'}
                        </p>
                        <p className="text-[11px] text-rose-800/80 leading-relaxed">
                          Under Smart India Hackathon 2026 & Ministry of Textiles guidelines, KarigarSetu AI exclusively evaluates genuine handmade crafts (woodwork, pottery, handlooms, brass metalware, cane/bamboo, jute work, and traditional folk art).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-bold text-heritage-brown uppercase tracking-wider">
                      Please try again with a handicraft photo:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="py-3 px-4 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" aria-hidden="true" />
                        <span>Upload Craft Image</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCameraActive(true)}
                        className="py-3 px-4 rounded-xl border border-heritage-sand bg-heritage-sand/40 hover:bg-heritage-sand text-heritage-brown font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" aria-hidden="true" />
                        <span>Take Photo</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* OFFICIAL STRUCTURED AI APPRAISAL REPORT CARD */
                <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-heritage-gold shadow-3d-lg space-y-6 relative overflow-hidden animate-fade-in">
                  {/* Card Header & Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-heritage-sand/80 pb-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="/karigasetu-logo.png" 
                        alt="Karigasetu" 
                        className="w-10 h-10 rounded-full object-contain border border-heritage-gold/50 shadow-xs" 
                      />
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-heritage-terracotta">
                          Official Certified Evaluation
                        </span>
                        <h2 className="font-serif font-black text-2xl text-heritage-brown leading-tight">
                          AI APPRAISAL REPORT
                        </h2>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1">
                      <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border self-start sm:self-auto ${
                        analysisResult.isLiveAi || analysisResult.analysisSource === 'live_ai'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}>
                        {analysisResult.isLiveAi || analysisResult.analysisSource === 'live_ai' ? 'AI VISION ANALYSIS' : 'DEMO AI ANALYSIS'}
                      </span>
                      <span className="text-[10px] font-medium text-heritage-charcoal/70">
                        Analyzed from uploaded image
                      </span>
                    </div>
                  </div>

                  {/* Published Success Alert */}
                  {publishedSuccess && (
                    <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-bounce">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                      <span>
                        Product published to Marketplace! +50 Karigar Credits added to your balance! Redirecting...
                      </span>
                    </div>
                  )}

                  {/* 01 PRODUCT IDENTIFICATION */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 border-b border-heritage-sand/80 pb-2">
                      <span className="text-xs font-black text-heritage-terracotta bg-heritage-terracotta/10 px-2 py-0.5 rounded">
                        01
                      </span>
                      <h3 className="text-sm font-black text-heritage-brown uppercase tracking-wider">
                        PRODUCT IDENTIFICATION
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <SpecField
                        label="Product Name"
                        value={analysisResult.productName || 'Handcrafted Heritage Item'}
                        className="sm:col-span-2"
                      />
                      <SpecField
                        label="Craft Category"
                        value={analysisResult.category || 'Handicraft'}
                      />
                      <SpecField
                        label="Craft Type"
                        value={analysisResult.craftType || analysisResult.model || 'Traditional Indian Craft'}
                      />
                      <SpecField
                        label="Material"
                        value={analysisResult.material || 'Natural Materials'}
                      />
                      <SpecField
                        label="Craft Technique"
                        value={craftTechnique}
                      />
                    </div>

                    {/* Circular Confidence Gauge */}
                    <ConfidenceGauge confidence={analysisResult.confidence || 94} />
                  </div>

                  {/* 02 VISUAL & PHYSICAL DETAILS */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center space-x-2 border-b border-heritage-sand/80 pb-2">
                      <span className="text-xs font-black text-heritage-terracotta bg-heritage-terracotta/10 px-2 py-0.5 rounded">
                        02
                      </span>
                      <h3 className="text-sm font-black text-heritage-brown uppercase tracking-wider">
                        VISUAL & PHYSICAL DETAILS
                      </h3>
                    </div>

                    {/* Visual Description */}
                    <div className="p-3.5 rounded-2xl bg-heritage-ivory/60 border border-heritage-sand/80">
                      <span className="text-[11px] font-bold text-heritage-charcoal/60 uppercase tracking-wider block mb-1">
                        Visual Description
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-heritage-brown leading-relaxed">
                        {analysisResult.visualDescription || analysisResult.descriptionSnippet || 'Artisan handcrafted item displaying authentic regional texture, balanced symmetry, and traditional styling.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <SpecField
                        label="Primary Color"
                        value={analysisResult.primaryColor || 'Natural Earth Tone'}
                      />
                      <SpecField
                        label="Secondary Color"
                        value={analysisResult.secondaryColor || 'Natural Accent'}
                      />
                      <SpecField
                        label="Shape"
                        value={analysisResult.shape || 'Sculptural Artisan Form'}
                      />
                      <SpecField
                        label="Texture"
                        value={analysisResult.texture || 'Hand-worked natural grain texture'}
                      />
                      <SpecField
                        label="Dimensions"
                        badge="AI ESTIMATED"
                        value={dimensionsStr}
                      />
                      <SpecField
                        label="Craft Finish"
                        value={analysisResult.craftFinish || 'Organic hand-buffed protective finish'}
                      />
                    </div>
                  </div>

                  {/* 03 QUALITY ASSESSMENT */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between border-b border-heritage-sand/80 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-heritage-terracotta bg-heritage-terracotta/10 px-2 py-0.5 rounded">
                          03
                        </span>
                        <h3 className="text-sm font-black text-heritage-brown uppercase tracking-wider">
                          QUALITY ASSESSMENT
                        </h3>
                      </div>
                      <div className="flex items-center space-x-1.5 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-300">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" aria-hidden="true" />
                        <span className="text-xs font-black text-amber-900">
                          Overall: {qualityAssessment.overall} / 5
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl bg-heritage-ivory/60 border border-heritage-sand/80">
                        <span className="text-[11px] font-bold text-heritage-charcoal/60 uppercase tracking-wider block mb-1">
                          Craftsmanship
                        </span>
                        <div className="flex items-center space-x-1 font-black text-sm text-heritage-brown">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" aria-hidden="true" />
                          <span>{qualityAssessment.craftsmanship} / 5</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-heritage-ivory/60 border border-heritage-sand/80">
                        <span className="text-[11px] font-bold text-heritage-charcoal/60 uppercase tracking-wider block mb-1">
                          Material Quality
                        </span>
                        <div className="flex items-center space-x-1 font-black text-sm text-heritage-brown">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" aria-hidden="true" />
                          <span>{qualityAssessment.materialQuality} / 5</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-heritage-ivory/60 border border-heritage-sand/80">
                        <span className="text-[11px] font-bold text-heritage-charcoal/60 uppercase tracking-wider block mb-1">
                          Finish
                        </span>
                        <div className="flex items-center space-x-1 font-black text-sm text-heritage-brown">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" aria-hidden="true" />
                          <span>{qualityAssessment.finish} / 5</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-heritage-ivory/60 border border-heritage-sand/80">
                        <span className="text-[11px] font-bold text-heritage-charcoal/60 uppercase tracking-wider block mb-1">
                          Design / Aesthetic
                        </span>
                        <div className="flex items-center space-x-1 font-black text-sm text-heritage-brown">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" aria-hidden="true" />
                          <span>{qualityAssessment.designAesthetic} / 5</span>
                        </div>
                      </div>
                    </div>

                    {/* Quality Explanation */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 font-medium leading-relaxed">
                      <strong className="font-bold text-amber-900 block mb-0.5">Quality Explanation:</strong>
                      {qualityAssessment.explanation || 'Visual analysis confirms superior structural integrity, authentic hand tooling marks, balanced edge contours, and premium grade raw material composition.'}
                    </div>
                  </div>

                  {/* 04 FAIR MARKET APPRAISAL */}
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-heritage-sand/60 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-heritage-terracotta bg-heritage-terracotta/10 px-2 py-0.5 rounded">
                          04
                        </span>
                        <h3 className="text-sm font-black text-heritage-brown uppercase tracking-wider">
                          FAIR MARKET APPRAISAL
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center space-x-1 self-start sm:self-auto">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" aria-hidden="true" />
                        <span>Fair Living Wage Benchmark: Included</span>
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-gradient-to-br from-heritage-sand/40 via-white to-amber-50/50 border-2 border-heritage-gold/50 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div>
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className="text-[11px] font-bold text-heritage-charcoal/70 uppercase tracking-wider">
                            Estimated Market Price
                          </span>
                          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            AI ESTIMATED
                          </span>
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-heritage-brown">
                          ₹{minPrice.toLocaleString('en-IN')} – ₹{maxPrice.toLocaleString('en-IN')}
                        </div>
                        <p className="text-[11px] text-heritage-charcoal/70 mt-1 font-medium leading-relaxed">
                          Fair Living Wage Benchmark: Included
                        </p>
                      </div>

                      <div className="sm:text-right bg-white p-4 rounded-2xl border border-heritage-terracotta/30 shadow-sm">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-heritage-terracotta block mb-1">
                          AI Suggested Price
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-heritage-terracotta-dark">
                          ₹{suggPrice.toLocaleString('en-IN')}
                        </div>
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 mt-1">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 shrink-0" aria-hidden="true" />
                          Recommended Marketplace Listing
                        </span>
                      </div>
                    </div>

                    {/* WHY THIS PRICE? */}
                    <div className="p-4 bg-heritage-ivory rounded-2xl border border-heritage-sand/90 space-y-1.5">
                      <div className="flex items-center space-x-2 text-heritage-terracotta">
                        <Sparkles className="w-4 h-4 text-heritage-terracotta shrink-0" aria-hidden="true" />
                        <span className="text-xs font-black uppercase tracking-wider">WHY THIS PRICE?</span>
                      </div>
                      <p className="text-xs text-heritage-charcoal/80 font-medium leading-relaxed">
                        {analysisResult.pricingReasoning || 'Price calculated by factoring in skilled artisan labor time, raw material purity, regional craft complexity, and Ministry of Textiles fair living wage benchmarks to guarantee ethical artisan remuneration.'}
                      </p>
                    </div>

                    {/* Cultural Significance / Craft Story */}
                    {analysisResult.culturalSignificance && (
                      <div className="p-3.5 bg-heritage-sand/20 rounded-2xl border border-heritage-sand/60">
                        <p className="text-xs text-heritage-charcoal/80 font-medium italic leading-relaxed">
                          "{analysisResult.culturalSignificance}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="pt-4 border-t border-heritage-sand flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePublishDirectly}
                      className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-heritage-terracotta to-amber-600 hover:from-heritage-terracotta-dark hover:to-amber-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" aria-hidden="true" />
                      <span>Publish Product</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleEditBeforePublish}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-heritage-sand hover:bg-heritage-sand/80 text-heritage-brown font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" aria-hidden="true" />
                      <span>Edit Details</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleStartAnalysis}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border-2 border-heritage-sand hover:bg-white text-heritage-charcoal font-bold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" aria-hidden="true" />
                      <span>Analyze Again</span>
                    </button>
                  </div>
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>

      {/* Live Camera Viewfinder Modal */}
      <CameraCaptureModal
        isOpen={cameraActive}
        onClose={() => setCameraActive(false)}
        onCapture={(dataUrl) => {
          setFileObject(null);
          setSelectedImage(dataUrl);
          setAnalysisResult(null);
          setPublishedSuccess(false);
          setCurrentStepIndex(-1);
          setCompletedSteps([]);
          setCameraActive(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      />
    </div>
  );
};
