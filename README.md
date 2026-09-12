# iTantra — Offline Mesh Voice Communication App

**Problem Statement ID**: `SIH26173`  
**Application Name**: iTantra  
**Platform**: Android Native App (Capacitor) & Responsive Mobile Web Application  

---

## 📌 Project Overview

**iTantra** is a zero-internet, peer-to-peer voice and text communication application designed for field operations, disaster response, and internet-denied environments. It provides secure, local, multi-language Speech-to-Text (STT) and Text-to-Speech (TTS) communication directly between mobile devices over local Bluetooth Low Energy (BLE) and Wi-Fi Direct mesh protocols without relying on cloud infrastructure, cellular networks, or central servers.

---

## ✨ Key Functionality

- **📱 True Bidirectional Two-Phone Communication**: Phone A and Phone B run the same iTantra application and seamlessly switch between sender and receiver roles.
- **🎙️ Push-To-Talk (PTT)**: Tap-and-hold voice capture with real-time audio waveform feedback and speech-to-text transcript generation.
- **⚡ Emergency Priority System**: Supports **Normal**, **Important** (amber alert), and **Emergency** (red full-screen override with audio alert and manual acknowledgment) packet priorities.
- **🔄 Instant Acknowledgment & Replay**: Remote receivers can acknowledge emergency alerts with a single tap, returning confirmation to the sender and replaying messages via device-local TTS.
- **🌐 Per-Device Language Selection**: Supports 10 regional Indian languages (Hindi, Marathi, Gujarati, Kannada, Malayalam, Tamil, Telugu, Odia, Bengali, English) configured independently per device.
- **📶 Offline Device Discovery & Handshake**: Automatic scan, discovery, and pairing with nearby iTantra field units over local BLE/Wi-Fi Direct mesh networks.
- **🌗 Light & Dark Theme Support**: Sleek, high-contrast, energy-efficient UI optimized for daylight and dark environment operations.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, JavaScript (ES6+), HTML5, CSS3
- **Styling & Icons**: Tailwind CSS v4 (`@tailwindcss/vite`), Custom Micro-Animations
- **Build Tooling**: Vite 8
- **Mobile Container**: Capacitor 8 (`@capacitor/core`, `@capacitor/android`)
- **Offline Mesh Transport**: P2P `BroadcastChannel` & Local Storage Sync Abstraction Layer (compatible with BLE / Wi-Fi Direct hardware drivers)
- **Local Speech Engines**: Device-Local Speech-to-Text (STT) pipeline & Web Speech API Text-to-Speech (TTS) engine

---

## 🌐 Communication Architecture

```
PHONE A (Field Unit 1)                                PHONE B (Field Unit 2)
 ┌─────────────┐                                       ┌─────────────┐
 │ Microphone  │                                       │ Speaker/TTS │
 └──────┬──────┘                                       └──────▲──────┘
        │                                                     │
        ▼                                                     │
 ┌─────────────┐                                       ┌─────────────┐
 │ STT Engine  │                                       │ Local TTS   │
 └──────┬──────┘                                       └──────▲──────┘
        │                                                     │
        ▼                                                     │
 ┌─────────────┐                                       ┌─────────────┐
 │ Text Packet │                                       │ Priority    │
 └──────┬──────┘                                       │ Inspection  │
        │                                              └──────▲──────┘
        │                                                     │
        └──────────────►  OFFLINE P2P MESH  ──────────────────┘
                      (BLE / Wi-Fi Direct)
```

### Text Packet Payload
```json
{
  "packet_id": "pkt_1710000000000_x9a",
  "type": "MESSAGE",
  "sender_id": "Field Unit 1",
  "target_id": "Field Unit 2",
  "timestamp": "2026-09-13T00:00:00.000Z",
  "language": "hi",
  "priority": "normal",
  "text": "सभी यूनिट अपनी स्थिति की रिपोर्ट करें"
}
```

---

## 🚀 How to Run the Project

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- Android Studio (for building Android APK)

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:8443` in your browser. Open two tabs/windows to test two-phone P2P communication!

### 4. Build Web Application
```bash
npm run build
```

### 5. Build Installable Android APK
```bash
npm run apk:build
```
Or open the `android/` directory in **Android Studio** and select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

---

## 📁 Project Structure

```text
Build application/
├── android/                   # Native Android platform project (Capacitor)
├── public/                    # Web app manifest and icons
├── src/
│   ├── screens/
│   │   ├── TalkScreen.jsx     # PTT talk interface, live transcript & incoming cards
│   │   ├── ConnectionScreen.jsx # P2P device discovery, pairing & unit selector
│   │   ├── SettingsScreen.jsx # Appearance (Dark/Light), audio & language settings
│   │   └── AlertScreen.jsx    # Emergency priority full-screen alert & acknowledgment
│   ├── services/
│   │   ├── transport.js       # Offline P2P mesh transport abstraction service
│   │   ├── packet.js          # Message packet and ACK creation helpers
│   │   ├── priority.js        # Priority keyword classifier (Normal/Important/Emergency)
│   │   └── speech.js          # STT & TTS local speech synthesis engine
│   ├── App.jsx                # Main application state controller & mobile shell
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles and Tailwind CSS v4 directives
├── capacitor.config.json      # Capacitor Android app configuration
├── vite.config.js             # Vite 8 build configuration
└── package.json               # Project dependencies and build scripts
```

---

## 🔒 Offline & Privacy Guarantee

- Zero internet connection or cloud service dependencies.
- No remote backend servers, Firebase, or WebSockets required.
- All speech recognition and speech synthesis run locally on device hardware.
