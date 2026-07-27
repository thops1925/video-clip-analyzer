import React, { useState } from 'react';

function VideoUpload({ onAnalyze, loading }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploadMode, setUploadMode] = useState('url'); // url or file

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (videoUrl.trim()) {
      onAnalyze(videoUrl, null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (videoFile) {
      onAnalyze(null, videoFile);
    }
  };

  return (
    <div className="card">
      <div className="input-group">
        <label>Choose Upload Method</label>
        <div className="input-wrapper">
          <button
            className={`btn ${uploadMode === 'url' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setUploadMode('url');
              setVideoFile(null);
            }}
          >
            🔗 Video URL
          </button>
          <button
            className={`btn ${uploadMode === 'file' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setUploadMode('file');
              setVideoUrl('');
            }}
          >
            📁 Upload File
          </button>
        </div>
      </div>

      {uploadMode === 'url' ? (
        <form onSubmit={handleUrlSubmit}>
          <div className="input-group">
            <label>Video URL</label>
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Paste a direct video URL (MP4, WebM, etc.)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!videoUrl.trim() || loading}
              >
                {loading ? <span><span className="spinner"></span>Analyzing...</span> : '🚀 Analyze'}
              </button>
            </div>
          </div>
          <p style={{ fontSize: '0.85em', color: '#999', marginTop: '10px' }}>
            💡 Tip: Use direct MP4 links. Local files upload might be limited by file size.
          </p>
        </form>
      ) : (
        <form onSubmit={handleFileSubmit}>
          <div className="input-group">
            <label>Select Video File</label>
            <div className="input-wrapper">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!videoFile || loading}
              >
                {loading ? <span><span className="spinner"></span>Analyzing...</span> : '🚀 Analyze'}
              </button>
            </div>
          </div>
          {videoFile && (
            <p style={{ fontSize: '0.9em', color: '#667eea', marginTop: '10px' }}>
              📹 Selected: {videoFile.name}
            </p>
          )}
          <p style={{ fontSize: '0.85em', color: '#999', marginTop: '10px' }}>
            ℹ️ Supported formats: MP4, WebM, MOV, AVI, etc. (Max 500MB recommended)
          </p>
        </form>
      )}
    </div>
  );
}

export default VideoUpload;