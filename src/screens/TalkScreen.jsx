import { useState, useRef, useCallback } from "react"
import { LANGUAGES, speakText, stopSpeech } from "../services/speech"
import { priorityColor, priorityLabel } from "../services/priority"

function Waveform({ active, color = "bg-white/70" }) {
  const bars = [
    0.3, 0.6, 1, 0.7, 0.4, 0.9, 0.5, 0.8, 0.4, 0.6, 1, 0.5, 0.7, 0.3,
  ]
  return (
    <div className="flex items-center justify-center gap-[2px] h-6">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full ${color} ${
            active ? "waveform-bar" : ""
          }`}
          style={{
            height: `${h * 20}px`,
            animationDelay: `${i * 0.07}s`,
            animationDuration: `${0.4 + (i % 4) * 0.1}s`,
            transform: active ? undefined : "scaleY(0.3)",
            transition: "transform 0.3s",
          }}
        />
      ))}
    </div>
  )
}

const STATUS_LABELS = {
  idle: "Ready",
  listening: "Listening...",
  processing: "Processing",
  sending: "Sending...",
  delivered: "Delivered ✓",
  acknowledged: "Acknowledged ✓",
}

const STATUS_COLORS = {
  idle: "text-slate-400",
  listening: "text-teal-400",
  processing: "text-blue-400",
  sending: "text-amber-400",
  delivered: "text-green-400",
  acknowledged: "text-teal-400 font-bold",
}

export default function TalkScreen({
  dark,
  langCode,
  setLangCode,
  transport,
  connectedDevice,
  connectionStatus,
  transcript,
  talkState,
  priority,
  pttMode,
  setPttMode,
  onStartTalk,
  onEndTalk,
  onConnectionCardPress,
  incomingMessage,
  deviceId,
}) {
  const [showAllLangs, setShowAllLangs] = useState(false)
  const [incomingSpeaking, setIncomingSpeaking] = useState(false)
  const pressing = useRef(false)

  const card = dark
    ? "bg-slate-800 border-slate-700"
    : "bg-white border-slate-200"
  const text = dark ? "text-slate-100" : "text-slate-900"
  const muted = dark ? "text-slate-400" : "text-slate-500"
  const bg = dark ? "bg-[#0F172A]" : "bg-[#F0F4F8]"
  const divider = dark ? "border-slate-700" : "border-slate-200"

  const isListening = talkState === "listening"
  const isActive =
    talkState !== "idle" &&
    talkState !== "delivered" &&
    talkState !== "acknowledged"
  const currentLang = LANGUAGES.find((l) => l.code === langCode) ?? LANGUAGES[0]

  const handlePressStart = useCallback(
    (e) => {
      e.preventDefault()
      if (
        talkState !== "idle" &&
        talkState !== "delivered" &&
        talkState !== "acknowledged"
      )
        return
      pressing.current = true
      onStartTalk()
    },
    [talkState, onStartTalk],
  )

  const handlePressEnd = useCallback(
    (e) => {
      e.preventDefault()
      if (!pressing.current) return
      pressing.current = false
      if (talkState === "listening") onEndTalk()
    },
    [talkState, onEndTalk],
  )

  const handleReplayIncoming = () => {
    if (!incomingMessage) return
    stopSpeech()
    setIncomingSpeaking(true)
    const targetLang =
      LANGUAGES.find((l) => l.code === langCode) ?? LANGUAGES[0]
    speakText(incomingMessage.text, targetLang.voiceLang)
    setTimeout(() => setIncomingSpeaking(false), 3500)
  }

  const QUICK_LANGS = ["hi", "mr", "en"]

  return (
    <div className={`flex flex-col h-full ${bg}`}>
      {/* Header */}
      <div
        className={`flex-shrink-0 px-5 pt-5 pb-3 border-b ${divider} ${
          dark ? "bg-slate-900" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-xl font-bold tracking-tight ${text}`}>
              iTantra <span className={`font-light ${muted}`}>· Talk</span>
            </h1>
            <p
              className={`text-xs mt-0.5 font-medium ${
                dark ? "text-teal-400" : "text-teal-600"
              }`}
            >
              Unit: <span className="font-bold">{deviceId}</span>
            </p>
          </div>
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
              dark ? "bg-slate-800" : "bg-slate-100"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-500"
                  : "bg-slate-400"
              }`}
            />
            <span
              className={`text-[11px] font-semibold ${
                dark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {connectionStatus === "connected" ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 flex flex-col gap-3 scroll-smooth">
        {/* Connection card */}
        <button
          onClick={onConnectionCardPress}
          className={`rounded-2xl border ${card} p-3 w-full text-left transition-all active:scale-98`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  connectionStatus === "connected"
                    ? "bg-green-500/20"
                    : "bg-slate-500/20"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    connectionStatus === "connected"
                      ? "bg-green-500"
                      : connectionStatus === "connecting"
                        ? "bg-amber-400 animate-ping"
                        : "bg-slate-400"
                  }`}
                />
              </div>
              <div>
                {connectionStatus === "connected" && connectedDevice ? (
                  <>
                    <p className={`text-sm font-bold ${text}`}>
                      {connectedDevice}
                    </p>
                    <p className={`text-[11px] ${muted}`}>
                      {transport} · Strong Signal · Connected
                    </p>
                  </>
                ) : connectionStatus === "connecting" ? (
                  <>
                    <p className={`text-sm font-semibold text-amber-500`}>
                      Connecting...
                    </p>
                    <p className={`text-[11px] ${muted}`}>
                      {transport} mesh discovery
                    </p>
                  </>
                ) : (
                  <>
                    <p className={`text-sm font-semibold ${muted}`}>
                      Not Connected
                    </p>
                    <p className={`text-[11px] ${muted}`}>
                      Tap to pair with nearby phone
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span
                className={`text-xs font-semibold ${
                  connectionStatus === "connected"
                    ? "text-green-500"
                    : connectionStatus === "connecting"
                      ? "text-amber-500"
                      : muted
                }`}
              >
                {connectionStatus === "connected"
                  ? "Connected"
                  : connectionStatus === "connecting"
                    ? "Pairing"
                    : "Connect"}
              </span>
              <span className={`text-sm ${muted}`}>›</span>
            </div>
          </div>
        </button>

        {/* Language selector */}
        <div className={`rounded-2xl border ${card} p-4`}>
          <p
            className={`text-[11px] font-bold tracking-widest uppercase mb-2.5 ${muted}`}
          >
            Your Speaking / Voice Language
          </p>
          {!showAllLangs ? (
            <div className="flex items-center gap-2 flex-wrap">
              {QUICK_LANGS.map((code) => {
                const l = LANGUAGES.find((x) => x.code === code)
                return (
                  <button
                    key={code}
                    onClick={() => setLangCode(code)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                      langCode === code
                        ? "bg-teal-600 text-white shadow"
                        : dark
                          ? "bg-slate-700 text-slate-300"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {l ? l.native : code}
                  </button>
                )
              })}
              <button
                onClick={() => setShowAllLangs(true)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium text-teal-500 transition-all ${
                  dark ? "bg-slate-700" : "bg-teal-50"
                }`}
              >
                See All ›
              </button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 gap-1.5 mb-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLangCode(l.code)
                      setShowAllLangs(false)
                    }}
                    className={`py-2 px-3 rounded-xl text-left transition-all ${
                      langCode === l.code
                        ? "bg-teal-600 text-white"
                        : dark
                          ? "bg-slate-700 text-slate-300"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="text-xs font-semibold block">
                      {l.label}
                    </span>
                    <span className="text-[11px] opacity-70">{l.native}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAllLangs(false)}
                className={`text-xs text-teal-500 font-medium`}
              >
                ‹ Show less
              </button>
            </div>
          )}
        </div>

        {/* Incoming Message Card (when receiving from remote phone) */}
        {incomingMessage && (
          <div
            className={`rounded-2xl border-2 p-4 transition-all ${
              incomingMessage.priority === "important"
                ? "border-amber-500 " +
                  (dark ? "bg-amber-950/40" : "bg-amber-50")
                : "border-teal-500 " + (dark ? "bg-teal-950/30" : "bg-teal-50")
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    incomingMessage.priority === "important"
                      ? "bg-amber-500 animate-pulse"
                      : "bg-teal-500"
                  }`}
                />
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    incomingMessage.priority === "important"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-teal-600 dark:text-teal-400"
                  }`}
                >
                  Received from {incomingMessage.sender_id || "Remote Unit"}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${priorityColor(incomingMessage.priority || "normal").bg} ${priorityColor(incomingMessage.priority || "normal").text}`}
              >
                {priorityLabel(incomingMessage.priority || "normal")}
              </span>
            </div>

            <p className={`text-sm font-semibold leading-relaxed mb-3 ${text}`}>
              "{incomingMessage.text}"
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Waveform
                  active={incomingMessage.isSpeaking || incomingSpeaking}
                  color={
                    incomingMessage.priority === "important"
                      ? "bg-amber-500"
                      : "bg-teal-500"
                  }
                />
                <span
                  className={`text-xs font-semibold ${
                    incomingMessage.isSpeaking || incomingSpeaking
                      ? "text-teal-500 animate-pulse"
                      : muted
                  }`}
                >
                  {incomingMessage.isSpeaking || incomingSpeaking
                    ? "Speaking Now"
                    : "Played"}
                </span>
              </div>
              <button
                onClick={handleReplayIncoming}
                className="px-3 py-1 rounded-lg bg-teal-600 text-white text-xs font-semibold active:scale-95 transition-all"
              >
                ↺ Replay
              </button>
            </div>
          </div>
        )}

        {/* Live Transcript Card */}
        <div
          className={`rounded-2xl border ${card} p-4 flex-1 min-h-[130px] flex flex-col justify-between transition-all`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <p
                className={`text-[11px] font-bold tracking-widest uppercase ${muted}`}
              >
                Live Transcript (You)
              </p>
              {talkState !== "idle" && (
                <span
                  className={`text-[11px] font-semibold ${STATUS_COLORS[talkState] || "text-teal-400"}`}
                >
                  {STATUS_LABELS[talkState] || talkState}
                </span>
              )}
            </div>
            {transcript ? (
              <p className={`text-sm leading-relaxed font-medium ${text}`}>
                "{transcript}"
              </p>
            ) : (
              <p className={`text-sm italic ${muted}`}>
                Transcript will appear here when you speak…
              </p>
            )}
          </div>

          {talkState !== "idle" && (
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {["Listening", "Processing", "Sending", "Delivered"].map(
                  (step, i) => {
                    const states = [
                      "listening",
                      "processing",
                      "sending",
                      "delivered",
                      "acknowledged",
                    ]
                    const active = states.indexOf(talkState) >= i
                    return (
                      <div key={step} className="flex items-center gap-1">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            active
                              ? "bg-teal-500"
                              : dark
                                ? "bg-slate-700"
                                : "bg-slate-300"
                          }`}
                        />
                        {i < 3 && (
                          <div
                            className={`w-3 h-px ${
                              active && states.indexOf(talkState) > i
                                ? "bg-teal-500"
                                : dark
                                  ? "bg-slate-700"
                                  : "bg-slate-300"
                            }`}
                          />
                        )}
                      </div>
                    )
                  },
                )}
              </div>
              {priority !== "normal" &&
                (talkState === "delivered" || talkState === "acknowledged") && (
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${priorityColor(priority).bg} ${priorityColor(priority).text}`}
                  >
                    {priorityLabel(priority)}
                  </span>
                )}
            </div>
          )}
        </div>
      </div>

      {/* PTT Button */}
      <div
        className={`flex-shrink-0 flex flex-col items-center px-4 pb-6 pt-3 border-t ${divider} ${
          dark ? "bg-slate-900/80" : "bg-white/80"
        } backdrop-blur-sm`}
      >
        <div className="relative flex items-center justify-center mb-3">
          {/* Pulse rings when listening */}
          {isListening && (
            <>
              <div
                className="absolute w-36 h-36 rounded-full bg-teal-500/20 animate-pulse-ring"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="absolute w-36 h-36 rounded-full bg-teal-500/15 animate-pulse-ring"
                style={{ animationDelay: "0.5s" }}
              />
            </>
          )}
          <button
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all shadow-lg select-none ${
              isListening
                ? "bg-teal-500 scale-105 shadow-teal-500/40 shadow-xl"
                : isActive
                  ? "bg-teal-700"
                  : "bg-teal-600 active:scale-95 active:bg-teal-700"
            }`}
            disabled={connectionStatus !== "connected"}
          >
            {isListening ? (
              <>
                <Waveform active={true} />
                <span className="text-white text-xs font-bold mt-1">
                  Listening
                </span>
              </>
            ) : isActive ? (
              <>
                <div className="w-6 h-6 border-2 border-white/60 border-t-white rounded-full animate-spin mb-1" />
                <span className="text-white text-[11px] font-semibold">
                  {STATUS_LABELS[talkState]}
                </span>
              </>
            ) : (
              <>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mb-0.5"
                >
                  <rect x="9" y="2" width="6" height="12" rx="3" fill="white" />
                  <path
                    d="M5 10a7 7 0 0014 0"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="12"
                    y1="17"
                    x2="12"
                    y2="21"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="8"
                    y1="21"
                    x2="16"
                    y2="21"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-white text-xs font-bold">
                  {connectionStatus === "connected"
                    ? "Hold to Talk"
                    : "Connect First"}
                </span>
              </>
            )}
          </button>
        </div>
        <p className={`text-[11px] ${muted}`}>
          {connectionStatus !== "connected"
            ? "Connect to nearby phone to enable talk"
            : "Tap and hold to speak"}
        </p>
        <p
          className={`text-[10px] mt-0.5 font-medium ${
            dark ? "text-teal-500" : "text-teal-600"
          }`}
        >
          {currentLang.label} · {transport} ·{" "}
          {connectionStatus === "connected"
            ? `Paired with ${connectedDevice}`
            : "Not Paired"}
        </p>
      </div>
    </div>
  )
}
