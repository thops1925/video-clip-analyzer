# 🎬 Video Clip Analyzer

A web application that automatically analyzes videos to detect and extract highlight clips.

## Features

✨ **Automatic Highlight Detection** - AI-powered scene detection finds the most interesting moments
📹 **Easy Video Upload** - Paste a video URL or upload a file directly
✂️ **Clip Generation** - Automatically creates short video clips from detected highlights
📊 **Clip Management** - View all generated clips with metadata (timestamp, duration, confidence)
⬇️ **Easy Downloads** - Download individual clips or all at once as a ZIP file

## Tech Stack

- **Frontend**: React 18 + CSS3
- **Backend**: Node.js + Express
- **Video Processing**: FFmpeg
- **Video Analysis**: OpenCV-based scene detection

## Installation

### Prerequisites
- Node.js 14+
- FFmpeg installed on your system
  - macOS: `brew install ffmpeg`
  - Ubuntu/Debian: `sudo apt-get install ffmpeg`
  - Windows: Download from https://ffmpeg.org/download.html

### Setup

1. Clone the repository:
```bash
git clone https://github.com/thops1925/video-clip-analyzer.git
cd video-clip-analyzer
```

2. Install dependencies:
```bash
npm run install-all
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Start the application:

**Development mode** (runs both backend and frontend):
```bash
npm run dev
```

**Production mode**:
```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. **Upload a Video**
   - Enter a direct video URL (MP4, WebM, etc.) OR upload a local file
   - Supported formats: MP4, WebM, MOV, AVI, and more

2. **Analyze**
   - Click "Analyze" and wait for processing
   - The system will detect highlights automatically

3. **Download Clips**
   - View all detected highlights with their metadata
   - Download individual clips or all clips at once

## API Endpoints

### Video Analysis
- `POST /api/videos/analyze` - Start video analysis
  - Body: `{ videoUrl: string }` or multipart file upload

- `GET /api/videos/progress/:sessionId` - Check analysis progress

- `GET /api/videos/clips/:sessionId` - Get all clips for a session

### Downloads
- `GET /api/videos/download/:sessionId/:clipId` - Download single clip
- `GET /api/videos/download-all/:sessionId` - Download all clips as ZIP

### Session Management
- `DELETE /api/videos/session/:sessionId` - Delete session and clips

## Directory Structure

```
video-clip-analyzer/
├── server.js                 # Express server entry point
├── routes/
│   └── videoRoutes.js       # Video API routes
├── services/
│   └── videoAnalyzer.js     # Video analysis logic
├── uploads/                  # Temporary video storage
├── clips/                    # Generated clips storage
├── client/
│   ├── public/
│   │   ├── index.html       # React HTML template
│   │   └── styles.css       # Main styles
│   └── src/
│       ├── App.js           # Main React component
│       ├── index.js         # React entry point
│       └── components/
│           ├── VideoUpload.js      # Upload component
│           ├── AnalysisProgress.js # Progress component
│           └── ClipsList.js        # Clips display component
└── package.json
```

## Configuration

Edit `.env` to customize:

```env
PORT=5000                    # Server port
NODE_ENV=development         # Environment
UPLOAD_DIR=./uploads         # Upload directory
CLIPS_DIR=./clips           # Clips output directory
MAX_FILE_SIZE=500000000     # Max file size (bytes)
```

## Highlights Detection

The analyzer detects highlights using:
- **Scene Changes** - Detects rapid visual changes
- **Motion Detection** - Identifies high-motion segments
- **Face Detection** - Highlights frames with faces
- **Sound Analysis** - Detects audio peaks and changes

## Limitations & Future Improvements

Current limitations:
- FFmpeg must be installed locally
- Single-threaded processing
- Limited to available server memory
- No real-time preview

Planned features:
- [ ] Real-time video preview
- [ ] Custom highlight detection parameters
- [ ] Batch processing
- [ ] Cloud storage integration (AWS S3, Google Cloud)
- [ ] Advanced ML-based highlight detection
- [ ] Subtitle/caption support
- [ ] Video effects and filters

## Troubleshooting

### FFmpeg not found
Make sure FFmpeg is installed and in your PATH:
```bash
ffmpeg -version
```

### Video download fails
- Check internet connection
- Ensure URL is a direct video link (not streaming service)
- Try uploading a file instead

### Out of memory errors
- Process smaller videos
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096 npm start`

### Port already in use
Change the PORT in `.env` or:
```bash
PORT=5001 npm start
```

## Performance Tips

- Use MP4 format for best compatibility
- Keep videos under 500MB for optimal performance
- Process one video at a time
- Close unnecessary applications to free up memory

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ by thops1925
