
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

// Base64 Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    setIsActive(true);
    setIsThinking(true);
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    audioContextRef.current = inputAudioContext;
    outputAudioContextRef.current = outputAudioContext;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          setIsThinking(false);
          const source = inputAudioContext.createMediaStreamSource(stream);
          const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
          
          scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) {
              int16[i] = inputData[i] * 32768;
            }
            const pcmBlob = {
              data: encode(new Uint8Array(int16.buffer)),
              mimeType: 'audio/pcm;rate=16000',
            };
            
            sessionPromiseRef.current?.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };

          source.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContext.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          if (message.serverContent?.outputTranscription) {
            setTranscription(prev => prev + ' ' + message.serverContent?.outputTranscription?.text);
          }

          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && outputAudioContext) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }

          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onclose: () => setIsActive(false),
        onerror: (e) => console.error("Live API Error", e)
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
        outputAudioTranscription: {},
        systemInstruction: 'You are Sahayak, KalaSetu’s artisan assistant. You speak warmly and help local and tribal artisans sell their products globally. You can explain how to price items, how to take photos, and share historical facts about their crafts.'
      }
    });

    sessionPromiseRef.current = sessionPromise;
  };

  const stopSession = () => {
    setIsActive(false);
    sessionPromiseRef.current?.then(s => s.close());
    audioContextRef.current?.close();
    outputAudioContextRef.current?.close();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 w-[340px] mb-4 border border-orange-100 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
               <div className="w-8 h-8 bg-[#8B4513] rounded-xl flex items-center justify-center text-white text-xs">
                 <i className="fas fa-sparkles"></i>
               </div>
               <h3 className="font-bold text-[#8B4513]">KalaSetu Sahayak</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 p-2"><i className="fas fa-times"></i></button>
          </div>
          
          <div className="space-y-6">
            <div className="h-[200px] overflow-y-auto bg-orange-50/30 rounded-3xl p-4 border border-orange-50/50">
              {transcription ? (
                <p className="text-[#8B4513] text-sm leading-relaxed">{transcription}</p>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <i className="fas fa-comment-dots text-3xl mb-2 text-[#8B4513]"></i>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#8B4513]">Ready to talk</p>
                </div>
              )}
              {isThinking && <div className="text-[#8B4513] animate-pulse text-xs mt-2 italic">Sahayak is connecting...</div>}
            </div>

            <div className="flex flex-col items-center">
              <button 
                onClick={isActive ? stopSession : startSession}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-all relative ${isActive ? 'bg-red-500 scale-110' : 'bg-[#8B4513]'}`}
              >
                {isActive && (
                   <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></span>
                )}
                <i className={`fas ${isActive ? 'fa-stop' : 'fa-microphone'} text-2xl`}></i>
              </button>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#8B4513] opacity-60">
                {isActive ? 'Live Conversation Active' : 'Tap to Start Voice Session'}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#8B4513] text-white rounded-full shadow-2xl flex items-center justify-center text-2xl active:scale-95 transition-transform"
      >
        <i className={`fas ${isOpen ? 'fa-comment-dots' : 'fa-microphone'}`}></i>
      </button>
    </div>
  );
};

export default VoiceAssistant;
