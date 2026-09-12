import { useState, useCallback, useRef, useEffect } from 'react';
import TalkScreen from './screens/TalkScreen';
import ConnectionScreen from './screens/ConnectionScreen';
import SettingsScreen from './screens/SettingsScreen';
import AlertScreen from './screens/AlertScreen';
import { mockSTT, speakText, LANGUAGES } from './services/speech';
import { classifyPriority } from './services/priority';
import { transportService } from './services/transport';
import { createMessagePacket, createAckPacket } from './services/packet';

const INITIAL_DARK = (() => {
  try { return localStorage.getItem('itantra-dark') === 'true'; } catch { return false; }
})();

export default function App() {
  const [deviceId, setDeviceId] = useState('Field Unit 1');
  const [screen, setScreen] = useState('talk');
  const [dark, setDarkRaw] = useState(INITIAL_DARK);
  const [langCode, setLangCode] = useState('hi');
  const [transport, setTransport] = useState('BLE');
  const [connectedDevice, setConnectedDevice] = useState('Field Unit 2');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [talkState, setTalkState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [priority, setPriority] = useState('normal');
  const [pttMode, setPttMode] = useState('ptt');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [alertPayload, setAlertPayload] = useState(null);
  const [incomingMessage, setIncomingMessage] = useState(null);

  const timers = useRef([]);
  const lastSentPacketIdRef = useRef(null);

  const setDark = (v) => {
    setDarkRaw(v);
    try { localStorage.setItem('itantra-dark', String(v)); } catch {}
  };

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const after = (ms, fn) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  };

  // Initialize P2P Transport Service & event handlers
  useEffect(() => {
    transportService.init(deviceId);

    const handleStatusChange = ({ status, device }) => {
      setConnectionStatus(status);
      if (device !== undefined) setConnectedDevice(device);
    };

    const handleIncomingPacket = (packet) => {
      if (!packet) return;
      if (packet.priority === 'emergency') {
        // High Priority Emergency Alert
        setAlertPayload({
          packetId: packet.packet_id,
          text: packet.text,
          langCode: packet.language || 'hi',
          sender: packet.sender_id || 'Remote Unit',
        });
      } else {
        // Normal or Important Message
        setIncomingMessage({
          packetId: packet.packet_id,
          sender_id: packet.sender_id || 'Remote Unit',
          text: packet.text,
          priority: packet.priority || 'normal',
          language: packet.language || 'hi',
          isSpeaking: true,
        });

        if (voiceEnabled) {
          const targetLang = LANGUAGES.find(l => l.code === langCode) ?? LANGUAGES[0];
          speakText(packet.text, targetLang.voiceLang);
        }

        setTimeout(() => {
          setIncomingMessage(prev => prev ? { ...prev, isSpeaking: false } : null);
        }, 3500);
      }
    };

    const handleIncomingAck = (ackPacket) => {
      if (ackPacket && ackPacket.ref_packet_id === lastSentPacketIdRef.current) {
        setTalkState('acknowledged');
      }
    };

    transportService.on('status', handleStatusChange);
    transportService.on('packet', handleIncomingPacket);
    transportService.on('ack', handleIncomingAck);

    return () => {
      transportService.off('status', handleStatusChange);
      transportService.off('packet', handleIncomingPacket);
      transportService.off('ack', handleIncomingAck);
    };
  }, [deviceId, langCode, voiceEnabled]);

  const handleStartTalk = useCallback(() => {
    clearTimers();
    setTalkState('listening');
    setTranscript('');
  }, []);

  const handleEndTalk = useCallback(() => {
    const text = mockSTT(langCode);
    setTranscript(text);
    const p = classifyPriority(text);
    setPriority(p);
    setTalkState('processing');

    after(800, () => {
      setTalkState('sending');

      // Create message packet & transmit over TransportService
      const packet = createMessagePacket({
        senderId: deviceId,
        targetId: connectedDevice,
        text,
        language: langCode,
        priority: p,
      });

      lastSentPacketIdRef.current = packet.packet_id;
      transportService.sendPacket(packet);

      after(700, () => {
        setTalkState('delivered');
        after(4000, () => {
          setTalkState(prev => (prev === 'delivered' || prev === 'acknowledged') ? 'idle' : prev);
        });
      });
    });
  }, [deviceId, connectedDevice, langCode]);

  const handleConnect = useCallback((device) => {
    transportService.connect(device);
  }, []);

  const handleDisconnect = useCallback(() => {
    transportService.disconnect();
  }, []);

  const handleAcknowledge = useCallback(() => {
    if (alertPayload) {
      const ackPacket = createAckPacket({
        senderId: deviceId,
        targetId: alertPayload.sender,
        refPacketId: alertPayload.packetId,
      });
      transportService.sendAck(ackPacket);
    }
    setAlertPayload(null);
    setTalkState('idle');
  }, [deviceId, alertPayload]);

  return (
    <div className={`min-h-screen flex items-center justify-center sm:p-4 select-none ${dark ? 'bg-slate-950' : 'bg-slate-200'}`}>
      {/* Phone container / Mobile app wrapper */}
      <div
        className={`relative flex flex-col w-full h-[100dvh] max-w-md mx-auto sm:h-[844px] sm:rounded-[36px] overflow-hidden shadow-2xl transition-all ${
          dark ? 'bg-slate-900' : 'bg-white'
        }`}
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          boxShadow: dark
            ? '0 0 0 1px #334155, 0 40px 80px rgba(0,0,0,0.7)'
            : '0 0 0 1px #cbd5e1, 0 40px 80px rgba(0,0,0,0.25)',
        }}
      >
        {/* Screen content */}
        <div className="flex-1 overflow-hidden relative">
          {screen === 'talk' && (
            <TalkScreen
              dark={dark}
              langCode={langCode}
              setLangCode={setLangCode}
              transport={transport}
              connectedDevice={connectedDevice}
              connectionStatus={connectionStatus}
              transcript={transcript}
              talkState={talkState}
              priority={priority}
              onStartTalk={handleStartTalk}
              onEndTalk={handleEndTalk}
              onConnectionCardPress={() => setScreen('connection')}
              incomingMessage={incomingMessage}
              deviceId={deviceId}
            />
          )}
          {screen === 'connection' && (
            <ConnectionScreen
              dark={dark}
              transport={transport}
              setTransport={setTransport}
              connectedDevice={connectedDevice}
              connectionStatus={connectionStatus}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              deviceId={deviceId}
              setDeviceId={setDeviceId}
            />
          )}
          {screen === 'settings' && (
            <SettingsScreen
              dark={dark}
              setDark={setDark}
              transport={transport}
              setTransport={setTransport}
              langCode={langCode}
              setLangCode={setLangCode}
              voiceEnabled={voiceEnabled}
              setVoiceEnabled={setVoiceEnabled}
            />
          )}

          {/* Alert overlay for Emergency Priority Packets */}
          {alertPayload && (
            <div className="absolute inset-0 z-50">
              <AlertScreen
                message={alertPayload.text}
                langCode={alertPayload.langCode}
                sender={alertPayload.sender}
                onAcknowledge={handleAcknowledge}
                dark={dark}
              />
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div
          className={`flex-shrink-0 flex border-t z-20 ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          {[
            { id: 'talk', label: 'Talk', icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
                <path d="M5 10a7 7 0 0014 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )},
            { id: 'settings', label: 'Settings', icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                <path d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.5-7.5-1.5 1.5m-9 9-1.5 1.5m12 0-1.5-1.5m-9-9L4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )},
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setScreen(tab.id)}
              className={`flex-1 flex flex-col items-center pt-2.5 pb-1 gap-0.5 transition-colors ${
                screen === tab.id
                  ? 'text-teal-500'
                  : dark ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {tab.icon}
              <span className={`text-[10px] font-semibold ${screen === tab.id ? 'text-teal-500' : dark ? 'text-slate-500' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
