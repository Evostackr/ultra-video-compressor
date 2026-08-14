import React from 'react';
import JSZip from 'jszip';
import { Play, Download, Trash2, Archive, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import VideoItem from './VideoItem';
import { formatBytes, calculateSavings } from '../utils/formatters';

export default function VideoList({ videos, onCompress, onCompressAll, onRemove, onClearAll, onOpenCompare }) {
  if (!videos || videos.length === 0) return null;

  const queuedCount = videos.filter((v) => v.status === 'queued').length;
  const doneVideos = videos.filter((v) => v.status === 'done');

  // Calculate totals
  const totalOriginalBytes = videos.reduce((acc, v) => acc + (v.file?.size || 0), 0);
  const totalCompressedBytes = doneVideos.reduce((acc, v) => acc + (v.compressedBlob?.size || 0), 0);
  const overallSavingsPercent = doneVideos.length > 0
    ? calculateSavings(
        doneVideos.reduce((acc, v) => acc + (v.file?.size || 0), 0),
        totalCompressedBytes
      )
    : 0;

  // Export all completed files into a zip archive
  const handleDownloadAllZip = async () => {
    if (doneVideos.length === 0) return;
    const zip = new JSZip();

    doneVideos.forEach((v, idx) => {
      const ext = v.options?.format || 'mp4';
      const baseName = v.file.name.substring(0, v.file.name.lastIndexOf('.')) || v.file.name;
      const fileName = `${baseName}_compressed_${idx + 1}.${ext}`;
      zip.file(fileName, v.compressedBlob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_videos_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      
      {/* Batch Summary Header Bar */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '1.2rem 1.5rem', 
          marginBottom: '1.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '1rem',
          background: 'linear-gradient(135deg, rgba(18, 26, 44, 0.9) 0%, rgba(9, 13, 22, 0.9) 100%)',
        }}
      >
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Layers size={20} color="var(--primary-emerald)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Processing Queue ({videos.length})</h3>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.82rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              Original: <strong style={{ color: '#fff' }}>{formatBytes(totalOriginalBytes)}</strong>
            </span>

            {doneVideos.length > 0 && (
              <>
                <span style={{ color: 'var(--text-muted)' }}>
                  Compressed: <strong style={{ color: 'var(--primary-emerald)' }}>{formatBytes(totalCompressedBytes)}</strong>
                </span>

                <span className="badge-pill badge-emerald">
                  Total Saved: {overallSavingsPercent}%
                </span>
              </>
            )}
          </div>
        </div>

        {/* Bulk Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          
          {queuedCount > 0 && (
            <button className="btn-primary" onClick={onCompressAll}>
              <Sparkles size={16} />
              <span>Compress All ({queuedCount})</span>
            </button>
          )}

          {doneVideos.length > 0 && (
            <button className="btn-secondary" onClick={handleDownloadAllZip} style={{ borderColor: 'var(--primary-cyan)', color: 'var(--primary-cyan)' }}>
              <Archive size={16} />
              <span>Download ZIP ({doneVideos.length})</span>
            </button>
          )}

          <button className="btn-ghost" onClick={onClearAll} title="Clear all videos from queue">
            <Trash2 size={16} />
            <span>Clear Queue</span>
          </button>
        </div>

      </div>

      {/* Video Items Stack */}
      <div>
        {videos.map((videoItem) => (
          <VideoItem
            key={videoItem.id}
            videoItem={videoItem}
            onCompress={onCompress}
            onRemove={onRemove}
            onOpenCompare={onOpenCompare}
          />
        ))}
      </div>

    </div>
  );
}
