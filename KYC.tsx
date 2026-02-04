
import React, { useState, useRef } from 'react';
import { User, KYCStatus } from '../types';

interface Props {
  user: User;
  onComplete: (status: KYCStatus) => void;
}

const KYC: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [panSelected, setPanSelected] = useState(false);
  const [aadhaarSelected, setAadhaarSelected] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera permission denied or not available.");
      setIsCameraOpen(false);
    }
  };

  const takeSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setCapturedImage(dataUrl);
        
        // Stop the stream
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        setIsCameraOpen(false);
      }
    }
  };

  const handleFinalSubmit = () => {
    alert("Selfie Saved! Your KYC status is now APPROVED.");
    onComplete(KYCStatus.APPROVED);
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-white pb-20">
      <div className="space-y-1">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">KYC Verification</h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Complete steps to unlock limits</p>
      </div>

      <div className="flex justify-between items-center px-4">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex flex-col items-center space-y-2">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm transition-all ${
              step >= s ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-slate-50 text-slate-300'
            }`}>
              {s === 1 ? '🪪' : s === 2 ? '💳' : '📸'}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${step >= s ? 'text-indigo-600' : 'text-slate-300'}`}>
              {s === 1 ? 'Aadhaar' : s === 2 ? 'PAN' : 'Selfie'}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-[2.5rem] p-10 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden min-h-[400px]">
        {step === 1 && (
          <>
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-5xl shadow-sm border border-slate-100">🪪</div>
            <div className="space-y-2">
              <p className="font-black text-slate-900 text-lg">Aadhaar Card</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                {aadhaarSelected ? '✅ File selected successfully' : 'Front & Back Photo Required'}
              </p>
            </div>
            <input type="file" className="hidden" id="aadhaar" accept="image/*" onChange={() => setAadhaarSelected(true)} />
            <label htmlFor="aadhaar" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer shadow-xl shadow-indigo-100 active:scale-95 transition-all">
              {aadhaarSelected ? 'Change File' : 'Upload Aadhaar'}
            </label>
          </>
        )}
        
        {step === 2 && (
          <>
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-5xl shadow-sm border border-slate-100">💳</div>
            <div className="space-y-2">
              <p className="font-black text-slate-900 text-lg">PAN Card</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                {panSelected ? '✅ PAN Card selected' : 'Upload a clear horizontal photo'}
              </p>
            </div>
            <input type="file" className="hidden" id="pan" accept="image/*" onChange={() => setPanSelected(true)} />
            <label htmlFor="pan" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer shadow-xl shadow-indigo-100 active:scale-95 transition-all">
              {panSelected ? 'Change PAN File' : 'Select PAN Card'}
            </label>
          </>
        )}

        {step === 3 && (
          <div className="w-full flex flex-col items-center space-y-6">
            {!isCameraOpen && !capturedImage && (
              <>
                <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-5xl shadow-sm border border-slate-100">🤳</div>
                <div className="space-y-2">
                  <p className="font-black text-slate-900 text-lg">Take a Selfie</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Look directly into the camera</p>
                </div>
                <button 
                  onClick={startCamera}
                  className="bg-indigo-600 text-white px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center space-x-3 shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                >
                  <span className="text-2xl">📷</span>
                  <span>Open Camera</span>
                </button>
              </>
            )}
            
            {isCameraOpen && (
              <div className="relative w-full aspect-square bg-black rounded-[2rem] overflow-hidden shadow-2xl">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <button 
                  onClick={takeSelfie}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-white border-8 border-indigo-600/20 rounded-full flex items-center justify-center text-3xl shadow-xl active:scale-90 transition-all"
                >
                  📸
                </button>
              </div>
            )}

            {capturedImage && (
              <div className="space-y-6 w-full flex flex-col items-center">
                <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-emerald-500">
                  <img src={capturedImage} className="w-full h-full object-cover" alt="Selfie" />
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">✓ Ready</div>
                </div>
                <button 
                  onClick={() => { setCapturedImage(null); startCamera(); }}
                  className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-indigo-600"
                >
                  Retake Selfie
                </button>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
      </div>

      <div className="pt-4">
        {step < 3 ? (
          <button 
            onClick={() => setStep(step + 1)}
            disabled={(step === 1 && !aadhaarSelected) || (step === 2 && !panSelected)}
            className={`w-full py-5 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl transition-all active:scale-95 ${
              (step === 1 && aadhaarSelected) || (step === 2 && panSelected)
                ? 'bg-slate-900 text-white shadow-slate-200' 
                : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
            }`}
          >
            Confirm & Next
          </button>
        ) : (
          <button 
            disabled={!capturedImage}
            onClick={handleFinalSubmit}
            className={`w-full py-5 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl transition-all active:scale-95 ${
              capturedImage ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
            }`}
          >
            Save & Complete KYC
          </button>
        )}
      </div>
    </div>
  );
};

export default KYC;
