import React, { useRef, useState } from 'react';
import { UploadCloud, Film, PlayCircle, FileVideo, Sparkles } from 'lucide-react';

export default function DropZone({ onFilesSelected, onAddDemoVideo }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('video/') || /\.(mp4|mov|webm|avi|mkv|flv|wmv|m4v|3gp)$/i.test(file.name)
      );
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className="glass-panel"
      style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        cursor: 'pointer',
        border: isDragOver ? '2px dashed var(--primary-emerald)' : '2px dashed rgba(255, 255, 255, 0.15)',
        background: isDragOver ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-card)',
        transform: isDragOver ? 'scale(1.01)' : 'scale(1)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="video/*,.mp4,.mov,.webm,.avi,.mkv,.flv,.wmv,.m4v,.3gp"
        style={{ display: 'none' }}
      />

      {/* Decorative Glow */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '-50%', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '300px', 
          height: '200px', 
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} 
      />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 10 }}>
        
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '20px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-emerald)',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.2)',
          }}
        >
          <UploadCloud size={34} />
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.4rem', color: '#f3f4f6' }}>
            Drag & Drop Video Files Here
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Supports MP4, MOV, WebM, AVI, MKV, FLV & more • Batch processing ready
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <FileVideo size={16} />
            <span>Browse Videos</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={(e) => {
              e.stopPropagation();
              onAddDemoVideo();
            }}
            title="Try instant compression with a sample test video"
          >
            <Sparkles size={15} color="var(--primary-cyan)" />
            <span>Try Sample Video</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
          <span>🔒 100% Private (No Uploads)</span>
          <span>⚡ Hardware Accelerated</span>
          <span>📦 Batch Compression</span>
        </div>

      </div>
    </div>
  );
}
