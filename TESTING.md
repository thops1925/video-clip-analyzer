# 🎬 Video Clip Analyzer - Quick Test Guide

## ✅ Automated Testing

### For macOS/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

### For Windows:
```cmd
setup.bat
```

This will:
✅ Check Node.js installation
✅ Check FFmpeg installation  
✅ Install all dependencies
✅ Create required directories
✅ Confirm everything is ready

---

## 🚀 Manual Testing Steps

### 1. **Install Dependencies**
```bash
npm run install-all
```

### 2. **Start the App**
```bash
npm run dev
```

You should see:
```
✅ Backend: Server running on port 5000
✅ Frontend: Compiled successfully on port 3000
```

### 3. **Test the Features**

**Test 1: Upload & Analyze**
- Open http://localhost:3000
- Upload a test video (or paste URL)
- Click "Analyze"
- Watch progress bar move

**Test 2: View Results**
- After analysis completes (should show 3-5 highlights)
- Check "Results" tab
- Verify clips are displayed with metadata

**Test 3: Download Clips**
- Click "Download" on individual clip
- Or click "Download All" for ZIP file
- Files should download successfully

**Test 4: Delete Session**
- Click "Delete Session"
- Confirm deletion
- Session data should be cleared

---

## 🔍 Troubleshooting Tests

### Test: Backend Health Check
```bash
curl http://localhost:5000/api/health
```
Expected: `{"status":"Server is running"...}`

### Test: Frontend Loads
```bash
curl http://localhost:3000
```
Expected: HTML page loads

### Test: API Endpoint
```bash
curl -X GET http://localhost:5000/api/videos/progress/test-id
```
Expected: Error 404 (session not found) is OK

---

## 📊 What to Check

✅ **No console errors** in browser DevTools
✅ **No server errors** in terminal
✅ **All features respond** to clicks
✅ **Uploads work** without freezing
✅ **Downloads complete** successfully

---

## ⚠️ Common Issues & Fixes

### Issue: "Cannot connect to server"
```bash
# Fix: Make sure backend is running
npm run server
```

### Issue: "FFmpeg not found"
```bash
# macOS
brew install ffmpeg

# Ubuntu
sudo apt-get install ffmpeg
```

### Issue: Port already in use
```bash
# Use different port
PORT=5001 npm run server
```

### Issue: Module not found
```bash
# Reinstall
rm -rf node_modules client/node_modules
npm run install-all
```

---

## 🎯 Success Criteria

Your app is working if:
- ✅ Frontend loads without errors
- ✅ Backend API responds
- ✅ Video upload triggers analysis
- ✅ Progress bar shows activity
- ✅ Results display clips
- ✅ Downloads work

---

## 📝 Test Checklist

- [ ] Dependencies install successfully
- [ ] Both frontend and backend start
- [ ] No console errors
- [ ] Can upload video
- [ ] Analysis starts
- [ ] Progress updates in real-time
- [ ] Results show highlights
- [ ] Can download individual clip
- [ ] Can download all as ZIP
- [ ] Can delete session

Once all checks pass, your app is ready! 🚀
