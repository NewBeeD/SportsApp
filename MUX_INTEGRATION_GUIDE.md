# Mux Video Integration Guide

## Overview
Your video components have been updated to support **Mux Video** alongside YouTube. The system automatically detects video type and uses the appropriate player.

## Installation
✅ **Already installed:**
```bash
npm install @mux/mux-player-react
```

## Updated Components
- **`src/components/Video.jsx`** - Main video component
- **`src/components/WeekendHighlights/VideoHighlights.jsx`** - Highlights video component

## How It Works

The components now automatically detect video type:
- **YouTube IDs**: 11-character alphanumeric strings (e.g., `dQw4w9WgXcQ`)
- **Mux Playback IDs**: Any other format (e.g., `abc123xyz456`)

### Video Type Detection
```javascript
// YouTube detection
video.includes('youtube') || video.match(/^[a-zA-Z0-9_-]{11}$/)

// Falls back to Mux for other formats
```

## Using Mux Videos

### 1. Get Your Playback ID
From your Mux dashboard:
1. Upload a video to Mux
2. Copy the **Playback ID** from the video details
3. Store it in your database/API response

Example Playback ID: `a3xb4c5def6g7h8ij`

### 2. Update Your API Response
Modify your API to return Mux playback IDs instead of YouTube IDs:

```javascript
// Instead of:
{ VideoId: "dQw4w9WgXcQ" }

// Use:
{ VideoId: "a3xb4c5def6g7h8ij" }
```

### 3. Features Included

**MuxPlayer automatically provides:**
- ✅ Adaptive bitrate streaming
- ✅ Full player controls (play, pause, volume, fullscreen)
- ✅ Responsive design
- ✅ Keyboard shortcuts
- ✅ Quality selector
- ✅ Playback speed controls
- ✅ Live stream support
- ✅ Analytics tracking

## Example Usage

### YouTube (existing):
```javascript
// Your API returns:
{ VideoId: "dQw4w9WgXcQ" }

// Component automatically uses YouTube player
```

### Mux (new):
```javascript
// Your API returns:
{ VideoId: "a3xb4c5def6g7h8ij" }

// Component automatically uses Mux player
```

## Component Props

### Video.jsx & VideoHighlights.jsx

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `VideoLocation` | string | required | Filter for video location (e.g., 'Homepage1') |

## Player Customization

To customize the Mux player appearance:

### In `Video.jsx` (line ~140):
```javascript
<MuxPlayer
  playbackId={video}
  style={{ width: width === '100%' ? '100%' : `${width}px`, height: `${height}px` }}
  autoPlay={false}
  controls
  theme="light"  // or "dark"
  // Add more options:
  // primaryColor="..."
  // secondaryColor="..."
/>
```

### Available Mux Options:
```javascript
<MuxPlayer
  playbackId={playbackId}
  autoPlay={boolean}
  muted={boolean}
  loop={boolean}
  controls={boolean}
  theme="light" | "dark"
  primaryColor="#000000"
  secondaryColor="#FFFFFF"
  title="Video Title"
/>
```

## Analytics

Mux automatically tracks:
- ✅ Play/pause events
- ✅ Watch time
- ✅ Quality changes
- ✅ Error events
- ✅ Device type
- ✅ Browser/player info

View analytics in your Mux dashboard.

## Advanced Configuration

### Custom Playback IDs with Query Parameters
```javascript
// For advanced features like DRM:
<MuxPlayer
  playbackId={`${playbackId}?drm_token=xxx`}
/>
```

### Webhook Integration
Set up webhooks in Mux dashboard to track video events in your backend.

## Troubleshooting

### Video Not Playing
1. **Check Playback ID**: Verify it's correctly formatted
2. **Verify Access**: Ensure video is public or has proper tokens
3. **CORS**: Confirm Mux domain is not blocked
4. **Mux Account**: Check dashboard for any restrictions

### Player Not Showing Controls
- Ensure `controls={true}` prop is set
- Check `theme` prop value

### Responsive Issues
- Players automatically scale with container
- Adjust width/height props as needed

## Migration Checklist

- [ ] Get Mux account and API key
- [ ] Upload test video to Mux
- [ ] Copy playback ID
- [ ] Test in Video.jsx with test video
- [ ] Test in VideoHighlights.jsx
- [ ] Update API to return Mux IDs
- [ ] Deploy to production

## Resources

- [Mux Player React Docs](https://docs.mux.com/guides/mux-player-react)
- [Mux Dashboard](https://dashboard.mux.com)
- [Mux API Docs](https://docs.mux.com/api-reference)
- [Playback ID Info](https://docs.mux.com/guides/get-started-with-mux-video#2-create-a-playback-policy)

## Support

For Mux-specific issues, check:
1. Browser console for errors
2. Mux dashboard for video status
3. Network tab to verify playback ID requests
