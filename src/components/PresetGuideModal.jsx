import React from 'react';
import { X, HelpCircle, MessageSquare, Smartphone, Mail, Info, CheckCircle2 } from 'lucide-react';

export default function PresetGuideModal({ onClose }) {
  const platforms = [
    {
      name: 'Discord (Free)',
      limit: '10 MB',
      icon: MessageSquare,
      color: '#5865F2',
      tip: 'Use 720p or 480p with Target Size preset (9.5 MB) for instant sharing.',
    },
    {
      name: 'WhatsApp / Telegram',
      limit: '16 MB / 2 GB',
      icon: Smartphone,
      color: '#25D366',
      tip: 'WhatsApp clips work best under 16 MB with MP4 H.264 format.',
    },
    {
      name: 'Email (Gmail/Outlook)',
      limit: '25 MB',
      icon: Mail,
      color: '#EA4335',
      tip: 'Compress videos under 24 MB to send directly in email attachments.',
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(4, 9, 20, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '650px',
          padding: '1.8rem',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HelpCircle size={22} color="var(--primary-emerald)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Compression & Platform Guide</h3>
          </div>
          <button className="btn-ghost" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {platforms.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: `${p.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: p.color,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: '700' }}>{p.name}</h4>
                    <span className="badge-pill badge-cyan" style={{ fontSize: '0.7rem' }}>
                      {p.limit}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{p.tip}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-emerald)', fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            <Info size={16} />
            <span>Pro Compression Tips:</span>
          </div>
          <ul style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '1.2rem' }}>
            <li><strong>720p Resolution</strong> offers 60-70% size reduction with almost no noticeable quality difference on mobile screens.</li>
            <li><strong>CRF 28</strong> is the default sweet spot for H.264 video encoding. Lower CRF = higher visual quality, higher CRF = smaller file size.</li>
            <li><strong>Muting Audio</strong> saves an extra 100-200 KB per minute if background audio isn't needed.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
