# Quick Setup Guide

## Step 1: Install FFmpeg

FFmpeg is required for video processing.

### macOS
```bash
brew install ffmpeg
```

### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

### Windows
1. Download from: https://ffmpeg.org/download.html
2. Extract and add to PATH
3. Or use: `choco install ffmpeg`

Verify installation:
```bash
ffmpeg -version
```

## Step 2: Install Node.js

Download and install from: https://nodejs.org/ (LTS version recommended)

Verify installation:
```bash
node -v
npm -v
```

## Step 3: Setup Project

```bash
# Clone or download the project
cd video-clip-analyzer

# Install all dependencies
npm run install-all

# Copy environment file
cp .env.example .env
```

## Step 4: Start Development

```bash
# Start both backend (port 5000) and frontend (port 3000)
npm run dev
```

Or start them separately:

```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm run client
```

Open http://localhost:3000 in your browser

## Step 5: Using the Application

1. **Upload a Video**
   - Paste a direct video URL (e.g., from a file hosting site)
   - OR upload a local MP4 file (max 500MB recommended)

2. **Wait for Analysis**
   - The system will automatically detect highlights
   - Progress updates in real-time

3. **Download Clips**
   - Click on individual clips to download
   - Or download all clips at once as ZIP

## Testing with Sample Videos

Create a test video:
```bash
# macOS/Linux
ffmpeg -f lavfi -i testsrc=duration=30:size=1280x720:rate=1 \
        -f lavfi -i sine=f=1000:d=30 \
        -pix_fmt yuv420p test-video.mp4
```

Then upload the generated `test-video.mp4` to the application.

## Production Deployment

### Build Frontend
```bash
npm run build
```

### Start Production Server
```bash
NODE_ENV=production npm start
```

Visit: http://localhost:5000

### Deploy Options
- Heroku
- AWS EC2
- DigitalOcean
- Vercel (frontend only)
- Railway
- Render

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ffmpeg not found` | Install FFmpeg and add to PATH |
| `Port 3000/5000 in use` | Change PORT in .env or kill process |
| `Cannot find module` | Run `npm run install-all` |
| `Out of memory` | Use smaller videos or increase Node.js memory |
| `Video download fails` | Use direct MP4 URL, not streaming service |

## File Cleanup

Temporary files are stored in:
- `/uploads` - Original videos
- `/clips` - Generated clips

To clean up old files:
```bash
# Delete uploads
rm -rf uploads/*

# Delete clips
rm -rf clips/*
```

## Next Steps

1. Customize highlight detection parameters in `services/videoAnalyzer.js`
2. Add database support for persistent clip storage
3. Implement user authentication
4. Add more video processing features
5. Deploy to production

## Need Help?

Check the main README.md for more detailed information!
