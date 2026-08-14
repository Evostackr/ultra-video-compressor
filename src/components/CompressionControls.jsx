import React, { useState } from 'react';
import { Sliders, MessageSquare, Smartphone, Zap, Archive, Image, Settings, Scissors, Volume2, VolumeX, Gauge, Film } from 'lucide-react';

export default function CompressionControls({ options, setOptions, selectedVideoDuration }) {
  const [showCustom, setShowCustom] = useState(false);

  const presets = [
    {
      id: 'discord',
      title: 'Discord & Email',
      badge: '10 MB Limit',
      icon: MessageSquare,
      color: 'var(--primary-cyan)',
      desc: 'Fits email attachments & Discord free uploads',
      config: {
        presetId: 'discord',
        compressionMode: 'targetSize',
        targetSizeMB: 9.5,
        resolution: '720p',
        fps: '30',
        format: 'mp4',
        muteAudio: false,
        speed: 'superfast',
      },
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp & Mobile',
      badge: '16 MB Limit',
      icon: Smartphone,
      color: '#34d399',
      desc: 'Ideal for WhatsApp, Telegram & mobile sharing',
      config: {
        presetId: 'whatsapp',
        compressionMode: 'targetSize',
        targetSizeMB: 15.5,
        resolution: '720p',
        fps: '30',
        format: 'mp4',
        muteAudio: false,
        speed: 'superfast',
      },
    },
    {
      id: 'balanced',
      title: 'Balanced Quality',
      badge: '~50% Reduction',
      icon: Zap,
      color: 'var(--primary-emerald)',
      desc: 'Optimal balance between video clarity & file size',
      config: {
        presetId: 'balanced',
        compressionMode: 'quality',
        crf: 28,
        resolution: '1080p',
        fps: 'original',
        format: 'mp4',
        muteAudio: false,
        speed: 'superfast',
      },
    },
    {
      id: 'compact',
      title: 'Ultra Compact',
      badge: '~75% Saved',
      icon: Archive,
      color: '#c084fc',
      desc: 'Maximum file size reduction for long videos',
      config: {
        presetId: 'compact',
        compressionMode: 'quality',
        crf: 34,
        resolution: '480p',
        fps: '24',
        format: 'mp4',
        muteAudio: false,
        speed: 'superfast',
      },
    },
    {
      id: 'gif',
      title: 'Animated GIF',
      badge: 'Looping GIF',
      icon: Image,
      color: '#f43f5e',
      desc: 'Turn video clips into shareable animated GIFs',
      config: {
        presetId: 'gif',
        compressionMode: 'quality',
        resolution: '480p',
        fps: '15',
        format: 'gif',
        muteAudio: true,
        speed: 'fast',
      },
    },
  ];

  const handleSelectPreset = (preset) => {
    setShowCustom(false);
    setOptions({
      ...options,
      ...preset.config,
    });
  };

  const updateOption = (key, value) => {
    setOptions((prev) => ({
      ...prev,
      presetId: 'custom',
      [key]: value,
    }));
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sliders size={20} color="var(--primary-emerald)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Compression Presets & Settings</h3>
        </div>

        <button
          className={`btn-ghost ${showCustom ? 'active' : ''}`}
          onClick={() => setShowCustom(!showCustom)}
          style={{ fontSize: '0.85rem', color: showCustom ? 'var(--primary-emerald)' : 'var(--text-muted)' }}
        >
          <Settings size={15} />
          <span>{showCustom ? 'Hide Advanced Options' : 'Custom Options'}</span>
        </button>
      </div>

      {/* Preset Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem', marginBottom: '1.2rem' }}>
        {presets.map((preset) => {
          const Icon = preset.icon;
          const isSelected = options.presetId === preset.id && !showCustom;
          return (
            <div
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`preset-card ${isSelected ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <Icon size={20} color={preset.color} />
                <span className="badge-pill badge-gray" style={{ fontSize: '0.7rem' }}>
                  {preset.badge}
                </span>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.2rem' }}>{preset.title}</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>{preset.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Target File Size Slider Bar */}
      {options.compressionMode === 'targetSize' && (
        <div 
          style={{ 
            background: 'rgba(6, 182, 212, 0.08)', 
            border: '1px solid rgba(6, 182, 212, 0.25)', 
            borderRadius: '12px', 
            padding: '1rem 1.2rem',
            marginBottom: '1.2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Gauge size={16} color="var(--primary-cyan)" />
              <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>Target Maximum Output Size:</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-cyan)' }}>
              {options.targetSizeMB || 10} MB
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="100"
            step="0.5"
            value={options.targetSizeMB || 10}
            onChange={(e) => updateOption('targetSizeMB', parseFloat(e.target.value))}
            style={{ marginBottom: '0.4rem' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            <span>1 MB (Tiny)</span>
            <span>10 MB (Discord/Email)</span>
            <span>25 MB (Gmail limit)</span>
            <span>100 MB</span>
          </div>
        </div>
      )}

      {/* Advanced Custom Drawer */}
      {(showCustom || options.presetId === 'custom') && (
        <div 
          style={{ 
            background: 'rgba(15, 23, 42, 0.5)', 
            border: '1px solid var(--border-color)', 
            borderRadius: '14px', 
            padding: '1.2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            marginTop: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: '700' }}>
            <Settings size={16} color="var(--primary-emerald)" />
            <span>Fine-Tuned Video Settings</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
            
            {/* Resolution Selector */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Resolution Downscale
              </label>
              <select
                value={options.resolution || 'original'}
                onChange={(e) => updateOption('resolution', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.8rem',
                  borderRadius: '8px',
                  background: 'rgba(9, 13, 22, 0.8)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              >
                <option value="original">Original Resolution</option>
                <option value="4k">4K Ultra HD (2160p)</option>
                <option value="1080p">1080p Full HD</option>
                <option value="720p">720p HD (Recommended)</option>
                <option value="480p">480p SD (Compact)</option>
                <option value="360p">360p Mobile</option>
              </select>
            </div>

            {/* Frame Rate */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Frame Rate (FPS)
              </label>
              <select
                value={options.fps || 'original'}
                onChange={(e) => updateOption('fps', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.8rem',
                  borderRadius: '8px',
                  background: 'rgba(9, 13, 22, 0.8)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              >
                <option value="original">Original Frame Rate</option>
                <option value="60">60 FPS</option>
                <option value="30">30 FPS</option>
                <option value="24">24 FPS (Cinematic)</option>
                <option value="15">15 FPS (Compact/GIF)</option>
              </select>
            </div>

            {/* Output Format Container */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Output Container / Format
              </label>
              <select
                value={options.format || 'mp4'}
                onChange={(e) => updateOption('format', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.8rem',
                  borderRadius: '8px',
                  background: 'rgba(9, 13, 22, 0.8)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              >
                <option value="mp4">MP4 (H.264 / Universal)</option>
                <option value="webm">WebM (VP9 / Web Native)</option>
                <option value="gif">GIF (Animated Graphics)</option>
                <option value="mov">MOV (QuickTime)</option>
                <option value="avi">AVI (Video)</option>
              </select>
            </div>

          </div>

          {/* Quality CRF Slider */}
          {options.format !== 'gif' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>CRF Quality Factor (H.264/VP9)</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-emerald)', fontWeight: '700' }}>
                  CRF {options.crf || 28} ({options.crf < 23 ? 'High Quality' : options.crf > 32 ? 'High Compression' : 'Balanced'})
                </span>
              </div>
              <input
                type="range"
                min="18"
                max="45"
                step="1"
                value={options.crf || 28}
                onChange={(e) => updateOption('crf', parseInt(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
                <span>18 (Higher Quality, Bigger Size)</span>
                <span>28 (Balanced Default)</span>
                <span>45 (Lowest Size)</span>
              </div>
            </div>
          )}

          {/* Audio & Trimming Toggle Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            
            {/* Audio Mute Checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
              <input
                type="checkbox"
                checked={options.muteAudio || false}
                onChange={(e) => updateOption('muteAudio', e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary-emerald)' }}
              />
              {options.muteAudio ? <VolumeX size={16} color="#f43f5e" /> : <Volume2 size={16} color="var(--primary-emerald)" />}
              <span>Mute Audio Track</span>
            </label>

            {/* Video Trimmer Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
              <input
                type="checkbox"
                checked={options.trimEnabled || false}
                onChange={(e) => updateOption('trimEnabled', e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary-emerald)' }}
              />
              <Scissors size={16} color="var(--primary-cyan)" />
              <span>Enable Trim / Cut Video</span>
            </label>

          </div>

          {/* Trimmer Sliders */}
          {options.trimEnabled && (
            <div style={{ background: 'rgba(9, 13, 22, 0.7)', borderRadius: '10px', padding: '0.8rem 1rem', border: '1px dashed var(--border-color)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', fontWeight: '700', marginBottom: '0.5rem' }}>
                ✂️ Trim Timestamps (Seconds)
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '130px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Start Time (sec):</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={options.startTime || 0}
                    onChange={(e) => updateOption('startTime', parseFloat(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '6px',
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid var(--border-color)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                </div>
                <div style={{ flex: '1', minWidth: '130px' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>End Time (sec):</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={options.endTime || (selectedVideoDuration ? Math.round(selectedVideoDuration) : 60)}
                    onChange={(e) => updateOption('endTime', parseFloat(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '6px',
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid var(--border-color)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
