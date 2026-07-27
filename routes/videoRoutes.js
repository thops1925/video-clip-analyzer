const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const VideoAnalyzer = require('../services/videoAnalyzer');

const clipsDir = process.env.CLIPS_DIR || './clips';
const uploadDir = process.env.UPLOAD_DIR || './uploads';

// Store active analysis sessions
const activeSessions = new Map();

// Analyze video from URL or uploaded file
router.post('/analyze', async (req, res) => {
  try {
    const { videoUrl } = req.body;
    const uploadedFile = req.files?.video;

    if (!videoUrl && !uploadedFile) {
      return res.status(400).json({ error: 'Please provide a video URL or upload a file' });
    }

    const sessionId = uuidv4();
    const analyzer = new VideoAnalyzer(sessionId);
    
    activeSessions.set(sessionId, {
      status: 'processing',
      progress: 0,
      clips: []
    });

    // Process in background
    (async () => {
      try {
        let videoPath;

        if (uploadedFile) {
          // Save uploaded file
          videoPath = path.join(uploadDir, `${sessionId}_${uploadedFile.name}`);
          await uploadedFile.mv(videoPath);
        } else {
          // Download from URL
          videoPath = await analyzer.downloadVideo(videoUrl);
        }

        // Analyze video for highlights
        activeSessions.set(sessionId, { ...activeSessions.get(sessionId), status: 'analyzing' });
        const highlights = await analyzer.detectHighlights(videoPath);

        // Generate clips
        activeSessions.set(sessionId, { ...activeSessions.get(sessionId), status: 'generating_clips' });
        const clips = await analyzer.generateClips(videoPath, highlights);

        // Save session data
        const sessionData = {
          sessionId,
          videoPath,
          highlights,
          clips,
          createdAt: new Date(),
          totalDuration: analyzer.videoDuration
        };

        const sessionFile = path.join(clipsDir, `${sessionId}_session.json`);
        fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2));

        activeSessions.set(sessionId, {
          status: 'completed',
          progress: 100,
          clips,
          videoDuration: analyzer.videoDuration
        });
      } catch (error) {
        console.error('Analysis error:', error);
        activeSessions.set(sessionId, {
          status: 'error',
          error: error.message
        });
      }
    })();

    res.json({ sessionId, message: 'Analysis started' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get analysis progress
router.get('/progress/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = activeSessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json(session);
});

// Get all clips for a session
router.get('/clips/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessionFile = path.join(clipsDir, `${sessionId}_session.json`);

    if (!fs.existsSync(sessionFile)) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
    res.json(sessionData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Download a specific clip
router.get('/download/:sessionId/:clipId', (req, res) => {
  try {
    const { sessionId, clipId } = req.params;
    const clipPath = path.join(clipsDir, `${sessionId}_clip_${clipId}.mp4`);

    if (!fs.existsSync(clipPath)) {
      return res.status(404).json({ error: 'Clip not found' });
    }

    res.download(clipPath, `highlight_${clipId}.mp4`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Download all clips as zip
router.get('/download-all/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const archiver = require('archiver');
    const sessionFile = path.join(clipsDir, `${sessionId}_session.json`);

    if (!fs.existsSync(sessionFile)) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
    const archive = archiver('zip', { zlib: { level: 9 } });

    res.attachment(`video-clips-${sessionId}.zip`);
    archive.pipe(res);

    for (const clip of sessionData.clips) {
      const clipPath = path.join(clipsDir, `${sessionId}_clip_${clip.id}.mp4`);
      if (fs.existsSync(clipPath)) {
        archive.file(clipPath, { name: `highlight_${clip.id}_${clip.timestamp}s.mp4` });
      }
    }

    await archive.finalize();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Delete session and clips
router.delete('/session/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessionFile = path.join(clipsDir, `${sessionId}_session.json`);

    if (fs.existsSync(sessionFile)) {
      const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
      
      // Delete original video
      if (fs.existsSync(sessionData.videoPath)) {
        fs.unlinkSync(sessionData.videoPath);
      }

      // Delete all clips
      for (const clip of sessionData.clips) {
        const clipPath = path.join(clipsDir, `${sessionId}_clip_${clip.id}.mp4`);
        if (fs.existsSync(clipPath)) {
          fs.unlinkSync(clipPath);
        }
      }

      // Delete session file
      fs.unlinkSync(sessionFile);
    }

    activeSessions.delete(sessionId);
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
