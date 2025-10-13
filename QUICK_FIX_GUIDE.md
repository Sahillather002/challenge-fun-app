# Quick Fix for "Error 403: disallowed_useragent"

## What Changed

✅ **Fixed**: OAuth now opens in a **new tab** instead of popup/redirect
✅ **Result**: Google sees it as a proper browser, not a webview
✅ **Benefit**: New tab auto-closes after authentication

## Steps to Fix

### 1. Update Google Cloud Console (5 minutes)

Go to: https://console.cloud.google.com/apis/credentials

Find your OAuth 2.0 Client ID and edit it:

**Add these JavaScript origins:**
```
http://localhost:19006
http://localhost:8081
```

**Add these Redirect URIs (with trailing slash!):**
```
http://localhost:19006/
http://localhost:8081/
```

**Remove** any `https://auth.expo.io` entries (not needed anymore)

Click **SAVE**

### 2. Restart Your Dev Server

```bash
npx expo start --web --clear
```

Press `w` to open in browser

### 3. Allow Popups (if needed)

If your browser blocks the popup:
- Look for popup blocker icon in address bar
- Click "Always allow popups from localhost:19006"
- Try connecting again

### 4. Test the Flow

1. Click **"Connect Google Fit"**
2. New tab opens with Google login
3. Sign in with: `sahillather001@gmail.com`
4. Grant permissions
5. New tab closes automatically
6. Original tab shows: "Google Fit connected successfully!"
7. Steps appear

## Expected Behavior

### ✅ What You Should See:
- New tab opens for Google login
- Original tab stays on your app
- After login, new tab closes itself
- Original tab updates with step count
- No error messages

### ❌ What You Should NOT See:
- "Error 403: disallowed_useragent"
- "Use secure browsers" error
- Popup that won't close
- Stuck on loading screen

## Troubleshooting

### "Popup blocked" message
**Fix**: Allow popups for localhost in browser settings

### New tab doesn't close automatically
**Fix**: Manually close it - the original tab should still update

### Still getting "disallowed_useragent"
**Fixes**:
1. Clear browser cache and cookies
2. Try in incognito/private mode
3. Try a different browser (Chrome recommended)
4. Verify redirect URIs in Google Cloud Console match exactly

### "redirect_uri_mismatch" error
**Fix**: Make sure you included the trailing slash: `http://localhost:19006/`

## Browser Compatibility

✅ **Works Best:**
- Chrome/Edge (Chromium)
- Firefox
- Safari

⚠️ **May Have Issues:**
- Brave (strict privacy settings)
- Older browsers
- Mobile browsers (use native app instead)

## Quick Checklist

- [ ] Google Cloud Console has correct redirect URIs
- [ ] Redirect URIs include trailing slash
- [ ] Development server is running on port 19006
- [ ] Browser allows popups for localhost
- [ ] Using latest code (new tab flow)
- [ ] Cleared browser cache

## Still Not Working?

1. **Check browser console** for detailed errors
2. **Verify Google Cloud Console** settings match exactly
3. **Try incognito mode** to rule out cache issues
4. **See full troubleshooting guide**: `GOOGLE_FIT_TROUBLESHOOTING.md`

## Success Indicators

When it's working correctly, you'll see in console:
```
=== OAUTH DEBUG INFO ===
Full URL: http://localhost:19006/
Origin: http://localhost:19006
...
OAuth callback detected, token received
Fetching steps from Google Fit...
API Response Status: 200
Total steps calculated: 1234
```

---

**Need more help?** Check `GOOGLE_FIT_SETUP.md` for detailed setup instructions.
