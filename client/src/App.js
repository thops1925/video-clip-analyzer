import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoUpload from './components/VideoUpload';
import AnalysisProgress from './components/AnalysisProgress';
import ClipsList from './components/ClipsList';

function App() {
  const [tab, setTab] = useState('upload'); // upload, results
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [clips, setClips] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);

  // Check server health
  useEffect(() => {
    axios.get('/api/health')
      .catch(() => {
        setError('Cannot connect to server. Make sure the backend is running on port 5000.');
      });
  }, []);

  // Poll for analysis progress
  useEffect(() => {
    if (!sessionId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/videos/progress/${sessionId}`);
        
        if (response.data.status === 'completed') {
          // Fetch clips
          const clipsResponse = await axios.get(`/api/videos/clips/${sessionId}`);
          setClips(clipsResponse.data.clips || []);
          setVideoDuration(clipsResponse.data.totalDuration || 0);
          setSuccess(`Analysis complete! Found ${clipsResponse.data.clips?.length || 0} highlights.`);
          setTab('results');
          clearInterval(pollInterval);
        } else if (response.data.status === 'error') {
          setError(response.data.error || 'Analysis failed');
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('Error checking progress:', err);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [sessionId]);

  const handleAnalyzeVideo = async (videoUrl, videoFile) => {
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);
      setClips([]);

      const formData = new FormData();
      if (videoFile) {
        formData.append('video', videoFile);
      } else {
        formData.append('videoUrl', videoUrl);
      }

      const response = await axios.post('/api/videos/analyze', formData, {
        headers: videoFile ? { 'Content-Type': 'multipart/form-data' } : {}
      });

      setSessionId(response.data.sessionId);
      setTab('results');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze video');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async () => {
    if (!sessionId) return;
    
    try {
      await axios.delete(`/api/videos/session/${sessionId}`);
      setSessionId(null);
      setClips([]);
      setSuccess(null);
      setError(null);
      setTab('upload');
    } catch (err) {
      setError('Failed to delete session');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🎬 Video Clip Analyzer</h1>
        <p>Automatically extract highlight clips from your videos</p>
      </div>

      {error && <div className="error-message">❌ {error}</div>}
      {success && <div className="success-message">✅ {success}</div>}

      <div className="tab-buttons">
        <button
          className={`tab-btn ${tab === 'upload' ? 'active' : ''}`}
          onClick={() => setTab('upload')}
        >
          📹 Upload Video
        </button>
        <button
          className={`tab-btn ${tab === 'results' ? 'active' : ''}`}
          onClick={() => setTab('results')}
          disabled={!sessionId}
        >
          📊 Results {clips.length > 0 && `(${clips.length})`}
        </button>
      </div>

      {tab === 'upload' && (
        <VideoUpload
          onAnalyze={handleAnalyzeVideo}
          loading={loading}
        />
      )}

      {tab === 'results' && sessionId && (
        <>
          <AnalysisProgress sessionId={sessionId} />
          <ClipsList
            sessionId={sessionId}
            clips={clips}
            videoDuration={videoDuration}
            onDeleteSession={handleDeleteSession}
          />
        </>
      )}
    </div>
  );
}

export default App;