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
  TrendingUp, 
  Check, 
  Star, 
  Layers, 
  IndianRupee, 
  ArrowRight,
  RefreshCw,
  Edit3,
  Send,
  Info,
  UserX,
  AlertTriangle,
  ShieldAlert,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { analyzeProductImage, SCAN_STEPS, CRAFT_APPRAISAL_TEMPLATES } from '../../services/aiService';
import { MOCK_AI_PRESETS } from '../../data/seedData';
import { AIAnalysisResult } from '../../types';
import { CameraCaptureModal } from '../../components/common/CameraCaptureModal';

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

  const handleSelectPreset = (preset: typeof MOCK_AI_PRESETS[0]) => {
    setSelectedImage(preset.image);
    setFileObject(null);
    setAnalysisResult(null);
    setPublishedSuccess(false);
    setCurrentStepIndex(-1);
    setCompletedSteps([]);
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
      // Fallback
      setAnalysisResult(MOCK_AI_PRESETS[0].analysis);
      setIsMockResult(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePublishDirectly = () => {
    if (!analysisResult || !selectedImage) return;

    const newProd = addProduct({
      name: analysisResult.productName,
      description: `${analysisResult.descriptionSnippet} Traditional ${analysisResult.model} handcrafted in ${currentUser?.state || 'India'}. Evaluated by KarigarSetu AI vision with a quality benchmark of ${analysisResult.qualityScore}/5.`,
      category: analysisResult.category,
      material: analysisResult.material,
      model_style: analysisResult.model,
      dimensions: {
        length: analysisResult.length,
        width: analysisResult.width,
        height: analysisResult.height,
        unit: 'cm',
      },
      is_dimensions_estimated: true,
      primary_color: analysisResult.primaryColor,
      secondary_color: analysisResult.secondaryColor,
      quality_score: analysisResult.qualityScore,
      market_price_min: analysisResult.estimatedPriceMin,
      market_price_max: analysisResult.estimatedPriceMax,
      suggested_price: analysisResult.suggestedPrice,
      price: analysisResult.suggestedPrice,
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
    // Pass state to AddProductPage
    navigate('/seller/products/new', {
      state: {
        prefill: {
          name: analysisResult.productName,
          category: analysisResult.category,
          material: analysisResult.material,
          model: analysisResult.model,
          length: analysisResult.length,
          width: analysisResult.width,
          height: analysisResult.height,
          price: analysisResult.suggestedPrice,
          primaryColor: analysisResult.primaryColor,
          secondaryColor: analysisResult.secondaryColor,
          qualityScore: analysisResult.qualityScore,
          image: selectedImage,
          description: analysisResult.descriptionSnippet,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-heritage-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title & Tagline Banner */}
        <div className="bg-gradient-to-r from-heritage-brown via-heritage-brown-dark to-heritage-terracotta text-white rounded-3xl p-6 sm:p-8 shadow-3d-lg border-2 border-heritage-gold/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-heritage-gold/20 text-heritage-gold-light px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-heritage-gold" />
              <span>SIH 2026 Core Innovation Engine</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-white">
              AI Product Analyzer & Smart Appraiser
            </h1>
            <p className="text-xs sm:text-sm text-heritage-sand/80 mt-1 max-w-2xl font-medium leading-relaxed">
              Upload any raw photograph of your handicraft. Our computer vision model identifies traditional forms, detects natural materials, calculates 3D dimensions, and recommends fair living market prices.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-black/20 p-3 rounded-2xl border border-heritage-gold/30">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold text-heritage-gold-light">
              Neural Vision Ready
            </span>
          </div>
        </div>

        {/* MAIN 2-COLUMN WORKSPACE: IMAGE & SCANNER (Left) vs 3D RESULT CARD (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: IMAGE UPLOAD & SCANNING DISPLAY */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-heritage-terracotta/20 shadow-3d">
            <h2 className="text-sm font-bold text-heritage-brown uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Handicraft Image Source</span>
              {selectedImage && (
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setCameraActive(true)}
                    className="text-xs text-heritage-terracotta hover:underline flex items-center font-bold"
                  >
                    <Camera className="w-3.5 h-3.5 mr-1" />
                    Retake Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setFileObject(null);
                      setAnalysisResult(null);
                      setCurrentStepIndex(-1);
                      setCompletedSteps([]);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="text-xs text-red-600 hover:underline flex items-center"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Remove
                  </button>
                </div>
              )}
            </h2>

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
                    alt="Handicraft Preview"
                    className={`w-full h-full object-cover transition duration-500 ${
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
                        className="px-3.5 py-2 rounded-xl bg-white text-heritage-brown text-xs font-bold shadow hover:bg-heritage-sand transition flex items-center space-x-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-heritage-terracotta" />
                        <span>Change Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCameraActive(true);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-heritage-terracotta text-white text-xs font-bold shadow hover:bg-heritage-terracotta-dark transition flex items-center space-x-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Retake</span>
                      </button>
                    </div>
                  )}

                  {/* SECTION 15 & 34: SCANNING LASER BEAM ANIMATION */}
                  {isAnalyzing && (
                    <>
                      <div className="scanning-beam animate-scan-laser" />
                      <div className="absolute inset-0 bg-heritage-terracotta/10 pointer-events-none" />
                      <div className="absolute top-4 left-4 bg-heritage-brown/90 text-heritage-gold text-[10px] font-bold px-3 py-1 rounded-full border border-heritage-gold/40 flex items-center space-x-1.5 shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>AI NEURAL APPRAISAL IN PROGRESS...</span>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-center p-8 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-heritage-terracotta/10 text-heritage-terracotta flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-heritage-brown">
                      Drag and drop your handicraft photo here
                    </p>
                    <p className="text-xs text-heritage-charcoal/60 mt-1">
                      Supports JPG, PNG, WEBP up to 10MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 rounded-xl bg-heritage-terracotta text-white text-xs font-bold shadow-sm hover:bg-heritage-terracotta-dark transition"
                  >
                    Browse Local File
                  </button>
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

            {/* Image Action Buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2.5 px-3 rounded-xl border border-heritage-sand bg-heritage-ivory/60 hover:bg-heritage-sand text-xs font-bold text-heritage-brown flex items-center justify-center space-x-1.5 transition"
              >
                <Upload className="w-4 h-4 text-heritage-terracotta" />
                <span>Upload From Device</span>
              </button>

              <button
                type="button"
                onClick={() => setCameraActive(true)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-heritage-sand bg-heritage-ivory/60 hover:bg-heritage-sand text-xs font-bold text-heritage-brown flex items-center justify-center space-x-1.5 transition"
              >
                <Camera className="w-4 h-4 text-heritage-brown" />
                <span>Capture with Camera</span>
              </button>
            </div>

            {uploadError && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* SECTION 46 & QUICK SAMPLES: Judge Presets - Added after Image Source Upload / Capture */}
            <div className="mt-4 pt-4 border-t border-heritage-sand">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-heritage-brown uppercase tracking-wider flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-heritage-terracotta" />
                  Select A Sample Craft Image to Test Instantly:
                </p>
                {selectedImage && (
                  <span className="text-[10px] text-heritage-charcoal/60 font-medium">
                    Click to switch sample
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {MOCK_AI_PRESETS.map((p, idx) => {
                  const isSelected = selectedImage === p.image;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition ${
                        isSelected
                          ? 'border-heritage-terracotta bg-heritage-terracotta/10 ring-1 ring-heritage-terracotta shadow-xs'
                          : 'border-heritage-sand bg-heritage-ivory/40 hover:bg-heritage-sand/60'
                      }`}
                    >
                      <img
                        src={p.image}
                        alt={p.label}
                        className="w-7 h-7 rounded-lg object-cover shrink-0"
                      />
                      <span className="text-[10px] font-bold text-heritage-brown truncate">
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MANDATORY SECTION 13: BIG MAIN BUTTON */}
            <button
              type="button"
              disabled={!selectedImage || isAnalyzing}
              onClick={handleStartAnalysis}
              className={`w-full mt-5 py-4 rounded-2xl font-black text-base shadow-3d-lg transition-all flex items-center justify-center space-x-2 uppercase tracking-wider ${
                !selectedImage || isAnalyzing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-heritage-terracotta via-amber-600 to-heritage-terracotta-dark text-white hover:scale-101 hover:shadow-glow-terracotta'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Scanning Craft Matrix...</span>
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5" />
                  <span>Analyze Product with AI</span>
                </>
              )}
            </button>

            {/* SECTION 15: PROGRESS CHECKLIST */}
            {(isAnalyzing || analysisResult) && (
              <div className="mt-6 pt-5 border-t border-heritage-sand space-y-2">
                <p className="text-xs font-bold text-heritage-brown uppercase tracking-wider mb-2">
                  Appraisal Diagnostic Steps:
                </p>
                <div className="space-y-1.5">
                  {SCAN_STEPS.map((step, idx) => {
                    const isDone = completedSteps.includes(idx);
                    const isCurrent = currentStepIndex === idx && isAnalyzing;

                    return (
                      <div
                        key={step.id}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs transition ${
                          isDone
                            ? 'bg-emerald-50 text-emerald-900 font-semibold'
                            : isCurrent
                            ? 'bg-amber-50 text-amber-900 font-bold border border-amber-300 animate-pulse'
                            : 'text-heritage-charcoal/40 bg-heritage-ivory/30'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                              {step.id}
                            </div>
                          )}
                          <span>{step.label}</span>
                        </div>
                        <span className="text-[10px] opacity-75">{step.detail}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: 3D RESULT UI CARDS (Section 16) */}
          <div className="lg:col-span-6 space-y-6">
            {!analysisResult && !isAnalyzing ? (
              <div className="bg-white rounded-3xl p-8 border border-heritage-sand shadow-3d text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-heritage-sand/60 text-heritage-terracotta flex items-center justify-center mx-auto">
                  <Scan className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-black text-2xl text-heritage-brown">
                  Awaiting Craft Scan
                </h3>
                <p className="text-xs text-heritage-charcoal/70 leading-relaxed max-w-md mx-auto">
                  {selectedImage ? (
                    <>
                      Click <strong>"Analyze Product with AI"</strong> to trigger real-time feature extraction. The model will calculate dimensions, authentic craft categorization, quality metrics, and fair market pricing.
                    </>
                  ) : (
                    <>
                      Upload a handicraft photo, capture using your camera, or select a sample craft on the left to begin AI vision analysis and fair market appraisal.
                    </>
                  )}
                </p>
              </div>
            ) : isAnalyzing ? (
              <div className="bg-white rounded-3xl p-8 border border-heritage-sand shadow-3d text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-heritage-gold/20 text-heritage-gold-dark flex items-center justify-center mx-auto animate-spin">
                  <RefreshCw className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-black text-2xl text-heritage-brown">
                  Analyzing Handicraft Structure
                </h3>
                <p className="text-xs text-heritage-charcoal/70">
                  Measuring material grain, color spectrum, symmetry, and market benchmarks...
                </p>
              </div>
            ) : analysisResult ? (
              analysisResult.isValidCraft === false || analysisResult.isHumanSubject === true || analysisResult.isDocumentSubject === true ? (
                /* REJECTION CARD FOR DOCUMENT / HUMAN / NON-CRAFT */
                <div className="card-3d bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-300 shadow-3d-lg space-y-6 relative overflow-hidden animate-fade-in">
                  {/* Notice banner */}
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center shrink-0">
                        {analysisResult.isDocumentSubject ? (
                          <FileText className="w-5 h-5 text-rose-700" />
                        ) : analysisResult.isHumanSubject ? (
                          <UserX className="w-5 h-5 text-rose-700" />
                        ) : (
                          <ShieldAlert className="w-5 h-5 text-rose-700" />
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
                        <h3 className="font-serif font-black text-lg text-rose-950 mt-0.5">
                          {analysisResult.isDocumentSubject
                            ? 'Text Document / Syllabus / Printed Sheet'
                            : analysisResult.isHumanSubject
                            ? 'Living Person / Human Portrait'
                            : 'Unrecognized Craft Subject'}
                        </h3>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
                      Confidence: {analysisResult.confidence}%
                    </span>
                  </div>

                  {/* Explanation & Compliance */}
                  <div className="p-5 bg-gradient-to-r from-rose-50/50 to-heritage-ivory rounded-2xl border border-rose-200 space-y-2">
                    <div className="flex items-start space-x-2.5">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-rose-900">
                          {analysisResult.rejectionReason || 
                            (analysisResult.isDocumentSubject
                              ? 'The AI detected a text document, syllabus, or printed sheet instead of an authentic handicraft.'
                              : analysisResult.isHumanSubject
                              ? 'The AI detected a human portrait photo rather than an authentic Indian handicraft.'
                              : 'The uploaded item does not match any recognized Indian handicraft category.')}
                        </p>
                        <p className="text-[11px] text-heritage-charcoal/80 leading-relaxed">
                          {analysisResult.isDocumentSubject
                            ? 'Under Smart India Hackathon 2026 & Ministry of Textiles guidelines, KarigarSetu AI exclusively evaluates genuine handmade crafts (wood carvings, terracotta pottery, handloom textiles, brass metalcraft, cane/bamboo, jute work, and folk art). Text documents, syllabus pages, assignments, or PDF prints cannot be appraised, priced, or listed for sale on the marketplace.'
                            : 'Under Smart India Hackathon 2026 & Ministry of Textiles guidelines, KarigarSetu AI exclusively evaluates genuine handmade crafts (wood carvings, terracotta pottery, handloom textiles, brass metalcraft, cane/bamboo, jute work, and folk art). Living human subjects cannot be appraised or listed for sale as marketplace products.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions to recover */}
                  <div className="space-y-3 pt-1">
                    <h4 className="text-xs font-bold text-heritage-brown uppercase tracking-wider">
                      Please upload a handicraft photo instead:
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCameraActive(true)}
                        className="py-3.5 px-4 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Take Photo of Handicraft</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="py-3.5 px-4 rounded-xl border border-heritage-sand bg-heritage-sand/40 hover:bg-heritage-sand text-heritage-brown font-bold text-xs transition flex items-center justify-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload Craft Image File</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Preset Samples of Real Crafts */}
                  <div className="pt-3 border-t border-heritage-sand space-y-2">
                    <span className="text-[11px] font-bold text-heritage-charcoal/70 block">
                      Or test with genuine Indian handicraft samples:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {MOCK_AI_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPreset(p)}
                          className="text-[10px] font-bold px-3 py-1.5 rounded-xl border border-heritage-sand bg-white hover:border-heritage-terracotta text-heritage-brown transition flex items-center space-x-1 shadow-xs"
                        >
                          <span>{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* SECTION 16: FULL 3D RESULT CARD */
                <div className="card-3d bg-white rounded-3xl p-6 sm:p-8 border-2 border-heritage-gold shadow-3d-lg space-y-6 relative overflow-hidden">
                {/* Subtle Non-Blocking AI Mode Badge */}
                <div className="p-3 bg-gradient-to-r from-amber-50/80 to-heritage-ivory border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-heritage-brown">
                          {isMockResult ? 'Demo AI Analysis' : 'AI Analysis'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isMockResult 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}>
                          {isMockResult ? 'Smart Local Engine' : 'Live Neural Vision'}
                        </span>
                      </div>
                      <p className="text-[11px] text-heritage-charcoal/70 mt-0.5">
                        {isMockResult 
                          ? 'AI-generated estimates are for demonstration purposes.' 
                          : 'Live neural craft appraisal verified with multimodal visual features.'}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center space-x-1 text-[11px] font-medium text-heritage-charcoal/60 bg-white/80 px-2.5 py-1 rounded-xl border border-heritage-sand/60 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                    <span>Active & Verified</span>
                  </div>
                </div>

                {/* Published Success Alert */}
                {publishedSuccess && (
                  <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-bounce">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <span>
                      Product published to Marketplace! +50 Karigar Credits added to your balance! Redirecting...
                    </span>
                  </div>
                )}

                {/* Craft Category Fine-Tuning Bar (Instant Correction) */}
                <div className="p-3 bg-heritage-sand/30 rounded-2xl border border-heritage-sand space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-[11px] font-bold text-heritage-brown flex items-center space-x-1">
                      <span>🎨 Identified Craft:</span>
                      <strong className="text-heritage-terracotta ml-1">{analysisResult.category}</strong>
                    </span>
                    <span className="text-[10px] text-heritage-charcoal/60 font-semibold">
                      One-click craft fine-tuning:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(CRAFT_APPRAISAL_TEMPLATES).map(([key, item]) => {
                      const isSelected = 
                        analysisResult.category === item.analysis.category && 
                        analysisResult.productName === item.analysis.productName;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setAnalysisResult(item.analysis)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-xl transition flex items-center space-x-1 border ${
                            isSelected
                              ? 'bg-heritage-terracotta text-white border-heritage-terracotta shadow-xs'
                              : 'bg-white text-heritage-brown hover:bg-heritage-sand/60 border-heritage-sand'
                          }`}
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Card Header & Confidence Gauge */}
                <div className="flex items-start justify-between border-b border-heritage-sand pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-heritage-terracotta uppercase tracking-wider">
                      AI Verified Specification
                    </span>
                    <h2 className="font-serif font-black text-2xl text-heritage-brown mt-0.5">
                      {analysisResult.productName}
                    </h2>
                    <p className="text-xs text-heritage-charcoal/70 mt-1 italic">
                      {analysisResult.culturalSignificance}
                    </p>
                  </div>

                  <div className="text-right shrink-0 bg-heritage-gold/15 p-2.5 rounded-2xl border border-heritage-gold/30">
                    <span className="text-[10px] font-bold text-heritage-brown-dark block">
                      AI Confidence
                    </span>
                    <span className="text-xl font-black text-heritage-terracotta">
                      {analysisResult.confidence}%
                    </span>
                  </div>
                </div>

                {/* Technical Specifications Grid (Section 16 items) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
                  {/* CATEGORY */}
                  <div className="p-3 rounded-xl bg-heritage-sand/40 border border-heritage-sand">
                    <span className="text-[10px] text-heritage-charcoal/60 font-semibold block uppercase">
                      Category
                    </span>
                    <span className="font-bold text-heritage-brown mt-0.5 block">
                      {analysisResult.category}
                    </span>
                  </div>

                  {/* MATERIAL */}
                  <div className="p-3 rounded-xl bg-heritage-sand/40 border border-heritage-sand">
                    <span className="text-[10px] text-heritage-charcoal/60 font-semibold block uppercase">
                      Material
                    </span>
                    <span className="font-bold text-heritage-brown mt-0.5 block">
                      {analysisResult.material}
                    </span>
                  </div>

                  {/* MODEL / STYLE */}
                  <div className="p-3 rounded-xl bg-heritage-sand/40 border border-heritage-sand">
                    <span className="text-[10px] text-heritage-charcoal/60 font-semibold block uppercase">
                      Model / Style
                    </span>
                    <span className="font-bold text-heritage-brown mt-0.5 block truncate">
                      {analysisResult.model}
                    </span>
                  </div>

                  {/* COLOR */}
                  <div className="p-3 rounded-xl bg-heritage-sand/40 border border-heritage-sand">
                    <span className="text-[10px] text-heritage-charcoal/60 font-semibold block uppercase">
                      Colors
                    </span>
                    <span className="font-bold text-heritage-brown mt-0.5 block truncate">
                      {analysisResult.primaryColor}
                    </span>
                  </div>

                  {/* DIMENSIONS (Section 14: Labeled as AI Estimated) */}
                  <div className="p-3 rounded-xl bg-heritage-sand/40 border border-heritage-sand">
                    <span className="text-[10px] text-emerald-800 font-bold block uppercase flex items-center">
                      Dimensions <span className="ml-1 text-[9px] font-normal text-heritage-charcoal/60">(AI Estimated)</span>
                    </span>
                    <span className="font-bold text-heritage-brown mt-0.5 block">
                      {analysisResult.dimensions}
                    </span>
                  </div>

                  {/* QUALITY SCORE */}
                  <div className="p-3 rounded-xl bg-heritage-sand/40 border border-heritage-sand">
                    <span className="text-[10px] text-heritage-charcoal/60 font-semibold block uppercase">
                      Quality Score
                    </span>
                    <span className="font-bold text-amber-700 mt-0.5 block flex items-center">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                      {analysisResult.qualityScore} / 5
                    </span>
                  </div>
                </div>

                {/* PRICING ESTIMATION CARDS */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-heritage-sand/70 via-heritage-ivory to-heritage-sand/70 border border-heritage-gold/50 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <span className="text-[10px] text-emerald-800 font-bold uppercase block flex items-center">
                      Market Price <span className="ml-1 text-[9px] font-normal text-heritage-charcoal/60">(AI Estimated)</span>
                    </span>
                    <span className="text-base font-extrabold text-heritage-charcoal">
                      ₹{analysisResult.estimatedPriceMin.toLocaleString('en-IN')} – ₹{analysisResult.estimatedPriceMax.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-heritage-charcoal/60 block mt-0.5">
                      Fair living wage benchmark
                    </span>
                  </div>

                  <div className="sm:text-right bg-white p-3 rounded-xl border border-heritage-terracotta/30 shadow-sm">
                    <span className="text-[10px] font-bold uppercase text-heritage-terracotta block">
                      AI Suggested Price
                    </span>
                    <span className="text-2xl font-black text-heritage-terracotta-dark">
                      ₹{analysisResult.suggestedPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Legal / AI disclaimer */}
                <div className="p-3 bg-heritage-sand/20 rounded-xl border border-heritage-sand/50">
                  <p className="text-xs text-heritage-charcoal/80 font-medium leading-relaxed">
                    * Note: AI estimates are suggestions, not guarantees. Artisans may customize and adjust all specifications prior to final publishing.
                  </p>
                </div>

                {/* ACTION BUTTONS (Section 16: Edit Details, Publish Product, Analyze Again) */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePublishDirectly}
                    className="w-full sm:flex-1 py-3.5 rounded-xl bg-heritage-terracotta hover:bg-heritage-terracotta-dark text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-1.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publish Product (+50 Credits)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleEditBeforePublish}
                    className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-heritage-sand hover:bg-heritage-sand/80 text-heritage-brown font-bold text-xs transition flex items-center justify-center space-x-1.5"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleStartAnalysis}
                    className="w-full sm:w-auto px-4 py-3.5 rounded-xl border border-heritage-sand hover:bg-white text-heritage-charcoal font-bold text-xs transition flex items-center justify-center space-x-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
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
