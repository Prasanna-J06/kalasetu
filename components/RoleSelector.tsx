
import React from 'react';
import { UserRole, Language } from '../types';

interface RoleSelectorProps {
  onSelect: (role: UserRole) => void;
  onBack: () => void;
  lang: Language;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelect, onBack, lang }) => {
  const translations: Record<string, { artisan: string; buyer: string; artisanDesc: string; buyerDesc: string; welcome: string }> = {
    en: { artisan: "Artisan Login", buyer: "Explore Bazaar", artisanDesc: "Digitize your legacy", buyerDesc: "Support local tribes", welcome: "Choose your path" },
    hi: { artisan: "शिल्पकार लॉगिन", buyer: "बाज़ार देखें", artisanDesc: "अपनी विरासत को डिजिटल बनाएं", buyerDesc: "स्थानीय समुदायों का समर्थन करें", welcome: "अपना रास्ता चुनें" },
    bn: { artisan: "শিল্পী লগইন", buyer: "বাজার দেখুন", artisanDesc: "আপনার শিল্পকে ডিজিটাল করুন", buyerDesc: "স্থানীয় কারিগরদের সাহায্য করুন", welcome: "আপনার পথ চয়ন করুন" },
    ta: { artisan: "கைவினைஞர் உள்நுழைவு", buyer: "பஜாரை ஆராயுங்கள்", artisanDesc: "உங்கள் பாரம்பரியத்தை மேம்படுத்த", buyerDesc: "உள்ளூர் கைவினைஞர்களுக்கு ஆதரவு", welcome: "உங்கள் பாதையைத் தேர்ந்தெடுக்கவும்" },
    mr: { artisan: "शिल्पकार लॉगिन", buyer: "बाजार पाहा", artisanDesc: "तुमचा वारसा जतन करा", buyerDesc: "स्थानिक कलाकारांना मदत करा", welcome: "तुमचा मार्ग निवडा" },
    te: { artisan: "కళాకారుల లాగిన్", buyer: "బజార్ అన్వేషించండి", artisanDesc: "మీ వారసత్వాన్ని డిజిటల్ చేయండి", buyerDesc: "స్థానిక తెగలకు మద్దతు ఇవ్వండి", welcome: "మీ మార్గాన్ని ఎంచుకోండి" },
    gu: { artisan: "કારીગર લોગિન", buyer: "બજાર જુઓ", artisanDesc: "તમારા વારસાને ડિજિટલ બનાવો", buyerDesc: "સ્થાનિક આદિવાસીઓને ટેકો આપો", welcome: "તમારો રસ્તો પસંદ કરો" },
    kn: { artisan: "ಕುಶಲಕರ್ಮಿ ಲಾಗಿನ್", buyer: "ಬಜಾರ್ ಅನ್ವೇಷಿಸಿ", artisanDesc: "ನಿಮ್ಮ ಪರಂಪರೆಯನ್ನು ಡಿಜಿಟಲೀಕರಿಸಿ", buyerDesc: "ಸ್ಥಾನಿಕ ಬುಡಕಟ್ಟುಗಳಿಗೆ ಬೆಂಬಲ ನೀಡಿ", welcome: "ನಿಮ್ಮ ಹಾದಿಯನ್ನು ಆರಿಸಿ" },
    ml: { artisan: "കലാകാരൻ ലോഗിൻ", buyer: "ബസാർ പര്യവേക്ഷണം ചെയ്യുക", artisanDesc: "നിങ്ങളുടെ പാരമ്പര്യം ഡിജിറ്റലൈസ് ചെയ്യുക", buyerDesc: "പ്രാദേശിക ഗോത്രങ്ങളെ പിന്തുണയ്ക്കുക", welcome: "നിങ്ങളുടെ പാത തിരഞ്ഞെടുക്കുക" },
    pa: { artisan: "ਕਾਰੀਗਰ ਲੌਗਇਨ", buyer: "ਬਜ਼ਾਰ ਵੇਖੋ", artisanDesc: "ਆਪਣੀ ਵਿਰਾਸਤ ਨੂੰ ਡਿਜੀਟਲ ਕਰੋ", buyerDesc: "ਸਥਾਨਕ ਕਬੀਲਿਆਂ ਦਾ ਸਮਰਥਨ ਕਰੋ", welcome: "ਆਪਣਾ ਰਸਤਾ ਚੁਣੋ" },
    or: { artisan: "କାରିଗର ଲଗଇନ୍", buyer: "ବଜାର ଦେଖନ୍ତୁ", artisanDesc: "ଆପଣଙ୍କ ଐତିହ୍ୟକୁ ଡିଜିଟାଲ୍ କରନ୍ତୁ", buyerDesc: "ସ୍ଥାନୀୟ ଜନଜାତିଙ୍କୁ ସମର୍ଥନ କରନ୍ତୁ", welcome: "ଆପଣଙ୍କ ପଥ ବାଛନ୍ତୁ" },
    ur: { artisan: "کاریگر لاگ ان", buyer: "بازار دیکھیں", artisanDesc: "اپنے ورثے کو ڈیجیٹل بنائیں", buyerDesc: "مقامی قبائل کی حمایت کریں", welcome: "اپنے راستے کا انتخاب کریں" },
    as: { artisan: "শিল্পী লগইন", buyer: "বজাৰ চাওক", artisanDesc: "আপোনাৰ ঐতিহ্য ডিজিটেল কৰক", buyerDesc: "স্থানীয় জনজাতিক সহায় কৰক", welcome: "আপোনাৰ পথ বাছক" },
  };

  const t = translations[lang] || translations['en'];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-10 bg-[#FDFBF7]">
      <header className="absolute top-8 left-8">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-white shadow-sm border border-orange-50 rounded-full text-[#8B4513]">
          <i className="fas fa-arrow-left"></i>
        </button>
      </header>

      <div className="mb-14 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-16 h-16 bg-orange-50 rounded-2xl mx-auto mb-6 flex items-center justify-center text-[#8B4513] shadow-inner">
           <i className="fas fa-user-friends text-2xl"></i>
        </div>
        <h1 className="text-3xl font-black text-[#8B4513] mb-3 serif">{t.welcome}</h1>
        <div className="h-[2px] w-12 bg-orange-200 mx-auto mb-4"></div>
        <p className="text-[#A0522D] text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Connected via {lang.toUpperCase()}</p>
      </div>

      <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
        <button 
          onClick={() => onSelect('ARTISAN')}
          className="group w-full bg-white border border-orange-100 text-[#8B4513] p-6 rounded-[2.5rem] flex items-center shadow-sm hover:shadow-xl transition-all active:scale-95"
        >
          <div className="bg-orange-50 p-4 rounded-2xl mr-6 group-hover:bg-[#8B4513] group-hover:text-white transition-all">
            <i className="fas fa-hammer text-2xl"></i>
          </div>
          <div className="text-left">
            <h3 className="text-xl font-black tracking-tight">{t.artisan}</h3>
            <p className="text-[10px] text-[#A0522D] font-black uppercase tracking-widest opacity-40">{t.artisanDesc}</p>
          </div>
        </button>

        <button 
          onClick={() => onSelect('BUYER')}
          className="group w-full bg-[#8B4513] hover:bg-[#6F3710] text-white p-6 rounded-[2.5rem] flex items-center shadow-2xl hover:shadow-[0_20px_60px_rgba(139,69,19,0.3)] transition-all active:scale-95"
        >
          <div className="bg-white/10 p-4 rounded-2xl mr-6 backdrop-blur-sm">
            <i className="fas fa-bag-shopping text-2xl"></i>
          </div>
          <div className="text-left">
            <h3 className="text-xl font-black tracking-tight">{t.buyer}</h3>
            <p className="text-[10px] opacity-60 font-black uppercase tracking-widest">{t.buyerDesc}</p>
          </div>
        </button>
      </div>

      <div className="mt-16 text-center opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.3em]">KalaSetu Core v1.1</p>
      </div>
    </div>
  );
};

export default RoleSelector;
