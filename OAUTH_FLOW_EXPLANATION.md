# Google Fit OAuth Flow - How It Works

## The Problem We Solved

### Issue 1: Error 403 - disallowed_useragent
Google blocks OAuth in embedded browsers/webviews for security reasons.

### Issue 2: Popup Window Not Closing
When using Expo's AuthSession with popup mode, Cross-Origin-Opener-Policy (COOP) prevents the popup from closing properly, leaving users confused.

## The Solution: New Tab OAuth Flow

Instead of using embedded popups or same-window redirects, we now use a **new tab flow** that Google recognizes as a proper browser:

### How It Works

1. **User clicks "Connect Google Fit"**
   - App stores a flag in localStorage: `google_fit_auth_pending = true`
   - App opens Google's OAuth page in a **new tab** using `window.open()`
   - Original tab stays on your app
   - New tab shows Google's login/consent screen

2. **User authenticates with Google (in new tab)**
   - User logs in with their Google account
   - User grants permissions for Fitness API access
   - Google redirects back to your app (in the new tab) with token in URL hash

3. **App receives the token (in new tab)**
   - New tab URL looks like: `http://localhost:19006/#access_token=ya29.xxx&token_type=Bearer&expires_in=3599`
   - App's `checkUrlForToken()` method extracts the token from URL hash
   - Token is stored in localStorage
   - New tab sends message to original tab: `postMessage({ type: 'GOOGLE_FIT_AUTH_SUCCESS' })`
   - New tab automatically closes itself
   - Original tab receives message and fetches steps

### Code Flow

```typescript
// 1. User clicks connect
connectGoogleFit() {
  await googleFitService.authorize();
}

// 2. authorize() opens new tab
authorize() {
  localStorage.setItem('google_fit_auth_pending', 'true');
  const newWindow = window.open('https://accounts.google.com/o/oauth2/v2/auth?...', '_blank');
  // New tab opens - original tab stays on your app
}

// 3. Google redirects back with token (in new tab)
// New tab URL: http://localhost:19006/#access_token=ya29.xxx...

// 4. New tab detects token and notifies original tab
useEffect(() => {
  const urlToken = googleFitService.checkUrlForToken();
  if (urlToken && window.opener) {
    // This is the new tab - notify parent and close
    window.opener.postMessage({ type: 'GOOGLE_FIT_AUTH_SUCCESS' }, window.location.origin);
    window.close();
  }
}, []);

// 5. Original tab receives message and updates
window.addEventListener('message', async (event) => {
  if (event.data.type === 'GOOGLE_FIT_AUTH_SUCCESS') {
    await checkConnection();
    await fetchSteps();
  }
});
```

## Configuration Required

### Google Cloud Console

You need to authorize your app's URL as a valid redirect destination:

**Authorized JavaScript origins:**
- `http://localhost:19006` (development)
- Your production domain (e.g., `https://yourdomain.com`)

**Authorized redirect URIs:**
- `http://localhost:19006/` (note the trailing slash!)
- Your production domain with trailing slash

### Why the trailing slash matters
Google OAuth is very strict about redirect URI matching. These are different:
- ✅ `http://localhost:19006/` (with slash)
- ❌ `http://localhost:19006` (without slash)

Always include the trailing slash in Google Cloud Console configuration!

## User Experience

### What the user sees:

1. **Before connection:**
   - Google Fit card shows "Connect Google Fit" button
   - Status dot is red

2. **During authentication:**
   - Click "Connect Google Fit"
   - Page redirects to Google (same window)
   - User logs in and grants permissions
   - Page redirects back to your app

3. **After connection:**
   - App automatically detects the token
   - Shows success message
   - Fetches and displays step count
   - Status dot turns green
   - "Sync Now" button available

### Advantages of this approach:

✅ **No popup issues** - Uses same window, no COOP problems
✅ **No Expo proxy needed** - Direct OAuth with Google
✅ **Works in all browsers** - Standard OAuth 2.0 flow
✅ **Better UX** - Clear redirect flow, no stuck popups
✅ **Secure** - Token in URL hash (not query params)
✅ **Simple configuration** - Just localhost URLs needed

### Disadvantages:

⚠️ **Page reload** - User briefly leaves your app during auth
⚠️ **State loss** - Any unsaved form data is lost during redirect
⚠️ **Token in URL** - Briefly visible in browser history (but cleared immediately)

## Security Considerations

1. **Token storage:**
   - Access token stored in localStorage (web) or SecureStore (native)
   - Token cleared from URL immediately after extraction

2. **Token expiration:**
   - Google access tokens expire after 1 hour
   - App detects 401/403 errors and prompts re-authentication
   - User must reconnect after token expires

3. **Scope permissions:**
   - Only requests necessary fitness scopes
   - User must explicitly grant permissions
   - Permissions can be revoked in Google account settings

## Testing the Flow

1. **Start fresh:**
   ```bash
   # Clear browser data or use incognito mode
   npx expo start --web --clear
   ```

2. **Click "Connect Google Fit"**
   - Should redirect to Google
   - No popup should appear

3. **Log in and grant permissions**
   - Use your test Google account
   - Accept all fitness permissions

4. **Verify redirect back**
   - Should return to http://localhost:19006/
   - Should show "Google Fit connected successfully!"
   - Should display step count

5. **Check console logs:**
   ```
   OAuth callback detected, token received
   Fetching steps from Google Fit...
   API Response Status: 200
   Total steps calculated: 1234
   ```

## Troubleshooting

### "redirect_uri_mismatch" error
- Check that redirect URI in Google Cloud Console exactly matches
- Must include trailing slash: `http://localhost:19006/`
- Check for http vs https mismatch

### Token not detected after redirect
- Check browser console for errors
- Verify URL contains `#access_token=...`
- Check that `checkUrlForToken()` is being called on app load

### "disallowed_useragent" still appears
- Make sure you're using the updated code (same-window redirect)
- Clear browser cache and restart dev server
- Try in a different browser or incognito mode

## Production Deployment

When deploying to production:

1. **Add production domain to Google Cloud Console:**
   - JavaScript origin: `https://yourdomain.com`
   - Redirect URI: `https://yourdomain.com/`

2. **Use HTTPS:**
   - Google requires HTTPS for production OAuth
   - localhost with HTTP is only allowed for development

3. **Consider refresh tokens:**
   - Current implementation uses access tokens (1 hour expiry)
   - For production, implement refresh token flow for better UX
   - Requires server-side component to securely store refresh tokens

4. **Publish OAuth consent screen:**
   - Move from "Testing" to "Published" status
   - Required for users outside your test user list
   - May require Google verification for sensitive scopes
