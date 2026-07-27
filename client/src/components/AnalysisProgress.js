import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AnalysisProgress({ sessionId }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const checkProgress = async () => {
      try {
        const response = await axios.get(`/api/videos/progress/${sessionId}`);
        setStatus(response.data.status);
        setProgress(response.data.progress || 0);
      } catch (err) {
        console.error('Error checking progress:', err);
      }
    };

    const interval = setInterval(checkProgress, 1000);
    checkProgress();

    return () => clearInterval(interval);
  }, [sessionId]);

  const getStatusText = () => {
    switch (status) {
      case 'processing':
        return '📥 Downloading video...';
      case 'analyzing':
        return '🔍 Analyzing video for highlights...';
      case 'generating_clips':
        return '✂️ Generating video clips...';
      case 'completed':
        return '✅ Analysis complete!';
      case 'error':
        return '❌ Analysis failed';
      default:
        return 'Processing...';
    }
  };

  if (status === 'completed' || status === 'error') {
    return null;
  }

  return (
    <div className="card">
      <div className="status processing">
        <span className="spinner"></span>
        {getStatusText()}
      </div>
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">{progress}% Complete</div>
      </div>
    </div>
  );
}

export default AnalysisProgress;
