import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpegInstance = null;
let isLoading = false;
let loadPromise = null;

/**
 * Initialize and load FFmpeg WASM core
 */
export async function getFFmpegInstance(onLog = null) {
  if (ffmpegInstance && ffmpegInstance.loaded) {
    return ffmpegInstance;
  }

  if (isLoading && loadPromise) {
    await loadPromise;
    return ffmpegInstance;
  }

  isLoading = true;
  loadPromise = (async () => {
    const ffmpeg = new FFmpeg();

    if (onLog) {
      ffmpeg.on('log', ({ message }) => {
        onLog(message);
      });
    }

    try {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
    } catch (err) {
      console.warn('Failed loading CDN ESM core, trying fallback load...', err);
      try {
        await ffmpeg.load();
      } catch (err2) {
        console.error('FFmpeg load error:', err2);
        throw err2;
      }
    }

    ffmpegInstance = ffmpeg;
    isLoading = false;
    return ffmpeg;
  })();

  return loadPromise;
}

/**
 * Calculate recommended video bitrate for a target file size in MB
 */
export function calculateBitrateForTargetSize(targetMB, durationSec, audioBitrateKbps = 96) {
  if (!targetMB || !durationSec || durationSec <= 0) return 800; // fallback 800kbps
  const totalBits = targetMB * 8 * 1024 * 1024; // bits
  const totalBitrateKbps = (totalBits / durationSec) / 1000;
  
  // Subtract audio bitrate
  const videoBitrateKbps = Math.max(100, Math.round(totalBitrateKbps - audioBitrateKbps));
  return videoBitrateKbps;
}

/**
 * Build FFmpeg CLI arguments for real, efficient video compression
 */
export function buildFFmpegArgs(options, inputFileName, outputFileName, durationSec = 0) {
  const args = ['-i', inputFileName];

  // 1. Video Trimming
  if (options.trimEnabled) {
    if (options.startTime > 0) {
      args.push('-ss', options.startTime.toString());
    }
    if (options.endTime && options.endTime > (options.startTime || 0)) {
      args.push('-to', options.endTime.toString());
    }
  }

  const format = options.format || 'mp4';

  if (format === 'gif') {
    let scaleFilter = 'scale=480:-2';
    if (options.resolution && options.resolution !== 'original') {
      const scaleMap = {
        '1080p': 'scale=1920:-2',
        '720p': 'scale=1280:-2',
        '480p': 'scale=480:-2',
        '360p': 'scale=360:-2',
      };
      scaleFilter = scaleMap[options.resolution] || 'scale=480:-2';
    }

    const fpsFilter = options.fps ? `fps=${options.fps}` : 'fps=12';

    args.push(
      '-vf',
      `${scaleFilter},${fpsFilter},split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
      '-loop',
      '0',
      outputFileName
    );
    return args;
  }

  // Video Codecs
  if (format === 'webm') {
    args.push('-c:v', 'libvpx-vp9');
  } else if (format === 'mp4' || format === 'mov') {
    args.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p');
  }

  // Preset speed for fast WASM encoding
  args.push('-preset', 'ultrafast');

  // Video Filters: Downscale resolution for real size reduction
  const filters = [];

  const selectedRes = options.resolution || '720p';
  if (selectedRes !== 'original') {
    const scaleMap = {
      '4k': "scale='min(3840,iw)':-2",
      '1080p': "scale='min(1920,iw)':-2",
      '720p': "scale='min(1280,iw)':-2",
      '480p': "scale='min(854,iw)':-2",
      '360p': "scale='min(640,iw)':-2",
    };
    filters.push(scaleMap[selectedRes] || "scale='min(1280,iw)':-2");
  }

  if (options.fps && options.fps !== 'original') {
    filters.push(`fps=${options.fps}`);
  }

  if (filters.length > 0) {
    args.push('-vf', filters.join(','));
  }

  // Bitrate vs CRF
  let videoBitrate = options.videoBitrate;
  if (options.compressionMode === 'targetSize' && options.targetSizeMB) {
    const effectiveDuration = (options.trimEnabled && options.endTime) 
      ? (options.endTime - (options.startTime || 0)) 
      : durationSec;
    const calcBitrate = calculateBitrateForTargetSize(options.targetSizeMB, effectiveDuration, options.muteAudio ? 0 : 96);
    if (calcBitrate) videoBitrate = calcBitrate;
  }

  if (videoBitrate) {
    args.push('-b:v', `${videoBitrate}k`, '-maxrate', `${Math.round(videoBitrate * 1.4)}k`, '-bufsize', `${Math.round(videoBitrate * 2)}k`);
  } else {
    // Default CRF value for real 50-70% size reduction
    const crfValue = options.crf || 28;
    args.push('-crf', crfValue.toString());
  }

  // Audio settings
  if (options.muteAudio) {
    args.push('-an');
  } else {
    if (format === 'webm') {
      args.push('-c:a', 'libopus');
    } else {
      args.push('-c:a', 'aac');
    }
    
    if (options.audioBitrate) {
      args.push('-b:a', `${options.audioBitrate}k`);
    } else {
      args.push('-b:a', '96k');
    }
  }

  if (format === 'mp4') {
    args.push('-movflags', '+faststart');
  }

  args.push(outputFileName);
  return args;
}

/**
 * Main function to compress a video file using FFmpeg WASM
 */
export async function compressVideoFFmpeg(file, options, onProgress) {
  const ffmpeg = await getFFmpegInstance();

  const inputExt = file.name.split('.').pop().toLowerCase() || 'mp4';
  const outExt = options.format || 'mp4';
  const inputFileName = `input_${Date.now()}.${inputExt}`;
  const outputFileName = `output_${Date.now()}.${outExt}`;

  // Write video input file into WASM memory virtual FS
  const fileData = await fetchFile(file);
  await ffmpeg.writeFile(inputFileName, fileData);

  // Set up progress handler
  const progressHandler = ({ progress, time }) => {
    let p = Math.min(100, Math.max(0, Math.round(progress * 100)));
    if (isNaN(p)) p = 0;
    
    onProgress({
      percent: p,
      time: time ? Math.round(time / 1000000) : 0,
      phase: 'processing',
    });
  };

  ffmpeg.on('progress', progressHandler);

  const args = buildFFmpegArgs(options, inputFileName, outputFileName, options.videoDuration || 0);

  try {
    await ffmpeg.exec(args);

    // Read compressed file from WASM FS
    const data = await ffmpeg.readFile(outputFileName);

    // Clean up WASM filesystem
    try {
      await ffmpeg.deleteFile(inputFileName);
      await ffmpeg.deleteFile(outputFileName);
    } catch (e) {
      // ignore cleanup
    }

    ffmpeg.off('progress', progressHandler);

    const mimeTypes = {
      mp4: 'video/mp4',
      webm: 'video/webm',
      gif: 'image/gif',
      mov: 'video/quicktime',
      avi: 'video/x-msvideo',
    };

    const blob = new Blob([data.buffer], { type: mimeTypes[outExt] || 'video/mp4' });
    return blob;
  } catch (err) {
    ffmpeg.off('progress', progressHandler);
    console.error('FFmpeg execution error:', err);
    throw err;
  }
}
