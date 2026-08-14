import React, { useState, useEffect } from 'react';
import { 
  Play, Download, Trash2, SplitSquareVertical, RefreshCw, 
  CheckCircle2, AlertCircle, Loader2, Sparkles, Film, FileVideo 
} from 'lucide-react';
import { formatBytes, formatDuration, calculateSavings } from '../utils/formatters';

export default function VideoItem({ videoItem, onCompress, onRemove, onOpenCompare }) {
  const [thumbnail, setThumbnail] = useState(null);
  const [duration, setDuration] = useState(videoItem.duration || 0);
  const [resolution, setResolution] = useState(videoItem.resolution || '');
  const [isPlayingOutput, setIsPlayingOutput] = useState(false);

  // Generate thumbnail & metadata when video file is added
  useEffect(() => {
    if (videoItem.file && !thumbnail) {
      const url = URL.createObjectURL(videoItem.file);
      const videoNode = document.createElement('video');
      videoNode.preload = 'metadata';
      videoNode.src = url;

      videoNode.onloadedmetadata = () => {
        setDuration(videoNode.duration);
        setResolution(`${videoNode.videoWidth}x${videoNode.videoHeight}`);

        // Capture frame at 1s for thumbnail
        videoNode.currentTime = Math.min(1, videoNode.duration / 2);
      };

      videoNode.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 160;
          canvas.height = 90;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoNode, 0, 0, 160, 90);
          setThumbnail(canvas.toDataURL('image/jpeg'));
          URL.revokeObjectURL(url);
        } catch (e) {
          // ignore CORS/canvas errors
        }
      };
    }
  }, [videoItem.file]);

  const savingsPercent = videoItem.compressedBlob
    ? calculateSavings(videoItem.file.size, videoItem.compressedBlob.size)
    : 0;

  const handleDownload = () => {
    if (!videoItem.compressedBlob) return;
    const url = URL.createObjectURL(videoItem.compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    const ext = videoItem.options?.format || 'mp4';
    const baseName = videoItem.file.name.substring(0, videoItem.file.name.lastIndexOf('.')) || videoItem.file.name;
    a.download = `${baseName}_compressed.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.2rem',
        marginBottom: '1rem',
        borderLeft:
          videoItem.status === 'done'
            ? '4px solid var(--primary-emerald)'
            : videoItem.status === 'processing'
            ? '4px solid var(--primary-cyan)'
            : videoItem.status === 'error'
            ? '4px solid #f43f5e'
            : '4px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* Thumbnail preview */}
        <div
          style={{
            width: '120px',
            height: '75px',
            borderRadius: '10px',
            background: '#040914',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            flexShrink: 0,
            border: '1px solid var(--border-color)',
          }}
        >
          {thumbnail ? (
            <img src={thumbnail} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <FileVideo size={28} color="var(--text-dim)" />
          )}

          {duration > 0 && (
            <span
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                fontSize: '0.65rem',
                padding: '1px 5px',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {formatDuration(duration)}
            </span>
          )}
        </div>

        {/* Video Info */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
            <h4
              style={{
                fontSize: '0.98rem',
                fontWeight: '700',
                color: '#fff',
                maxWidth: '280px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={videoItem.file.name}
            >
              {videoItem.file.name}
            </h4>
            
            <span className="badge-pill badge-gray" style={{ fontSize: '0.7rem' }}>
              {formatBytes(videoItem.file.size)}
            </span>

            {resolution && (
              <span className="badge-pill badge-gray" style={{ fontSize: '0.7rem' }}>
                {resolution}
              </span>
            )}
          </div>

          {/* Status Message or Progress */}
          {videoItem.status === 'queued' && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Ready to compress • Preset: <strong style={{ color: 'var(--primary-emerald)' }}>{videoItem.options.presetId || 'Custom'}</strong>
            </p>
          )}

          {videoItem.status === 'processing' && (
            <div style={{ marginTop: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--primary-cyan)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Loader2 size={13} className="animate-spin" />
                  Compressing with FFmpeg WASM...
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#fff' }}>
                  {videoItem.progress || 0}%
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${videoItem.progress || 0}%`,
                    height: '100%',
                    background: 'var(--gradient-emerald)',
                    borderRadius: '4px',
                    transition: 'width 0.2s ease',
                  }}
                />
              </div>
            </div>
          )}

          {videoItem.status === 'done' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.85rem', fontWeight: '700' }}>
                <CheckCircle2 size={16} />
                <span>Compressed to {formatBytes(videoItem.compressedBlob.size)}</span>
              </div>

              <span className="badge-pill badge-emerald" style={{ fontSize: '0.75rem' }}>
                🎉 {savingsPercent}% Smaller
              </span>
            </div>
          )}

          {videoItem.status === 'error' && (
            <div style={{ color: '#f43f5e', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem' }}>
              <AlertCircle size={15} />
              <span>{videoItem.error || 'Compression failed'}</span>
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          
          {videoItem.status === 'queued' && (
            <button className="btn-primary" onClick={() => onCompress(videoItem.id)}>
              <Sparkles size={15} />
              <span>Compress</span>
            </button>
          )}

          {videoItem.status === 'done' && (
            <>
              <button
                className="btn-secondary"
                onClick={() => onOpenCompare(videoItem)}
                title="Visual Side-by-Side Quality Comparison"
                style={{ borderColor: 'var(--primary-cyan)', color: 'var(--primary-cyan)' }}
              >
                <SplitSquareVertical size={16} />
                <span>Compare</span>
              </button>

              <button className="btn-primary" onClick={handleDownload} title="Download compressed video file">
                <Download size={16} />
                <span>Save</span>
              </button>
            </>
          )}

          {videoItem.status === 'error' && (
            <button className="btn-secondary" onClick={() => onCompress(videoItem.id)}>
              <RefreshCw size={15} />
              <span>Retry</span>
            </button>
          )}

          <button
            className="btn-ghost"
            onClick={() => onRemove(videoItem.id)}
            title="Remove file from list"
            style={{ color: 'var(--text-dim)' }}
          >
            <Trash2 size={18} />
          </button>

        </div>

      </div>

      {/* Embedded Player toggle for completed output */}
      {videoItem.status === 'done' && isPlayingOutput && (
        <div style={{ marginTop: '1rem', background: '#000', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <video
            controls
            autoPlay
            src={URL.createObjectURL(videoItem.compressedBlob)}
            style={{ width: '100%', maxHeight: '360px', display: 'block' }}
          />
        </div>
      )}
    </div>
  );
}
