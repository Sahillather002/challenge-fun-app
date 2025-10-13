# Firebase Setup & Error Fix Guide

## 🔥 Firebase 400 Error - Root Causes & Solutions

The **400 Bad Request** errors you're seeing are typically caused by:

### 1. **Firestore Security Rules** (Most Common)
Your Firestore database likely has default security rules that deny all reads/writes.

**Fix:** Update Firestore Security Rules in Firebase Console

```javascript
// Go to: Firebase Console > Firestore Database > Rules
// Replace with these rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read all users (for leaderboards)
    match /users/{userId} {
      allow read: if request.auth != null;
    }
    
    // Competition rules
    match /competitions/{competitionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.createdBy == request.auth.uid;
    }
    
    // Step data rules
    match /steps/{stepId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Payments
    match /payments/{paymentId} {
      allow read, write: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### 2. **Firebase Storage Rules** (For Image Upload)
Storage also needs proper security rules.

**Fix:** Update Storage Rules in Firebase Console

```javascript
// Go to: Firebase Console > Storage > Rules
// Replace with these rules:

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile images
    match /profile-images/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Competition images
    match /competition-images/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. **Enable Required Firebase Services**

Make sure these services are enabled in your Firebase project:

1. **Authentication**
   - Go to Firebase Console > Authentication
   - Enable "Email/Password" sign-in method

2. **Firestore Database**
   - Go to Firebase Console > Firestore Database
   - If not created, click "Create database"
   - Choose "Start in test mode" (then update rules as above)
   - Select a location (closest to your users)

3. **Storage**
   - Go to Firebase Console > Storage
   - Click "Get Started"
   - Accept default rules (then update as above)

### 4. **Check Firebase Project Configuration**

Verify your Firebase config in `src/config/firebase.ts`:
- ✅ API Key is correct
- ✅ Project ID matches your Firebase project
- ✅ Storage bucket URL is correct

## 🔧 Code Changes Made

### 1. **Enhanced Firebase Configuration**
- Added Firebase Storage support
- Added offline persistence for Firestore
- Better error handling and logging

### 2. **Updated firebaseHelpers**
- Added `storage.uploadImage()` for image uploads
- Added `storage.deleteImage()` for cleanup
- Added `storage.getDownloadURL()` for retrieving images
- Added error handling to all Firestore operations
- Added `{ merge: true }` to setDoc to prevent data loss

### 3. **ProfileScreen Image Upload**
- Now properly uploads images to Firebase Storage
- Stores download URL in user profile
- Shows upload progress with toast notifications
- Loads existing profile image on mount
- Handles errors gracefully

### 4. **User Type Updated**
- Added `profileImage?: string` field to User interface

## 🚀 Testing Steps

1. **Update Firebase Rules** (as shown above)
2. **Clear browser cache** and reload
3. **Try to update profile:**
   - Edit name/company/department
   - Click "Save Changes"
   - Should see success toast
4. **Try to upload image:**
   - Click on avatar
   - Select an image
   - Should see "Uploading..." then "Success" toast
   - Image should appear immediately

## 🐛 Debugging

If errors persist, check browser console for:

```javascript
// Look for these logs:
"🔥 Initializing Firebase..."
"✅ Firebase initialized successfully"

// Check for errors:
"Firestore updateDoc error:"
"Storage upload error:"
```

### Common Error Messages:

| Error | Cause | Solution |
|-------|-------|----------|
| `permission-denied` | Firestore rules too restrictive | Update security rules |
| `unauthenticated` | User not logged in | Ensure user is authenticated |
| `storage/unauthorized` | Storage rules deny access | Update storage rules |
| `quota-exceeded` | Free tier limit reached | Upgrade Firebase plan |

## 📝 Firebase Console URLs

- **Project Overview:** https://console.firebase.google.com/project/challenge-fun-app-98e01
- **Firestore Rules:** https://console.firebase.google.com/project/challenge-fun-app-98e01/firestore/rules
- **Storage Rules:** https://console.firebase.google.com/project/challenge-fun-app-98e01/storage/rules
- **Authentication:** https://console.firebase.google.com/project/challenge-fun-app-98e01/authentication/users

## ✅ Verification Checklist

- [ ] Firestore security rules updated
- [ ] Storage security rules updated
- [ ] Email/Password authentication enabled
- [ ] Firestore database created
- [ ] Storage bucket created
- [ ] Browser cache cleared
- [ ] App restarted
- [ ] Profile update works
- [ ] Image upload works

## 💡 Pro Tips

1. **Test Mode Rules:** For development, you can use test mode rules (allow all), but **never deploy to production** with these rules!

2. **Monitor Usage:** Check Firebase Console > Usage to ensure you're within free tier limits

3. **Error Logging:** All Firebase operations now log errors to console for easier debugging

4. **Offline Support:** Firestore persistence is enabled, so app works offline and syncs when back online

## 🆘 Still Having Issues?

If problems persist after following this guide:

1. Check Firebase Console > Firestore > Data to see if documents are being created
2. Check browser Network tab for actual error responses
3. Verify your Firebase project is active (not suspended)
4. Ensure billing is enabled if using paid features
5. Try creating a new user account to test fresh data

---

**Last Updated:** October 13, 2025
**Firebase SDK Version:** 9.23.0
