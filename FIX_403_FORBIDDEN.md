# Fix 403 Forbidden Error - Missing Fitness API Scopes

## The Problem

You're getting **403 Forbidden** when calling the Fitness API:
```
POST https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate 403 (Forbidden)
Authentication error - token may be expired
```

This means:
- ✅ OAuth authentication succeeded
- ✅ You have a valid access token
- ❌ The token **doesn't have Fitness API permissions**

## Root Cause

The OAuth consent screen in Google Cloud Console is missing the Fitness API scopes. When you authenticated, Google only gave you basic profile access, not Fitness data access.

## The Fix - Add Fitness Scopes to OAuth Consent Screen

### Step 1: Go to Google Cloud Console

1. Open: https://console.cloud.google.com/
2. Select your project
3. Navigate to: **APIs & Services** → **OAuth consent screen**

### Step 2: Edit OAuth Consent Screen

1. Click **EDIT APP** button
2. Click **SAVE AND CONTINUE** on the first page (App information)
3. On the **Scopes** page, click **ADD OR REMOVE SCOPES**

### Step 3: Add Fitness API Scopes

In the "Update selected scopes" panel:

1. **Filter scopes** - Type: `fitness`

2. **Check these 3 scopes:**
   - ☑️ `https://www.googleapis.com/auth/fitness.activity.read`
     - *View your activity information in Google Fit*
   - ☑️ `https://www.googleapis.com/auth/fitness.body.read`
     - *View body sensor information in Google Fit*
   - ☑️ `https://www.googleapis.com/auth/fitness.location.read`
     - *View your Google Fit speed and distance data*

3. Click **UPDATE** button

4. Click **SAVE AND CONTINUE**

5. On **Test users** page:
   - Make sure `sahillather001@gmail.com` is added
   - Click **SAVE AND CONTINUE**

6. Click **BACK TO DASHBOARD**

### Step 4: Verify Scopes Are Added

Back on the OAuth consent screen dashboard, you should see:

**Scopes for Google APIs:**
- `.../auth/fitness.activity.read`
- `.../auth/fitness.body.read`  
- `.../auth/fitness.location.read`

### Step 5: Clear Old Token and Re-authenticate

The old token doesn't have the new scopes, so you need to get a new one:

1. **Clear browser storage:**
   - Open DevTools (F12)
   - Go to Application tab → Local Storage → http://localhost:19006
   - Delete `google_fit_token` key
   - Delete `google_fit_auth_pending` key

2. **Refresh the page**

3. **Click "Connect Google Fit" again**

4. **Important:** On the Google consent screen, you should now see:
   ```
   Challenge fun app wants to access your Google Account
   
   This will allow Challenge fun app to:
   • View your activity information in Google Fit
   • View body sensor information in Google Fit
   • View your Google Fit speed and distance data
   ```

5. Click **Continue** to grant the new permissions

### Step 6: Verify It Works

After re-authenticating, check the console:

```
✅ OAuth callback detected, token received
✅ Access token set, service is now authorized
✅ Fetching steps from Google Fit...
✅ API Response Status: 200  ← Should be 200, not 403!
✅ Total steps calculated: 1234
```

## Why This Happens

### OAuth Scopes Explained

When you authenticate with Google:
1. Your app requests specific **scopes** (permissions)
2. User sees what permissions you're requesting
3. User grants or denies
4. Google issues a token with **only the granted scopes**

If the scopes aren't in the OAuth consent screen configuration, they won't be requested, and the token won't have those permissions.

### The OAuth Flow

```
App → Google: "I want these scopes: [fitness.activity.read, ...]"
Google → User: "App wants to access your Fitness data. Allow?"
User → Google: "Yes, allow"
Google → App: "Here's a token with those scopes"
App → Fitness API: "Get steps" (with token)
Fitness API: Checks token → Has fitness.activity.read scope → ✅ Returns data
```

Without the scopes:
```
App → Google: "I want these scopes: [profile, email]"  ← Missing fitness scopes!
Google → User: "App wants basic profile. Allow?"
User → Google: "Yes, allow"
Google → App: "Here's a token with profile/email scopes only"
App → Fitness API: "Get steps" (with token)
Fitness API: Checks token → No fitness scopes → ❌ 403 Forbidden
```

## Common Mistakes

### ❌ Mistake 1: Scopes in code but not in consent screen
- Code requests scopes: `GOOGLE_FIT_SCOPES = ['fitness.activity.read', ...]`
- But OAuth consent screen doesn't have them configured
- Result: Google ignores the scope request, issues token without them

### ❌ Mistake 2: Not re-authenticating after adding scopes
- You add scopes to consent screen ✅
- But keep using old token ❌
- Old token doesn't have new scopes
- Result: Still get 403

### ❌ Mistake 3: Wrong scope names
- Using `fitness.activity` instead of `fitness.activity.read`
- Result: Scope not recognized, not granted

## Verification Checklist

After following the steps above:

- [ ] OAuth consent screen shows all 3 fitness scopes
- [ ] Test user email is added
- [ ] Old token cleared from browser storage
- [ ] Re-authenticated and saw fitness permissions in consent screen
- [ ] API returns 200 instead of 403
- [ ] Steps are displayed in the app

## If Still Getting 403

### Check 1: Verify the token has correct scopes

Add this temporary debug code to see what scopes your token has:

```typescript
// In GoogleFitService.ts, after getting the token
const tokenInfo = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${this.accessToken}`);
const info = await tokenInfo.json();
console.log('Token scopes:', info.scope);
```

You should see:
```
Token scopes: https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read https://www.googleapis.com/auth/fitness.location.read
```

### Check 2: Verify Fitness API is enabled

1. Go to: APIs & Services → Library
2. Search: "Fitness API"
3. Should show "API enabled" (not "Enable" button)

### Check 3: Try with a different Google account

Sometimes account-specific settings can cause issues. Try with a different test account.

## Production Considerations

### Publishing the OAuth Consent Screen

For production (users outside your test user list):

1. OAuth consent screen must be **Published** (not Testing)
2. May require **Google verification** for sensitive scopes like Fitness
3. Verification process can take days/weeks
4. Need privacy policy and terms of service URLs

### Scope Justification

Google may ask why you need each scope:
- **fitness.activity.read**: "To track and display user's daily step count in competitions"
- **fitness.body.read**: "To show comprehensive health metrics"
- **fitness.location.read**: "To calculate distance traveled during activities"

## Summary

The 403 error is **not a code issue** - it's a **configuration issue**:

1. ✅ Code is correct (requesting right scopes)
2. ❌ Google Cloud Console missing scope configuration
3. ✅ Fix: Add scopes to OAuth consent screen
4. ✅ Re-authenticate to get new token with scopes

After adding the scopes and re-authenticating, the 403 error will be resolved!
