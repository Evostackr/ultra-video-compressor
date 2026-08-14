import React from 'react';
import { Video, ShieldCheck, Cpu, HelpCircle, Sparkles } from 'lucide-react';

export default function Header({ isWasmLoaded, engineType, setEngineType, onOpenGuide }) {
  return (
    <header className="app-header">
      <div className="app-container" style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div 
              style={{ 
                background: 'var(--gradient-emerald)', 
                width: '42px', 
                height: '42px', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' 
              }}
            >
              <Video size={24} color="#04120e" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffffff 0%, #d1d5db 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  UltraCompress Video
                </h1>
                <span className="badge-pill badge-emerald">v2.5</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                100% In-Browser Video Compression & Transcoding
              </p>
            </div>
          </div>

          {/* Controls & Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            
            {/* Privacy Badge */}
            <div className="badge-pill badge-cyan" title="Your files are processed locally and never uploaded to any cloud server">
              <ShieldCheck size={14} />
              <span>Zero Cloud Uploads</span>
            </div>

            {/* Engine Selector */}
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'rgba(15, 23, 42, 0.7)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '10px', 
                padding: '3px' 
              }}
            >
              <button
                onClick={() => setEngineType('ffmpeg')}
                style={{
                  background: engineType === 'ffmpeg' ? 'var(--primary-emerald)' : 'transparent',
                  color: engineType === 'ffmpeg' ? '#04120e' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s',
                }}
                title="FFmpeg WASM (Full MP4 H.264/AAC, GIF, resolution & CRF control)"
              >
                <Cpu size={12} />
                <span>FFmpeg WASM</span>
              </button>

              <button
                onClick={() => setEngineType('native')}
                style={{
                  background: engineType === 'native' ? 'var(--primary-cyan)' : 'transparent',
                  color: engineType === 'native' ? '#04120e' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s',
                }}
                title="Fast Native Canvas & MediaRecorder engine (Instant, lightweight)"
              >
                <Sparkles size={12} />
                <span>Fast Native</span>
              </button>
            </div>

            {/* Guide Button */}
            <button className="btn-ghost" onClick={onOpenGuide} title="View Compression Presets & Target Guide">
              <HelpCircle size={18} />
              <span style={{ fontSize: '0.85rem' }}>Presets Guide</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
