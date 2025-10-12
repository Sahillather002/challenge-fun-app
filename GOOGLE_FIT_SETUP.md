# Quick Setup Guide for Google Fit Integration

## Step-by-Step Configuration

### Step 1: Configure Google Cloud Console

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**

2. **Enable Fitness API:**
   - Navigate to: `APIs & Services` → `Library`
   - Search: "Fitness API"
   - Click `Enable`

3. **Configure OAuth Consent Screen:**
   - Navigate to: `APIs & Services` → `OAuth consent screen`
   - User Type: `External`
   - Fill in required fields:
     - App name: `Challenge Fun App`
     - User support email: `sahillather001@gmail.com`
     - Developer contact: `sahillather001@gmail.com`
   - Click `Save and Continue`
   
4. **Add Scopes:**
   - Click `Add or Remove Scopes`
   - Add these scopes:
     ```
     https://www.googleapis.com/auth/fitness.activity.read
     https://www.googleapis.com/auth/fitness.location.read
     https://www.googleapis.com/auth/fitness.body.read
     ```
   - Click `Update` → `Save and Continue`

5. **Add Test Users (for development):**
   - Add your email: `sahillather001@gmail.com`
   - Click `Save and Continue`

6. **Create OAuth Credentials:**
   - Navigate to: `APIs & Services` → `Credentials`
   - Click: `Create Credentials` → `OAuth client ID`
   - Application type: `Web application`
   - Name: `Challenge Fun App - Web`
   
7. **Configure Authorized URIs:**

   **Authorized JavaScript origins:**
   ```
   http://localhost:19006
   http://localhost:8081
   ```

   **Authorized redirect URIs:**
   ```
   http://localhost:19006/
   http://localhost:8081/
   ```
   
   **Note:** Make sure to include the trailing slash (/) in redirect URIs!

8. **Copy the Client ID** (looks like: `271265785455-xxxxx.apps.googleusercontent.com`)

### Step 2: Update Your App Configuration

Your `app.json` already has the client ID configured:
```json
{
  "expo": {
    "owner": "kiroku",
    "slug": "health-competition-app",
    "extra": {
      "googleFitClientId": "271265785455-2uog6f9v1ss1mvorq41hnobibvh7i5vr.apps.googleusercontent.com"
    }
  }
}
```

✅ **Verify the client ID matches** what you copied from Google Cloud Console.

### Step 3: Test the Integration

1. **Restart your development server:**
   ```bash
   npx expo start --web --clear
   ```

2. **Open the app in your browser:**
   - Should open automatically at `http://localhost:19006`
   - Or press `w` in the terminal

3. **Click "Connect Google Fit"**
   - You'll be redirected to Google's login page
   - Sign in with: `sahillather001@gmail.com`
   - Grant permissions
   - You'll be redirected back to your app

4. **Check the console for logs:**
   - Open browser DevTools (F12)
   - Look for:
     - `OAuth Result:` - should show success
     - `Fetching steps:` - shows the API call
     - `Total steps calculated:` - shows the result

### Step 4: Verify Step Data

Make sure you have step data in Google Fit:

1. **Install Google Fit on Android:**
   - Download from Play Store
   - Sign in with `sahillather001@gmail.com`
   - Grant permissions to track activity

2. **Add some test steps:**
   - Walk around with your phone
   - Or manually add steps in the app
   - Wait a few minutes for data to sync

3. **Refresh in your web app:**
   - Click "Sync Now" button
   - Check console logs for the response

## Troubleshooting Checklist

- [ ] Fitness API is enabled in Google Cloud Console
- [ ] OAuth consent screen is configured
- [ ] All 3 fitness scopes are added
- [ ] Test user email is added (for development)
- [ ] OAuth client ID is created (Web application type)
- [ ] Expo proxy redirect URI is added: `https://auth.expo.io/@kiroku/health-competition-app`
- [ ] JavaScript origin is added: `https://auth.expo.io`
- [ ] Client ID in `app.json` matches Google Cloud Console
- [ ] Development server is running on port 19006 or 8081
- [ ] Google Fit app has step data (for Android users)
- [ ] Browser console shows no CORS errors
- [ ] No "disallowed_useragent" error appears

## Common Issues

### "Error 403: disallowed_useragent"
✅ **FIXED** - The code now uses Expo's OAuth proxy. Just add the redirect URI to Google Cloud Console.

### "Authentication failed"
- Check that client ID matches
- Verify redirect URIs are correct
- Make sure you're using a test user account

### "No step data"
- Ensure Google Fit app is installed and has data
- Try manually adding steps in Google Fit
- Check that you granted all permissions

### "CORS error"
- Make sure JavaScript origins are added in Google Cloud Console
- Restart development server after config changes

## Next Steps After Setup

Once authentication works:
1. Test step counting
2. Test sync functionality
3. Test with different Google accounts
4. Deploy to production domain
5. Update redirect URIs for production

## Support

If you encounter issues:
1. Check browser console for detailed error logs
2. Verify all configuration steps above
3. See `GOOGLE_FIT_TROUBLESHOOTING.md` for detailed debugging
