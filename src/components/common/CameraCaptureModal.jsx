import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, SwitchCamera, AlertCircle, Sparkles, Check, RotateCcw } from 'lucide-react';

export const CameraCaptureModal = ({ isOpen, onClose, onCapture }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileFallbackRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [facingMode, setFacingMode] = useState('environment');
    const [errorMsg, setErrorMsg] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);
    const [capturedPreview, setCapturedPreview] = useState(null);

    // Start camera stream when modal opens
    useEffect(() => {
        if (!isOpen) {
            stopStream();
            setCapturedPreview(null);
            return;
        }
        if (!capturedPreview) {
            startCamera();
        }
        return () => {
            stopStream();
        };
    }, [isOpen, facingMode, capturedPreview]);

    const stopStream = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    };

    const startCamera = async () => {
        stopStream();
        setIsInitializing(true);
        setErrorMsg(null);
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera device API not supported in this browser.');
            }
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                try {
                    await videoRef.current.play();
                }
                catch (playErr) {
                    console.warn('Video play interrupted or delayed:', playErr);
                }
            }
            setIsInitializing(false);
        }
        catch (err) {
            console.warn('Direct WebRTC camera error:', err);
            setIsInitializing(false);
            setErrorMsg(err.name === 'NotAllowedError'
                ? 'Camera access permission was denied. Please allow camera permissions or upload an image file.'
                : 'Unable to access live camera sensor. You can choose a photo from your device below.');
        }
    };

    const handleCaptureFrame = () => {
        if (!videoRef.current)
            return;
        const video = videoRef.current;
        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        // Flip horizontally if front camera ('user')
        if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        stopStream();
        setCapturedPreview(dataUrl);
    };

    const handleConfirmPhoto = () => {
        if (capturedPreview) {
            onCapture(capturedPreview);
            setCapturedPreview(null);
            onClose();
        }
    };

    const handleRetake = () => {
        setCapturedPreview(null);
    };

    const handleSwitchCamera = () => {
        setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    };

    const handleFallbackFile = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result;
                setCapturedPreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen)
        return null;

    return (<div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-heritage-charcoal rounded-3xl overflow-hidden border border-heritage-gold/40 shadow-3d-lg max-w-xl w-full flex flex-col relative text-white">
        {/* Header */}
        <div className="p-4 bg-heritage-brown/90 flex items-center justify-between border-b border-heritage-gold/30">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-heritage-terracotta flex items-center justify-center text-white">
              <Camera className="w-4 h-4"/>
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-heritage-gold-light">
                {capturedPreview ? 'Review Captured Photo' : 'Artisan Live Camera Scanner'}
              </h3>
              <p className="text-[10px] text-heritage-sand/70">
                {capturedPreview ? 'Confirm clarity before running AI analysis' : 'Align handicraft inside the viewfinder'}
              </p>
            </div>
          </div>

          <button onClick={() => {
            stopStream();
            setCapturedPreview(null);
            onClose();
        }} className="p-1.5 rounded-full hover:bg-white/10 text-white/80 transition cursor-pointer">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Viewfinder or Preview View */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {capturedPreview ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img src={capturedPreview} alt="Captured Handicraft" className="w-full h-full object-contain" />
              <div className="absolute top-3 left-3 bg-emerald-700/90 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>Captured Snapshot</span>
              </div>
            </div>
          ) : errorMsg ? (<div className="p-6 text-center space-y-3 max-w-sm">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto"/>
              <p className="text-xs text-heritage-sand/90 font-medium leading-relaxed">
                {errorMsg}
              </p>
              <button type="button" onClick={() => fileFallbackRef.current?.click()} className="px-4 py-2 bg-heritage-terracotta text-white rounded-xl text-xs font-bold shadow-md hover:bg-heritage-terracotta-dark transition cursor-pointer">
                Open Device Camera / File
              </button>
            </div>) : (<>
              <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}/>

              {/* Viewfinder Grid Overlay */}
              <div className="absolute inset-8 border border-white/30 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-l-2 border-heritage-gold absolute top-0 left-0"/>
                <div className="w-8 h-8 border-t-2 border-r-2 border-heritage-gold absolute top-0 right-0"/>
                <div className="w-8 h-8 border-b-2 border-l-2 border-heritage-gold absolute bottom-0 left-0"/>
                <div className="w-8 h-8 border-b-2 border-r-2 border-heritage-gold absolute bottom-0 right-0"/>
                <Sparkles className="w-6 h-6 text-heritage-gold/50 animate-pulse"/>
              </div>

              {isInitializing && (<div className="absolute inset-0 bg-black/60 flex items-center justify-center space-x-2 text-xs font-bold text-heritage-gold-light">
                  <RefreshCw className="w-5 h-5 animate-spin"/>
                  <span>Connecting to Sensor...</span>
                </div>)}
            </>)}

          <canvas ref={canvasRef} className="hidden"/>
          <input type="file" ref={fileFallbackRef} accept="image/*" capture="environment" className="hidden" onChange={handleFallbackFile}/>
        </div>

        {/* Controls Bar */}
        <div className="p-4 bg-heritage-brown/95 border-t border-heritage-gold/20 flex items-center justify-between">
          {capturedPreview ? (
            <div className="w-full flex items-center justify-between space-x-3">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-heritage-sand text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Photo</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-heritage-terracotta to-emerald-600 hover:opacity-95 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Use Photo in Analyzer</span>
              </button>
            </div>
          ) : (
            <>
              <button type="button" onClick={handleSwitchCamera} disabled={Boolean(errorMsg)} className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-heritage-gold-light transition flex items-center space-x-1.5 text-xs font-bold disabled:opacity-50 cursor-pointer">
                <SwitchCamera className="w-4 h-4"/>
                <span className="hidden sm:inline">Flip Lens</span>
              </button>

              {/* Shutter Button */}
              <button type="button" disabled={Boolean(errorMsg) || isInitializing} onClick={handleCaptureFrame} className="w-16 h-16 rounded-full bg-gradient-to-r from-heritage-terracotta to-heritage-gold p-1 shadow-glow-terracotta hover:scale-105 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer" title="Take Photo">
                <div className="w-13 h-13 rounded-full bg-white flex items-center justify-center text-heritage-brown">
                  <Camera className="w-6 h-6 text-heritage-terracotta"/>
                </div>
              </button>

              <button type="button" onClick={() => fileFallbackRef.current?.click()} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-heritage-sand transition cursor-pointer">
                Mobile Camera
              </button>
            </>
          )}
        </div>
      </div>
    </div>);
};
