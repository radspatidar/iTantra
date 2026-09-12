import { useState, useEffect } from 'react';
import { speakText, stopSpeech, LANGUAGES } from '../services/speech';

function Waveform({ active }) {
  const bars = [0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 1, 0.7, 0.4, 0.8, 0.5];
  return (
    <div className="flex items-center justify-center gap-[3px] h-10">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-1 rounded-full bg-red-400 transition-transform ${active ? 'waveform-bar' : ''}`}
          style={{
            height: `${h * 32}px`,
            animationDelay: `${i * 0.06}s`,
            animationDuration: `${0.5 + (i % 3) * 0.15}s`,
            transform: active ? undefined : 'scaleY(0.3)',
          }}
        />
      ))}
    </div>
  );
}

export default function AlertScreen({ message, langCode, sender = 'Field Unit', onAcknowledge, dark }) {
  const [speaking, setSpeaking] = useState(true);
  const lang = LANGUAGES.find(l => l.code === langCode) ?? LANGUAGES[0];

  useEffect(() => {
    speakText(message, lang.voiceLang);
    const t = setTimeout(() => setSpeaking(false), 4500);
    return () => { clearTimeout(t); stopSpeech(); };
  }, [message, lang.voiceLang]);

  const handleReplay = () => {
    stopSpeech();
    setSpeaking(true);
    speakText(message, lang.voiceLang);
    setTimeout(() => setSpeaking(false), 4500);
  };

  return (
    <div className={`flex flex-col h-full animate-slide-up ${dark ? 'bg-[#0F172A]' : 'bg-[#FEF2F2]'}`}>
      {/* Emergency header */}
      <div className="flex-shrink-0 bg-red-600 px-5 pt-6 pb-5 animate-emergency-pulse">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-white" />
          <span className="text-white text-xs font-semibold tracking-widest uppercase">Incoming · Emergency Alert</span>
        </div>
        <h1 className="text-white text-2xl font-bold tracking-tight">Priority Communication</h1>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-5 flex flex-col gap-4 scroll-smooth">
        {/* Priority badge */}
        <div className={`rounded-2xl border-2 border-red-500 p-4 ${dark ? 'bg-red-950/50' : 'bg-red-50'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-emergency-pulse" />
            <span className="text-red-600 dark:text-red-400 text-xs font-bold tracking-widest uppercase">Emergency Priority Alert</span>
          </div>
          <p className={`text-[11px] font-medium mb-3 ${dark ? 'text-red-300' : 'text-red-700'}`}>
            Announcing at maximum volume · High-priority override
          </p>

          <div className={`rounded-xl p-3 mb-3 ${dark ? 'bg-red-900/40' : 'bg-white'}`}>
            <p className={`text-[11px] font-medium mb-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
              Received from <span className="font-bold text-red-500">{sender}</span>
            </p>
            <p className={`text-base font-semibold leading-snug ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
              "{message}"
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`rounded-lg px-3 py-1.5 flex items-center gap-2 ${dark ? 'bg-red-900/60' : 'bg-red-100'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${speaking ? 'bg-green-400 animate-emergency-pulse' : 'bg-slate-400'}`} />
              <span className={`text-xs font-semibold ${dark ? 'text-red-300' : 'text-red-700'}`}>
                {speaking ? `Speaking Now · ${lang.label} voice` : `Playback complete · ${lang.label}`}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <Waveform active={speaking} />
          </div>
        </div>

        {/* Message packet info */}
        <div className={`rounded-xl p-3 ${dark ? 'bg-slate-800' : 'bg-white'} border ${dark ? 'border-slate-700' : 'border-slate-200'}`}>
          <p className={`text-[10px] font-bold tracking-widest uppercase mb-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
            Packet Details
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['Sender Unit', sender],
              ['Language', lang.label],
              ['Priority', 'EMERGENCY'],
              ['Transport', 'BLE Mesh'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className={`text-[10px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{k}</p>
                <p className={`text-xs font-semibold ${k === 'Priority' ? 'text-red-500 font-bold' : dark ? 'text-slate-200' : 'text-slate-800'}`}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className={`flex-shrink-0 px-4 pb-8 pt-3 border-t ${dark ? 'border-slate-800 bg-slate-900/80' : 'border-red-100 bg-white/80'} backdrop-blur-sm`}>
        <div className="flex gap-3">
          <button
            onClick={handleReplay}
            className={`flex-1 py-4 rounded-2xl font-semibold text-sm border-2 border-red-500 transition-all active:scale-95 ${
              dark ? 'text-red-400 bg-red-950/40' : 'text-red-600 bg-red-50'
            }`}
          >
            ↺ Replay
          </button>
          <button
            onClick={onAcknowledge}
            className="flex-1 py-4 rounded-2xl font-bold text-sm bg-red-600 text-white transition-all active:scale-95 shadow-lg"
          >
            ✓ Acknowledge
          </button>
        </div>
        <p className={`text-center text-[11px] mt-2 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
          Acknowledging will send confirmation to {sender} and dismiss
        </p>
      </div>
    </div>
  );
}
