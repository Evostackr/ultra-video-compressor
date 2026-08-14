# 🎬 UltraCompress Video Compressor

> **An official [Evostackr](https://github.com/Evostackr) product, crafted with ❤️ by [@UjwalAnandpro](https://github.com/UjwalAnandpro)**

UltraCompress Video is a modern, high-performance web application built with **React**, **Vite**, **FFmpeg.wasm (WebAssembly)**, and **WebCodecs**. It allows users to compress, downscale, trim, and convert video files locally inside their browser with total privacy and zero server uploads.

---

## ⚡ Product Info & Branding

- **Organization**: [Evostackr](https://github.com/Evostackr)
- **Creator & Lead Developer**: [Ujwal Anand (@UjwalAnandpro)](https://github.com/UjwalAnandpro)
- **Repository**: [https://github.com/Evostackr/ultra-video-compressor](https://github.com/Evostackr/ultra-video-compressor)

---

## ✨ Features

- 🔒 **100% Client-Side Privacy**: All processing happens locally on your device using WebAssembly and canvas pipelines.
- 💬 **Platform Presets**: Pre-configured profiles for **Discord & Email (10MB)**, **WhatsApp (16MB)**, **Balanced Quality (50% reduction)**, **Ultra Compact (75% reduction)**, and **Animated GIF**.
- 🗜️ **Target File Size Calculator**: Set custom output sizes (e.g. 25 MB) and let the engine calculate optimal video bitrates.
- ⚙️ **Fine-Tuned Custom Controls**:
  - Resolution downscaling (4K, 1080p, 720p, 480p, 360p)
  - Frame rate adjustment (60, 30, 24, 15 FPS)
  - H.264 / VP9 CRF Quality slider (18–45)
  - Audio muting and bitrate selection
  - Video Trimming (start/end timestamp cutting)
- 🔍 **Interactive Side-by-Side Split Inspector**: Synchronized video player with draggable split slider to inspect quality retention.
- 📦 **Batch Queue & ZIP Download**: Compress multiple videos at once and export all output files in a single `.zip` archive.
- ⚡ **Dual Processing Engines**:
  - **FFmpeg WASM**: Industry-standard H.264/AAC MP4 & VP9 WebM encoding.
  - **Fast Native Engine**: Hardware-accelerated Canvas & MediaRecorder engine for rapid processing.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm installed.

### Installation

```bash
# Clone the repository
git clone https://github.com/Evostackr/ultra-video-compressor.git
cd ultra-video-compressor

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 6
- **Video Engine**: `@ffmpeg/ffmpeg` 0.12, `@ffmpeg/util`, WebCodecs
- **Styling**: Vanilla CSS (Custom Glassmorphism Design System)
- **Icons**: Lucide React
- **Exporting**: JSZip, Canvas Confetti

---

## 👨‍💻 Credits & License

Created and maintained by **[Evostackr](https://github.com/Evostackr)** • Made by **[Ujwal Anand (@UjwalAnandpro)](https://github.com/UjwalAnandpro)**.

MIT License.
