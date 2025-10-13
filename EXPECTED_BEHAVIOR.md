# Expected OAuth Flow Behavior

## What You Should See (Step by Step)

### 1. Initial State
- ✅ Google Fit card shows "Connect Google Fit" button
- ✅ Status dot is **red** (disconnected)
- ✅ No error messages

### 2. Click "Connect Google Fit"
- ✅ Button shows "Connecting..." briefly
- ✅ **New tab opens** with Google's login page
- ✅ Original tab shows blue info message: **"Please complete authentication in the new tab..."**
- ✅ Original tab stays on your app (doesn't redirect away)

### 3. In the New Tab (OAuth Window)
- ✅ Google login page appears
- ✅ Sign in with your Google account
- ✅ Grant permissions for Fitness API
- ✅ After granting permissions, Google redirects back to `http://localhost:19006/#access_token=...`

### 4. After Authentication
- ✅ New tab **automatically closes itself** (or shows message to close)
- ✅ Original tab shows alert: **"Google Fit connected successfully!"**
- ✅ Status dot turns **green**
- ✅ Step count appears
- ✅ "Sync Now" button becomes available

### 5. Console Logs (Success)
```
=== OAUTH DEBUG INFO ===
Full URL: http://localhost:19006/
Origin: http://localhost:19006
User Agent: Mozilla/5.0...
========================
Redirect URI: http://localhost:19006/
Full OAuth URL: https://accounts.google.com/o/oauth2/v2/auth?...
OAuth window opened, waiting for user to complete authentication...

[In new tab]
OAuth callback detected, token received
Received auth success message from OAuth tab
Fetching steps from Google Fit...
API Response Status: 200
Total steps calculated: 1234
```

## What You Should NOT See

### ❌ Immediate Failure
- Should NOT show "Failed to connect" right after opening new tab
- Should NOT show error alert immediately

### ❌ Stuck States
- New tab should NOT stay open indefinitely
- Original tab should NOT keep showing "Connecting..."
- Should NOT see "disallowed_useragent" error

### ❌ Wrong Messages
- Should NOT see red error message while waiting for auth
- Should NOT see multiple popups/tabs

## Troubleshooting Current Issue

Based on your error, here's what's happening:

### Problem
- New tab opens ✅
- Original tab immediately shows "Failed to connect" ❌
- This is because the code was treating `authorize()` returning `false` as a failure

### Fix Applied
- Changed `connectGoogleFit()` to recognize that `false` on web means "auth in progress"
- Shows blue info message instead of red error
- Waits for message from new tab instead of failing immediately

## Testing Checklist

After restarting the server, verify:

1. **Click "Connect Google Fit"**
   - [ ] New tab opens
   - [ ] Original tab shows blue message: "Please complete authentication in the new tab..."
   - [ ] NO error alert appears

2. **In new tab, complete authentication**
   - [ ] Google login page loads (no "disallowed_useragent" error)
   - [ ] Can sign in successfully
   - [ ] Can grant permissions

3. **After granting permissions**
   - [ ] New tab closes automatically (or can be closed manually)
   - [ ] Original tab shows success alert
   - [ ] Step count appears
   - [ ] Status dot is green

## If It Still Doesn't Work

### Check these:

1. **Browser Console (F12)**
   - Look for any JavaScript errors
   - Check if `postMessage` is being sent/received
   - Verify token is in URL hash of new tab

2. **Google Cloud Console**
   - Verify redirect URI is exactly: `http://localhost:19006/` (with slash!)
   - Verify JavaScript origin is: `http://localhost:19006`

3. **Browser Settings**
   - Allow popups for localhost:19006
   - Clear cache and cookies
   - Try incognito mode

4. **Network Tab**
   - Check if OAuth request is being made
   - Look for any blocked requests

## Common Issues & Solutions

### "Popup blocked"
**Solution**: Allow popups in browser settings for localhost:19006

### New tab doesn't close
**Solution**: Manually close it - the original tab should still update

### "disallowed_useragent" still appears
**Solution**: 
- Clear browser cache completely
- Try different browser (Chrome recommended)
- Verify you're using the latest code (new tab flow)

### No message received in original tab
**Solution**:
- Check browser console for CORS errors
- Verify both tabs are on same origin (localhost:19006)
- Try manually refreshing original tab after auth

## Success Indicators

You'll know it's working when:
- ✅ No immediate error after clicking connect
- ✅ Blue info message appears (not red error)
- ✅ New tab opens with Google login
- ✅ Can complete authentication in new tab
- ✅ Original tab updates automatically
- ✅ Steps appear without manual refresh
