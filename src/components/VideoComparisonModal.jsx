import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, SplitSquareVertical, Sparkles, FileVideo, CheckCircle2 } from 'lucide-react';
import { formatBytes, calculateSavings } from '../utils/formatters';

export default function VideoComparisonModal({ videoItem, onClose }) {
  if (!videoItem || !videoItem.compressedBlob) return null;

  const [sliderPos, setSliderPos] = useState(50); // percentage
  const [isPlaying, setIsPlaying] = useState(true);
  const [origUrl, setOrigUrl] = useState('');
  const [compUrl, setCompUrl] = useState('');

  const containerRef = useRef(null);
  const origVideoRef = useRef(null);
  const compVideoRef = useRef(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const origBlobUrl = URL.createObjectURL(videoItem.file);
    const compBlobUrl = URL.createObjectURL(videoItem.compressedBlob);
    setOrigUrl(origBlobUrl);
    setCompUrl(compBlobUrl);

    return () => {
      URL.revokeObjectURL(origBlobUrl);
      URL.revokeObjectURL(compBlobUrl);
    };
  }, [videoItem]);

  // Synchronize playback between original and compressed video
  const togglePlay = () => {
    if (!origVideoRef.current || !compVideoRef.current) return;
    if (isPlaying) {
      origVideoRef.current.pause();
      compVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      origVideoRef.current.play();
      compVideoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    if (!origVideoRef.current || !compVideoRef.current) return;
    const time = parseFloat(e.target.value);
    origVideoRef.current.currentTime = time;
    compVideoRef.current.currentTime = time;
  };

  // Draggable slider handler
  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const savingsPercent = calculateSavings(videoItem.file.size, videoItem.compressedBlob.size);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(4, 9, 20, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '1000px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.8)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <SplitSquareVertical size={20} color="var(--primary-cyan)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>Side-by-Side Quality Inspector</h3>
            <span className="badge-pill badge-emerald">🎉 {savingsPercent}% Saved</span>
          </div>

          <button className="btn-ghost" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Comparison Stats Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.8rem 1.5rem',
            background: 'rgba(9, 13, 22, 0.9)',
            fontSize: '0.82rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ color: 'var(--text-muted)' }}>
            Original: <strong style={{ color: '#fff' }}>{formatBytes(videoItem.file.size)}</strong>
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            Drag handle left/right to compare pixel clarity
          </div>
          <div style={{ color: 'var(--text-muted)' }}>
            Compressed: <strong style={{ color: 'var(--primary-emerald)' }}>{formatBytes(videoItem.compressedBlob.size)}</strong>
          </div>
        </div>

        {/* Split Video Container */}
        <div
          ref={containerRef}
          className="split-slider-container"
          style={{ flex: 1, minHeight: '380px', position: 'relative', background: '#000', cursor: 'ew-resize' }}
          onMouseDown={handleMouseDown}
          onTouchMove={handleTouchMove}
        >
          {/* Compressed Video (Full Base) */}
          <video
            ref={compVideoRef}
            src={compUrl}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />

          {/* Original Video (Clipped Overlay) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: `${sliderPos}%`,
              overflow: 'hidden',
              borderRight: '2px solid var(--primary-emerald)',
            }}
          >
            <video
              ref={origVideoRef}
              src={origUrl}
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: containerRef.current?.clientWidth || '1000px',
                height: '100%',
                objectFit: 'contain',
                maxWidth: 'none',
              }}
            />
          </div>

          {/* Draggable Divider Handle */}
          <div
            className="split-slider-divider"
            style={{ left: `${sliderPos}%` }}
            onMouseDown={handleMouseDown}
          >
            <div className="split-slider-handle">
              <SplitSquareVertical size={16} />
            </div>
          </div>

          {/* Side Overlay Labels */}
          <div style={{ position: 'absolute', top: '15px', left: '15px', pointerEvents: 'none' }}>
            <span className="badge-pill badge-gray" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
              Original
            </span>
          </div>

          <div style={{ position: 'absolute', top: '15px', right: '15px', pointerEvents: 'none' }}>
            <span className="badge-pill badge-emerald" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
              Compressed ({videoItem.options.format?.toUpperCase() || 'MP4'})
            </span>
          </div>

        </div>

        {/* Synchronized Controls Bar */}
        <div
          style={{
            padding: '0.8rem 1.5rem',
            background: 'rgba(15, 23, 42, 0.9)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <button className="btn-primary" onClick={togglePlay} style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <input
            type="range"
            min="0"
            max={origVideoRef.current?.duration || 100}
            step="0.1"
            onChange={handleSeek}
            style={{ flex: 1 }}
          />
        </div>

      </div>
    </div>
  );
}
