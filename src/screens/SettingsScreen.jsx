import { LANGUAGES } from '../services/speech';

function Toggle({ value, onChange, label, dark }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm font-medium ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-teal-600' : dark ? 'bg-slate-600' : 'bg-slate-300'}`}
      >
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

export default function SettingsScreen({ dark, setDark, transport, setTransport, langCode, setLangCode, voiceEnabled, setVoiceEnabled }) {
  const card = dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
  const text = dark ? 'text-slate-100' : 'text-slate-900';
  const muted = dark ? 'text-slate-400' : 'text-slate-500';
  const divider = dark ? 'border-slate-700' : 'border-slate-200';

  return (
    <div className={`flex flex-col h-full ${dark ? 'bg-[#0F172A]' : 'bg-[#F0F4F8]'}`}>
      <div className={`flex-shrink-0 px-5 pt-5 pb-4 border-b ${divider} ${dark ? 'bg-slate-900' : 'bg-white'}`}>
        <h1 className={`text-xl font-bold ${text}`}>Settings</h1>
        <p className={`text-xs mt-0.5 ${muted}`}>iTantra · Voice without barriers</p>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 flex flex-col gap-3 scroll-smooth">
        {/* Appearance */}
        <div className={`rounded-2xl border ${card} p-4`}>
          <p className={`text-[11px] font-bold tracking-widest uppercase mb-3 ${muted}`}>Appearance</p>
          <div className="flex gap-2">
            {[
              { label: '☀ Light', value: false },
              { label: '● Dark', value: true },
            ].map(opt => (
              <button
                key={String(opt.value)}
                onClick={() => setDark(opt.value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  dark === opt.value
                    ? 'bg-teal-600 text-white shadow'
                    : dark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Connection preference */}
        <div className={`rounded-2xl border ${card} p-4`}>
          <p className={`text-[11px] font-bold tracking-widest uppercase mb-3 ${muted}`}>Connection Preference</p>
          <div className="flex gap-2">
            {['BLE', 'WiFi Direct'].map(t => (
              <button
                key={t}
                onClick={() => setTransport(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  transport === t
                    ? 'bg-teal-600 text-white shadow'
                    : dark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {t === 'BLE' ? 'Bluetooth' : 'Wi-Fi Direct'}
              </button>
            ))}
          </div>
        </div>

        {/* Default language */}
        <div className={`rounded-2xl border ${card} p-4`}>
          <p className={`text-[11px] font-bold tracking-widest uppercase mb-3 ${muted}`}>Default Language</p>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLangCode(l.code)}
                className={`py-2 px-3 rounded-xl text-left transition-all ${
                  langCode === l.code
                    ? 'bg-teal-600 text-white shadow'
                    : dark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                <span className="text-xs font-semibold block">{l.label}</span>
                <span className="text-[11px] opacity-70">{l.native}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Audio */}
        <div className={`rounded-2xl border ${card} p-4`}>
          <p className={`text-[11px] font-bold tracking-widest uppercase mb-3 ${muted}`}>Audio</p>
          <Toggle
            value={voiceEnabled}
            onChange={setVoiceEnabled}
            label="Voice playback enabled"
            dark={dark}
          />
          <p className={`text-[11px] mt-2 ${muted}`}>
            Uses device local TTS engine (Web Speech API). In production, replaced by offline Piper/IndicTTS.
          </p>
        </div>
      </div>
    </div>
  );
}
