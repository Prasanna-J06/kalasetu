
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { parseAudioListing, generateProductImage } from '../services/geminiService';

interface ProductListingFormProps {
  onClose: () => void;
  onSave: (p: Product) => void;
}

const ProductListingForm: React.FC<ProductListingFormProps> = ({ onClose, onSave }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [processStep, setProcessStep] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied. Please allow permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleAutoFill = async () => {
    if (!audioBlob) return;
    setIsProcessing(true);
    setProcessStep('Connecting to Heritage AI...');
    
    try {
      const audioBase64 = await blobToBase64(audioBlob);
      setProcessStep('Decoding Voice & Researching...');
      
      const parsed = await parseAudioListing(audioBase64, image || undefined);
      
      let finalImage = image;
      if (!image) {
        setProcessStep('Generating Smart Visual...');
        setIsGeneratingImage(true);
        finalImage = await generateProductImage(parsed.name, parsed.story, parsed.category);
        setIsGeneratingImage(false);
      }

      const newProduct: Product = {
        id: Date.now().toString(),
        name: parsed.name,
        category: parsed.category || 'Handicraft',
        price: parsed.price,
        description: parsed.description,
        artisanName: 'Amit the Artisan',
        location: 'Karnataka, India',
        imageUrl: finalImage || 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=400',
        story: parsed.story,
        groundingSources: parsed.sources,
        createdAt: Date.now()
      };
      onSave(newProduct);
    } catch (err) {
      console.error(err);
      alert("Failed to process voice. Please try speaking clearly.");
    } finally {
      setIsProcessing(false);
      setProcessStep('');
    }
  };

  return (
    <div className="p-6 bg-[#FDFBF7] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-[#8B4513]"><i className="fas fa-times"></i></button>
        <h2 className="text-xl font-bold text-[#8B4513]">Smart Voice Listing</h2>
        <div className="w-10"></div>
      </div>

      <div className="space-y-8">
        <div className="text-center relative">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-square bg-white border-2 border-dashed border-[#8B4513]/20 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-sm hover:border-[#8B4513] transition-colors ${isGeneratingImage ? 'opacity-50' : ''}`}
          >
            {image ? (
              <img src={image} className="w-full h-full object-cover animate-in fade-in duration-500" />
            ) : (
              <>
                <div className="bg-orange-50 text-[#8B4513] p-5 rounded-full mb-3 shadow-sm">
                  <i className="fas fa-camera-retro text-2xl"></i>
                </div>
                <p className="text-[#8B4513] font-bold text-sm">Add Product Photo</p>
                <p className="text-[10px] text-[#A0522D] mt-2 italic px-8">Or leave for AI Magic Generation</p>
              </>
            )}
          </div>
          {isGeneratingImage && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm rounded-[2.5rem]">
              <div className="flex space-x-1 mb-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce delay-150"></div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8B4513]">AI Artist Painting...</span>
            </div>
          )}
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
        </div>

        <div className="space-y-4">
          <label className="text-[#8B4513] text-sm font-black uppercase tracking-widest flex items-center">
            <i className="fas fa-microphone-lines mr-2"></i> Describe your work
          </label>
          <div className="relative">
            <button 
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`w-full p-8 rounded-[2rem] flex items-center justify-center space-x-4 transition-all shadow-md active:scale-95 ${isRecording ? 'bg-red-500 text-white' : 'bg-[#8B4513] text-white'}`}
            >
              {isRecording && (
                <div className="absolute inset-0 rounded-[2rem] border-4 border-red-200 animate-ping opacity-25"></div>
              )}
              <i className={`fas ${isRecording ? 'fa-volume-high animate-pulse' : 'fa-microphone'} text-2xl`}></i>
              <span className="font-bold text-lg">{isRecording ? 'Listening...' : 'Hold to Describe'}</span>
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-2 italic">Speak about the name, price, and craft style</p>
          </div>
          
          {audioBlob && !isRecording && (
            <div className="bg-white p-4 rounded-[2rem] border border-orange-100 flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-center text-[#8B4513]">
                <i className="fas fa-check-circle mr-2"></i>
                <span className="text-xs font-bold">Voice Captured</span>
              </div>
              <button onClick={() => setAudioBlob(null)} className="text-red-400 text-xs">Clear</button>
            </div>
          )}
        </div>

        <button 
          onClick={handleAutoFill}
          disabled={!audioBlob || isProcessing}
          className="w-full bg-[#E67E22] text-white py-6 rounded-[2.5rem] font-bold text-xl shadow-[0_15px_30px_rgba(230,126,34,0.3)] disabled:opacity-50 flex flex-col items-center justify-center transition-all"
        >
          {isProcessing ? (
            <>
              <i className="fas fa-circle-notch fa-spin mb-2"></i>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{processStep}</span>
            </>
          ) : (
            <div className="flex items-center">
              <i className="fas fa-wand-magic-sparkles mr-3"></i>
              <span>Process with Gemini AI</span>
            </div>
          )}
        </button>

        <div className="flex items-center justify-center space-x-2 opacity-40">
           <i className="fab fa-google text-[10px]"></i>
           <p className="text-[9px] font-black uppercase tracking-[0.3em]">Powered by Google GenAI 2.5</p>
        </div>
      </div>
    </div>
  );
};

export default ProductListingForm;
