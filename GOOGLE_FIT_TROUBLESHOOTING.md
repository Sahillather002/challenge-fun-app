# Google Fit Integration Troubleshooting Guide

## Common Issues and Solutions

### 1. Error 403: disallowed_useragent

**Symptoms:**
- "Access blocked: Challenge fun app's request does not comply with Google's policies"
- Error 403: disallowed_useragent

**Cause:**
Google blocks OAuth in embedded browsers/webviews for security. Expo's development environment may be detected as a webview.

**Solution:**

The code has been updated to use a **new tab flow** that Google recognizes as a proper browser. You need to:

1. **Add redirect URIs to Google Cloud Console:**
   - Go to your OAuth client credentials
   - Add JavaScript origins:
     - `http://localhost:19006`
     - `http://localhost:8081`
   - Add redirect URIs (with trailing slash!):
     - `http://localhost:19006/`
     - `http://localhost:8081/`

2. **Restart your development server:**
   ```bash
   npx expo start --web --clear
   ```

3. **Allow popups for localhost** (if prompted by browser)

4. **Try authentication again** - it will open Google in a new tab

**How it works:**
- Click "Connect Google Fit"
- A new tab opens with Google's login page
- Original tab stays on your app
- After authentication in the new tab, it automatically closes
- Original tab detects success and fetches steps

**For Production:**
- Add your production domain to authorized origins and redirect URIs
- Example: `https://yourdomain.com` and `https://yourdomain.com/`

### 2. Authentication Errors (401/403)

**Symptoms:**
- User gets "Authentication failed" error after login
- Steps show as 0 even after connecting
- Console shows 401 or 403 HTTP status

**Causes:**
- OAuth client ID not properly configured in Google Cloud Console
- Redirect URI not authorized
- Token expired or invalid
- Missing API scopes

**Solutions:**

#### A. Configure Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Enable **Fitness API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Fitness API"
   - Click "Enable"

4. Configure OAuth Consent Screen:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Select "External" user type
   - Add required scopes:
     - `https://www.googleapis.com/auth/fitness.activity.read`
     - `https://www.googleapis.com/auth/fitness.location.read`
     - `https://www.googleapis.com/auth/fitness.body.read`

5. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: **Web application**
   - Add Authorized JavaScript origins:
     - `http://localhost:19006` (for local development)
     - `http://localhost:8081` (alternative port)
     - Your production domain (e.g., `https://yourdomain.com`)
   - Add Authorized redirect URIs (MUST include trailing slash!):
     - `http://localhost:19006/`
     - `http://localhost:8081/`
     - Your production domain with trailing slash
   - Copy the Client ID and update `app.json`

#### B. Update app.json
```json
{
  "expo": {
    "extra": {
      "googleFitClientId": "YOUR_CLIENT_ID_HERE.apps.googleusercontent.com"
    }
  }
}
```

#### C. For Web Platform
Make sure your web server is running on the correct port:
```bash
npx expo start --web
```

### 2. No Step Data Returned

**Symptoms:**
- Authentication succeeds but steps show as 0
- Console shows "No data buckets returned"

**Causes:**
- User has no step data in Google Fit
- Date range is incorrect
- Data source not available

**Solutions:**

1. **Verify Google Fit has data:**
   - Open Google Fit app on Android device
   - Check if steps are being recorded
   - Manually add some steps if needed

2. **Check data source:**
   - The app uses `derived:com.google.step_count.delta:com.google.android.gms:estimated_steps`
   - This is the standard Android step counter
   - Alternative sources can be added if needed

3. **Test with different time ranges:**
   ```typescript
   // In GoogleFitService.ts, you can test with a wider range
   const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime();
   ```

### 3. CORS Errors (Web Only)

**Symptoms:**
- Browser console shows CORS policy errors
- Requests to Google Fit API are blocked

**Solutions:**

1. **Ensure proper redirect URI:**
   - Must match exactly what's in Google Cloud Console
   - Include protocol (http/https)
   - Include port if applicable
   - Include trailing slash

2. **Check browser console:**
   - Open DevTools (F12)
   - Look for detailed error messages
   - Verify the OAuth URL being generated

### 4. Token Expiration

**Symptoms:**
- Works initially but fails after some time
- "Authentication failed" error appears randomly

**Solutions:**

The current implementation uses access tokens which expire after 1 hour. To fix:

1. **Implement token refresh** (recommended for production):
   ```typescript
   // Add to GoogleFitService.ts
   private async refreshToken() {
     // Implement OAuth refresh token flow
   }
   ```

2. **Re-authenticate when needed:**
   - The app now automatically disconnects on 401/403
   - User will be prompted to reconnect

## Debugging Steps

### 1. Enable Detailed Logging

The updated code includes comprehensive logging. Check console for:
- `Fetching steps:` - Shows time range and token status
- `API Response Status:` - HTTP status code
- `API Response Data:` - Full response from Google Fit
- `Total steps calculated:` - Final step count

### 2. Test Authentication Flow

```typescript
// In browser console or React Native debugger
const service = GoogleFitService.getInstance();

// Check if authorized
const isAuth = await service.isAuthorizedCheck();
console.log('Is authorized:', isAuth);

// Try to get steps
const steps = await service.getTodaySteps();
console.log('Steps:', steps);
```

### 3. Verify API Response Structure

Expected response format:
```json
{
  "bucket": [
    {
      "startTimeMillis": "1234567890000",
      "endTimeMillis": "1234567890000",
      "dataset": [
        {
          "dataSourceId": "derived:com.google.step_count.delta:...",
          "point": [
            {
              "startTimeNanos": "1234567890000000000",
              "endTimeNanos": "1234567890000000000",
              "dataTypeName": "com.google.step_count.delta",
              "value": [
                {
                  "intVal": 1234
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## Testing Checklist

- [ ] Google Cloud Console properly configured
- [ ] Fitness API enabled
- [ ] OAuth client ID added to app.json
- [ ] Redirect URIs match exactly
- [ ] OAuth consent screen configured with correct scopes
- [ ] Google Fit app has step data (for Android)
- [ ] Browser console shows no CORS errors
- [ ] Authentication completes successfully
- [ ] Token is stored in localStorage/SecureStore
- [ ] API calls return 200 status
- [ ] Step data is parsed correctly
- [ ] UI updates with step count

## Platform-Specific Notes

### Web
- Uses implicit OAuth flow (token in URL hash)
- Requires exact redirect URI match
- CORS restrictions apply
- localStorage used for token storage

### Android
- Uses native OAuth flow
- Requires Google Play Services
- SecureStore used for token storage
- Google Fit app should be installed

### iOS
- Google Fit not available on iOS
- Consider using Apple HealthKit instead

## Error Messages Reference

| Error | Cause | Solution |
|-------|-------|----------|
| "Google Fit Client ID not configured" | Missing clientId in app.json | Add googleFitClientId to extra config |
| "Authentication failed. Please reconnect" | Token expired or invalid | Disconnect and reconnect |
| "Google Fit API error: 401" | Unauthorized - bad token | Check OAuth configuration |
| "Google Fit API error: 403" | Forbidden - missing scopes | Add required scopes in Cloud Console |
| "No data buckets returned" | No step data available | Check Google Fit app has data |

## Need More Help?

1. Check browser/app console for detailed error logs
2. Verify all configuration steps in Google Cloud Console
3. Test with a fresh OAuth flow (disconnect and reconnect)
4. Ensure Google Fit app is recording steps (Android)
5. Try with a different Google account to rule out account-specific issues
