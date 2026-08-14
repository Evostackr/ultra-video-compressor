/**
 * Native Canvas + MediaRecorder compression engine.
 * Fast client-side fallback with high performance.
 */
export async function compressVideoNative(file, options, onProgress) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = options.muteAudio ? true : false;
    video.playsInline = true;
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = () => {
      let targetWidth = video.videoWidth || 1280;
      let targetHeight = video.videoHeight || 720;

      // Force scale down resolution for compression
      const selectedRes = options.resolution || '720p';
      const resolutionScales = {
        '4k': 3840,
        '1080p': 1920,
        '720p': 1280,
        '480p': 854,
        '360p': 640,
      };

      const maxDim = resolutionScales[selectedRes] || 1280;
      if (targetWidth > maxDim) {
        const ratio = maxDim / targetWidth;
        targetWidth = Math.round(targetWidth * ratio);
        targetHeight = Math.round(targetHeight * ratio);
      }

      // Ensure even width & height for video codecs
      if (targetWidth % 2 !== 0) targetWidth--;
      if (targetHeight % 2 !== 0) targetHeight--;

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      const fps = parseInt(options.fps) || 24;
      const stream = canvas.captureStream(fps);

      // Audio track handling
      let audioContext, mediaElementSource, audioDestination;
      if (!options.muteAudio) {
        try {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          mediaElementSource = audioContext.createMediaElementSource(video);
          audioDestination = audioContext.createMediaStreamDestination();
          mediaElementSource.connect(audioDestination);

          audioDestination.stream.getAudioTracks().forEach((track) => {
            stream.addTrack(track);
          });
        } catch (e) {
          console.warn('Could not capture audio track:', e);
        }
      }

      // Compute strict target bitrate for REAL compression
      const durationSec = video.duration || 10;
      let videoBitrateBps = 750000; // Default 750 Kbps (compact)

      if (options.compressionMode === 'targetSize' && options.targetSizeMB) {
        const totalBits = options.targetSizeMB * 8 * 1024 * 1024;
        videoBitrateBps = Math.max(150000, Math.round(totalBits / durationSec));
      } else {
        // Calculate based on resolution & CRF quality
        const resBitrateMap = {
          '4k': 2500000,
          '1080p': 1200000,
          '720p': 750000,
          '480p': 400000,
          '360p': 250000,
        };
        const baseBitrate = resBitrateMap[selectedRes] || 750000;
        const crf = options.crf || 28;
        const crfFactor = Math.max(0.2, 1 - (crf - 20) * 0.03);
        videoBitrateBps = Math.round(baseBitrate * crfFactor);
      }

      let mimeType = 'video/webm;codecs=vp8';
      if (MediaRecorder.isTypeSupported('video/mp4;codecs=h264')) {
        mimeType = 'video/mp4;codecs=h264';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        mimeType = 'video/webm;codecs=vp9';
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        mimeType = 'video/webm';
      }

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: videoBitrateBps,
      });

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        URL.revokeObjectURL(video.src);
        if (audioContext) audioContext.close();
        const blob = new Blob(chunks, { type: mimeType.split(';')[0] });
        resolve(blob);
      };

      // Trimming logic
      const startTime = options.trimEnabled ? (options.startTime || 0) : 0;
      const endTime = (options.trimEnabled && options.endTime) ? options.endTime : video.duration;
      const totalDuration = Math.max(0.1, endTime - startTime);

      video.currentTime = startTime;

      let animFrameId;
      let isEnding = false;

      const finishRecording = () => {
        if (isEnding) return;
        isEnding = true;
        cancelAnimationFrame(animFrameId);
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      };

      const drawFrame = () => {
        if (video.paused || video.ended || video.currentTime >= endTime) {
          finishRecording();
          return;
        }

        ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

        const elapsedTime = video.currentTime - startTime;
        const progress = Math.min(99, Math.max(0, Math.round((elapsedTime / totalDuration) * 100)));
        onProgress({ percent: progress, time: Math.round(elapsedTime), phase: 'recording' });

        animFrameId = requestAnimationFrame(drawFrame);
      };

      video.onseeked = () => {
        recorder.start(100);
        video.play().then(() => {
          drawFrame();
        }).catch((err) => {
          finishRecording();
        });
      };

      video.onended = finishRecording;

      video.onerror = () => {
        finishRecording();
        reject(new Error('Failed to play video for native compression'));
      };
    };

    video.onerror = (err) => {
      reject(err);
    };
  });
}
