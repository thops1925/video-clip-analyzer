import React from 'react';
import axios from 'axios';

function ClipsList({ sessionId, clips, videoDuration, onDeleteSession }) {
  const handleDownloadClip = (clipId) => {
    window.location.href = `/api/videos/download/${sessionId}/${clipId}`;
  };

  const handleDownloadAll = () => {
    window.location.href = `/api/videos/download-all/${sessionId}`;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeIcon = (type) => {
    const icons = {
      scene_change: '🎬',
      motion: '⚡',
      face_detection: '👤',
      sound_spike: '🔊'
    };
    return icons[type] || '📹';
  };

  if (clips.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <div className="empty-state-text">Processing Video...</div>
          <div className="empty-state-subtext">
            Analyzing video and generating clips. This may take a moment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ marginBottom: '5px' }}>📊 Found {clips.length} Highlights</h2>
          <p style={{ color: '#999', fontSize: '0.9em' }}>
            Video Duration: {formatTime(videoDuration)}
          </p>
        </div>
        <div className="download-all">
          <button className="btn btn-primary" onClick={handleDownloadAll}>
            ⬇️ Download All
          </button>
        </div>
      </div>

      <div className="clips-grid">
        {clips.map((clip) => (
          <div key={clip.id} className="clip-card">
            <div className="clip-thumbnail">
              {getTypeIcon(clip.type)}
            </div>
            
            <div className="clip-info">
              <div className="clip-title">
                Highlight #{clips.indexOf(clip) + 1}
              </div>
              <div className="clip-badge">{clip.type}</div>
              
              <div className="clip-details">
                <div className="clip-detail">
                  <span className="clip-detail-label">Start Time</span>
                  <span className="clip-detail-value">{formatTime(clip.timestamp)}</span>
                </div>
                <div className="clip-detail">
                  <span className="clip-detail-label">Duration</span>
                  <span className="clip-detail-value">{formatTime(clip.duration)}</span>
                </div>
                <div className="clip-detail">
                  <span className="clip-detail-label">Confidence</span>
                  <span className="clip-detail-value">{(clip.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
              
              <div style={{ fontSize: '0.85em', color: '#999', marginBottom: '15px' }}>
                Size: {clip.size}
              </div>
            </div>

            <div className="clip-actions">
              <button
                className="btn btn-primary"
                onClick={() => handleDownloadClip(clip.id)}
              >
                ⬇️ Download
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const text = `Highlight at ${formatTime(clip.timestamp)} - ${formatTime(clip.duration)} duration - ${(clip.confidence * 100).toFixed(0)}% confidence`;
                  navigator.clipboard.writeText(text);
                  alert('Clip info copied!');
                }}
              >
                📋 Copy Info
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '2px solid #e0e0e0', textAlign: 'center' }}>
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (window.confirm('Delete this session and all clips?')) {
              onDeleteSession();
            }
          }}
        >
          🗑️ Delete Session
        </button>
      </div>
    </div>
  );
}

export default ClipsList;
