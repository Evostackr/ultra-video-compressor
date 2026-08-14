/**
 * Format bytes to human readable string (KB, MB, GB)
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0 || !bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format seconds into MM:SS or HH:MM:SS format
 */
export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00';
  const secNum = parseInt(seconds, 10);
  const hours = Math.floor(secNum / 3600);
  const minutes = Math.floor((secNum - hours * 3600) / 60);
  const secs = secNum - hours * 3600 - minutes * 60;

  const mStr = minutes < 10 ? '0' + minutes : minutes;
  const sStr = secs < 10 ? '0' + secs : secs;

  if (hours > 0) {
    const hStr = hours < 10 ? '0' + hours : hours;
    return `${hStr}:${mStr}:${sStr}`;
  }
  return `${mStr}:${sStr}`;
}

/**
 * Format bitrate into Kbps or Mbps
 */
export function formatBitrate(bitrateKbps) {
  if (!bitrateKbps || isNaN(bitrateKbps)) return 'Auto';
  if (bitrateKbps >= 1000) {
    return (bitrateKbps / 1000).toFixed(1) + ' Mbps';
  }
  return Math.round(bitrateKbps) + ' Kbps';
}

/**
 * Calculate percentage savings
 */
export function calculateSavings(originalSize, newSize) {
  if (!originalSize || !newSize || originalSize === 0) return 0;
  const ratio = (originalSize - newSize) / originalSize;
  return Math.max(0, Math.round(ratio * 100));
}

/**
 * Generate a unique ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}
