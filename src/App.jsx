import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import DropZone from './components/DropZone';
import CompressionControls from './components/CompressionControls';
import VideoList from './components/VideoList';
import VideoComparisonModal from './components/VideoComparisonModal';
import PresetGuideModal from './components/PresetGuideModal';

import { compressVideoFFmpeg } from './utils/ffmpegHelper';
import { compressVideoNative } from './utils/fastCompressorEngine';
import { generateId } from './utils/formatters';

export default function App() {
  const [videos, setVideos] = useState([]);
  const [engineType, setEngineType] = useState('ffmpeg'); // 'ffmpeg' or 'native'
  const [compareVideoItem, setCompareVideoItem] = useState(null);
  const [showGuide, setShowGuide] = useState(false);

  const [globalOptions, setGlobalOptions] = useState({
    presetId: 'balanced',
    compressionMode: 'quality',
    crf: 28,
    resolution: '1080p',
    fps: 'original',
    format: 'mp4',
    targetSizeMB: 10,
    muteAudio: false,
    speed: 'superfast',
    trimEnabled: false,
    startTime: 0,
    endTime: 0,
  });

  // Handle files added via Drag & Drop or Browse
  const handleFilesSelected = (files) => {
    const newItems = files.map((file) => ({
      id: generateId(),
      file,
      status: 'queued', // queued | processing | done | error
      progress: 0,
      compressedBlob: null,
      options: { ...globalOptions },
      error: null,
    }));

    setVideos((prev) => [...prev, ...newItems]);
  };

  // Generate synthetic sample test video for instant demo testing
  const handleAddDemoVideo = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const file = new File([blob], 'sample_demo_720p.webm', { type: 'video/webm' });
      handleFilesSelected([file]);
    };

    recorder.start();

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      // Draw dynamic animated test pattern
      ctx.fillStyle = `#${Math.floor(Math.sin(frame * 0.05) * 16777215).toString(16).padStart(6, '0')}`;
      ctx.fillRect(0, 0, 1280, 720);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('UltraCompress Demo Video', 640, 320);
      ctx.font = '32px sans-serif';
      ctx.fillText(`Frame: ${frame} | 720p 30fps`, 640, 400);

      if (frame >= 90) { // 3 second demo clip
        clearInterval(interval);
        recorder.stop();
      }
    }, 33);
  };

  // Compress a single video item by ID
  const handleCompressSingle = async (id) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'processing', progress: 0, error: null } : v))
    );

    const targetVideo = videos.find((v) => v.id === id);
    if (!targetVideo) return;

    try {
      let compressedBlob;
      const onProgress = ({ percent }) => {
        setVideos((prev) =>
          prev.map((v) => (v.id === id ? { ...v, progress: percent } : v))
        );
      };

      if (engineType === 'ffmpeg') {
        compressedBlob = await compressVideoFFmpeg(targetVideo.file, targetVideo.options, onProgress);
      } else {
        compressedBlob = await compressVideoNative(targetVideo.file, targetVideo.options, onProgress);
      }

      setVideos((prev) =>
        prev.map((v) =>
          v.id === id
            ? { ...v, status: 'done', progress: 100, compressedBlob }
            : v
        )
      );

      // Trigger celebrate confetti
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore
      }

    } catch (err) {
      console.error('Compression failed:', err);
      setVideos((prev) =>
        prev.map((v) =>
          v.id === id
            ? { ...v, status: 'error', error: err.message || 'Compression error occurred' }
            : v
        )
      );
    }
  };

  // Compress all queued videos sequentially
  const handleCompressAll = async () => {
    const queued = videos.filter((v) => v.status === 'queued');
    for (const item of queued) {
      await handleCompressSingle(item.id);
    }
  };

  // Remove video item
  const handleRemove = (id) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  // Clear queue
  const handleClearAll = () => {
    setVideos([]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* App Header */}
      <Header
        engineType={engineType}
        setEngineType={setEngineType}
        onOpenGuide={() => setShowGuide(true)}
      />

      {/* Main Content Area */}
      <main className="app-container" style={{ flex: 1 }}>
        
        {/* Compression Options Selector */}
        <CompressionControls
          options={globalOptions}
          setOptions={setGlobalOptions}
          selectedVideoDuration={videos[0]?.duration}
        />

        {/* Drag and Drop Zone */}
        <DropZone
          onFilesSelected={handleFilesSelected}
          onAddDemoVideo={handleAddDemoVideo}
        />

        {/* Video Queue & Batch Summary */}
        <VideoList
          videos={videos}
          onCompress={handleCompressSingle}
          onCompressAll={handleCompressAll}
          onRemove={handleRemove}
          onClearAll={handleClearAll}
          onOpenCompare={setCompareVideoItem}
        />

      </main>

      {/* Modals */}
      {compareVideoItem && (
        <VideoComparisonModal
          videoItem={compareVideoItem}
          onClose={() => setCompareVideoItem(null)}
        />
      )}

      {showGuide && (
        <PresetGuideModal onClose={() => setShowGuide(false)} />
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '3rem' }}>
        <p>UltraCompress Video • 100% Client-Side Private Video Processing • Powered by FFmpeg.wasm & WebCodecs</p>
      </footer>

    </div>
  );
}
