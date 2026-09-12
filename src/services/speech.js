// MOCK STT/TTS SERVICE — replace with Sherpa-ONNX (STT) and Piper/IndicTTS (TTS) for production

export const LANGUAGES = [
  { code: "hi", label: "Hindi", native: "हिन्दी", voiceLang: "hi-IN" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", voiceLang: "gu-IN" },
  { code: "mr", label: "Marathi", native: "मराठी", voiceLang: "mr-IN" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", voiceLang: "kn-IN" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", voiceLang: "ml-IN" },
  { code: "ta", label: "Tamil", native: "தமிழ்", voiceLang: "ta-IN" },
  { code: "te", label: "Telugu", native: "తెలుగు", voiceLang: "te-IN" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ", voiceLang: "or-IN" },
  { code: "bn", label: "Bengali", native: "বাংলা", voiceLang: "bn-IN" },
  { code: "en", label: "English", native: "English", voiceLang: "en-IN" },
]

const NORMAL_MESSAGES = {
  hi: [
    "सभी यूनिट अपनी स्थिति की रिपोर्ट करें",
    "क्षेत्र सुरक्षित है, आगे बढ़ें",
    "पानी और राशन की आपूर्ति की जाँच करें",
  ],
  en: [
    "All units report your current status",
    "Area is clear, proceed forward",
    "Check supply of water and rations",
  ],
  mr: ["सर्व युनिटांनी आपली स्थिती कळवा", "क्षेत्र सुरक्षित आहे, पुढे जा"],
  gu: ["બધા એકમો તેમની સ્થિતિ જણાવો", "વિસ્તાર સુરક્ષિત છે, આગળ વધો"],
  kn: ["ಎಲ್ಲಾ ಘಟಕಗಳು ಸ್ಥಿತಿ ವರದಿ ಮಾಡಿ", "ಪ್ರದೇಶ ಸ್ಪಷ್ಟವಾಗಿದೆ"],
  ml: ["എല്ലാ യൂണിറ്റുകളും സ്ഥിതി റിപ്പോർട്ട് ചെയ്യുക"],
  ta: ["அனைத்து அலகுகளும் நிலையை தெரிவிக்கவும்"],
  te: ["అన్ని యూనిట్లు స్థితి నివేదించండి"],
  or: ["ସମସ୍ତ ୟୁନିଟ୍ ସ୍ଥିତି ରିପୋର୍ଟ କରନ୍ତୁ"],
  bn: ["সমস্ত ইউনিট তাদের অবস্থান জানান"],
}

const EMERGENCY_MESSAGES = {
  hi: "सभी यूनिट तुरंत सुरक्षित स्थान पर पहुँचें",
  en: "All units evacuate to safety immediately — emergency",
  mr: "सर्व युनिट त्वरित सुरक्षित ठिकाणी पोहोचा",
  gu: "તમામ એકમો તાત્કાલિક સુરક્ષિત સ્થળે પહોંચો",
  kn: "ಎಲ್ಲಾ ಘಟಕಗಳು ತಕ್ಷಣ ಸುರಕ್ಷಿತ ಸ್ಥಳಕ್ಕೆ ತಲುಪಿ",
  ml: "എല്ലാ യൂണിറ്റുകളും ഉടൻ സുരക്ഷിത സ്ഥലത്ത് എത്തുക",
  ta: "அனைத்து அலகுகளும் உடனடியாக பாதுகாப்பான இடத்திற்கு செல்லுங்கள்",
  te: "అన్ని యూనిట్లు వెంటనే సురક્ષిత ప్రదేశానికి చేరండి",
  or: "ସମସ୍ତ ୟୁନିଟ୍ ତୁରନ୍ତ ସୁରକ୍ଷିତ ସ୍ଥାନକୁ ଯାଆନ୍ତୁ",
  bn: "সমস্ত ইউনিট অবিলম্বে নিরাপদ স্থানে যান",
}

let msgIndex = 0
let nextIsEmergency = false

// MOCK — replace with Sherpa-ONNX offline STT
export function mockSTT(langCode, forceEmergency = false) {
  if (forceEmergency || nextIsEmergency) {
    nextIsEmergency = false
    return EMERGENCY_MESSAGES[langCode] ?? EMERGENCY_MESSAGES["hi"]
  }
  const msgs = NORMAL_MESSAGES[langCode] ?? NORMAL_MESSAGES["hi"]
  return msgs[msgIndex++ % msgs.length]
}

export function setNextEmergency() {
  nextIsEmergency = true
}

// MOCK TTS — uses Web Speech API (device local); replace with Piper/IndicTTS for offline production
export function speakText(text, voiceLang) {
  if (!("speechSynthesis" in window)) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = voiceLang
  utt.rate = 0.9
  utt.volume = 1
  const voices = window.speechSynthesis.getVoices()
  const match = voices.find((v) => v.lang.startsWith(voiceLang.split("-")[0]))
  if (match) utt.voice = match
  window.speechSynthesis.speak(utt)
}

export function stopSpeech() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel()
}
