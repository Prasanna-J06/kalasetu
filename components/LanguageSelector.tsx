
import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  onSelect: (lang: Language) => void;
}

const languages: { code: Language; label: string; native: string }[] = [
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'en', label: 'English', native: 'English' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'as', label: 'Assamese', native: 'অসমীয়া' },
  { code: 'mai', label: 'Maithili', native: 'मैथिली' },
  { code: 'sat', label: 'Santali', native: 'संताली' },
  { code: 'ks', label: 'Kashmiri', native: 'کأشُر' },
  { code: 'ne', label: 'Nepali', native: 'नेपाली' },
  { code: 'kok', label: 'Konkani', native: 'कोंकणी' },
  { code: 'sd', label: 'Sindhi', native: 'سنڌي' },
  { code: 'doi', label: 'Dogri', native: 'डोगरी' },
  { code: 'mni', label: 'Manipuri', native: 'মৈতৈলোন্' },
  { code: 'sa', label: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'brx', label: 'Bodo', native: 'बर’' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#FDFBF7]">
      <div className="sticky top-0 w-full bg-[#FDFBF7]/80 backdrop-blur-md pt-12 pb-6 px-10 z-10 text-center animate-in fade-in slide-in-from-top duration-700">
        <div className="w-16 h-16 bg-[#8B4513] rounded-[1.5rem] mx-auto mb-6 flex items-center justify-center shadow-2xl rotate-3">
           <span className="text-white text-2xl font-black">KS</span>
        </div>
        <h2 className="text-3xl font-black text-[#8B4513] serif mb-2">Welcome</h2>
        <p className="text-[#A0522D] text-xs font-bold uppercase tracking-[0.2em] opacity-60">Select your language</p>
      </div>

      <div className="w-full px-6 pb-20 grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom duration-700 delay-200 overflow-y-auto">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelect(lang.code)}
            className="group w-full bg-white border border-orange-100 p-5 rounded-[2rem] flex items-center justify-between hover:border-[#8B4513] hover:shadow-xl transition-all active:scale-95 shadow-sm"
          >
            <div className="flex flex-col text-left">
              <span className="text-lg font-black text-[#8B4513] leading-tight">{lang.native}</span>
              <span className="text-[9px] text-[#A0522D] font-black uppercase tracking-widest opacity-40">{lang.label}</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-[#8B4513] group-hover:bg-[#8B4513] group-hover:text-white transition-colors">
              <i className="fas fa-chevron-right text-xs"></i>
            </div>
          </button>
        ))}
      </div>

      <div className="fixed bottom-0 w-full p-6 bg-gradient-to-t from-[#FDFBF7] to-transparent pointer-events-none">
        <div className="text-center opacity-30 mt-4 pointer-events-auto">
          <div className="flex items-center justify-center space-x-3">
             <i className="fab fa-google text-[10px]"></i>
             <p className="text-[8px] font-black uppercase tracking-[0.3em]">Verified Secure Access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
