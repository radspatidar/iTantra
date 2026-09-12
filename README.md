# iTantra — Offline Mesh Voice Communication App

**Problem Statement ID**: `SIH26173`  
**Application Name**: iTantra  
**Platform**: Browser Web Demo (Live Link Deployment) & Android Native Application (Capacitor APK)  

---

## 📌 Project Overview

**iTantra** is a zero-internet, peer-to-peer voice and text communication application designed for field operations, emergency response, and internet-denied environments. It provides secure, local, multi-language Speech-to-Text (STT) and Text-to-Speech (TTS) communication directly between mobile devices over local Bluetooth Low Energy (BLE) and Wi-Fi Direct mesh protocols without relying on cloud infrastructure, cellular networks, or central servers.

---

## ✨ Key Functionality

- **📱 True Bidirectional Two-Phone Communication**: Phone A and Phone B run the same iTantra application and seamlessly alternate between sender and receiver roles.
- **🎙️ Push-To-Talk (PTT)**: Tap-and-hold voice capture with real-time audio waveform feedback and speech-to-text transcript generation.
- **⚡ Emergency Priority System**: Supports **Normal**, **Important** (amber alert), and **Emergency** (red full-screen override with audio alert and manual acknowledgment) packet priorities.
- **🔄 Instant Acknowledgment & Replay**: Remote receivers can acknowledge emergency alerts with a single tap, returning confirmation to the sender and replaying messages via device-local TTS.
- **🌐 Per-Device Language Selection**: Supports 10 regional Indian languages (Hindi, Marathi, Gujarati, Kannada, Malayalam, Tamil, Telugu, Odia, Bengali, English) configured independently per device.
- **📶 Offline Device Discovery & Handshake**: Automatic scan, discovery, and pairing with nearby iTantra field units over local BLE/Wi-Fi Direct mesh networks.
- **🌗 Light & Dark Theme Support**: Sleek, high-contrast, energy-efficient UI optimized for daylight and dark environment operations.

---

## 🌐 Android Native vs. Web Demo Architecture

| Feature | Android Native Application (APK) | Web Demo (Browser Live Link) |
| :--- | :--- | :--- |
| **Transport Driver** | Hardware BLE & Wi-Fi Direct Mesh | P2P `BroadcastChannel` Mesh |
| **Speech STT Engine** | On-Device Offline STT Pipeline | Web Speech API STT |
| **Speech TTS Engine** | On-Device Local TTS Engine | Web Speech API TTS |
| **Installation** | Sideload `app-debug.apk` | Open Live Link URL in browser |
| **Multi-Device Test** | Connect two Android phones | Open two browser tabs / windows |

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, JavaScript (ES6+), HTML5, CSS3
- **Styling & Icons**: Tailwind CSS v4 (`@tailwindcss/vite`), Custom Micro-Animations
- **Build Tooling**: Vite 8
- **Mobile Container**: Capacitor 8 (`@capacitor/core`, `@capacitor/android`)
- **Offline Mesh Transport**: P2P `BroadcastChannel` & Local Storage Sync Abstraction Layer (compatible with BLE / Wi-Fi Direct hardware drivers)

---

## 🚀 How to Run the Project Locally

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### 2. Install Dependencies & Start Dev Server
```bash
npm install
npm run dev
```
Open `http://localhost:8443` in your browser. Open two browser tabs to test bidirectional two-phone communication!

---

## 📦 How to Build the Web Version

To generate the production web bundle for the **Live Link**:

```bash
npm run build
```

This compiles all assets into the **`dist/`** output directory.

You can preview the production build locally by running:
```bash
npm run preview
```

---

## 🌐 Live Link Web Deployment Instructions

The **`dist/`** directory contains static HTML, JavaScript, CSS, and asset files. It can be deployed to any static web hosting platform in under 2 minutes:

### Option A: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run in project root:
   ```bash
   vercel --prod
   ```
3. Vercel will build and provide your **Live Link URL** (e.g. `https://itantra-demo.vercel.app`).

### Option B: Netlify Drag & Drop
1. Run `npm run build` locally.
2. Go to [Netlify Drop](https://app.netlify.com/drop).
3. Drag and drop the **`dist`** folder directly into the browser window.
4. Netlify will generate your **Live Link URL** instantly!

### Option C: GitHub Pages
1. Push project to your GitHub repository.
2. In Repository Settings > Pages, set source branch to `main` (or deploy `dist/` folder via `gh-pages`).

---

## 📱 How to Build the Installable Android APK

```bash
npm run cap:sync
```
Open the `android/` directory in **Android Studio** and select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

The generated installer will be located at:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📁 Exact Folder to Deploy for Live Link

> **`dist/`** (located at `c:\Users\radsp\Desktop\SIH\Build application\dist`)
