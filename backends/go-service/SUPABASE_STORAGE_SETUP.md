# Supabase Storage Integration for Avatar Uploads

## 🎯 Overview

This guide explains how to migrate from local file storage to **Supabase Storage** for user avatar uploads.

---

## 📋 Prerequisites

1. **Supabase Project** - You need an active Supabase project
2. **Supabase URL & Service Role Key** - From your Supabase project settings
3. **Storage Bucket** - Create a bucket named `avatars` in Supabase Storage

---

## 🪣 Step 1: Create Supabase Storage Bucket

### Via Supabase Dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New Bucket"**
4. Configure the bucket:
   - **Name**: `avatars`
   - **Public bucket**: ✅ **YES** (so avatars are publicly accessible)
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/*`

### Via SQL (Alternative):

```sql
-- Create the avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Set up RLS policies for the bucket
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 🔧 Step 2: Environment Configuration

### Backend (Go Service)

Add to `backends/go-service/.env`:

```env
# Existing variables
PORT=8080
DATABASE_URL=your_database_url
SUPABASE_JWT_SECRET=your_jwt_secret

# NEW: Supabase Storage Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_STORAGE_BUCKET=avatars
```

⚠️ **Important**: Use the **Service Role Key** (not the anon key) for backend operations.

### Frontend (Next.js)

Add to `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 📦 Step 3: Install Go Supabase Storage Client

The Go backend needs an HTTP client to interact with Supabase Storage API.

We'll use the native `net/http` package (already available) to make REST API calls to Supabase Storage.

**No additional dependencies needed!**

---

## 🏗️ Architecture

### Before (Local Storage):
```
User uploads avatar → Go Backend → Local filesystem (uploads/avatars/)
                                  → Database (stores local path)
Frontend requests avatar → Go Backend serves static file
```

### After (Supabase Storage):
```
User uploads avatar → Go Backend → Supabase Storage API
                                  → Database (stores Supabase URL)
Frontend requests avatar → Directly from Supabase CDN (fast!)
```

---

## 🔄 How It Works

### Upload Flow:

1. **Frontend** sends avatar file to Go backend
2. **Go Backend**:
   - Validates file (type, size)
   - Uploads to Supabase Storage via REST API
   - Receives public URL from Supabase
   - Stores URL in database
   - Returns profile with new avatar URL
3. **Frontend** displays avatar using Supabase public URL

### Avatar URL Format:

```
https://your-project.supabase.co/storage/v1/object/public/avatars/{userId}/{filename}
```

---

## 🔐 Security

### Backend (Service Role Key):
- ✅ Full access to Storage API
- ✅ Can upload/delete files
- ⚠️ **NEVER expose in frontend code**
- ⚠️ **Keep in .env file only**

### Frontend (Anon Key):
- ✅ Can read public files
- ✅ Can upload with RLS policies
- ✅ Safe to expose in client code

### RLS Policies:
- Users can only upload to their own folder (`avatars/{userId}/`)
- All avatars are publicly readable
- Users can delete their own avatars

---

## 📁 File Structure in Supabase Storage

```
avatars/
├── {userId1}/
│   └── avatar_{timestamp}.jpg
├── {userId2}/
│   └── avatar_{timestamp}.png
└── {userId3}/
    └── avatar_{timestamp}.webp
```

Each user has their own folder for organization and RLS enforcement.

---

## 🚀 Benefits of Supabase Storage

✅ **Cloud-based** - No local file storage needed  
✅ **CDN-powered** - Fast global delivery  
✅ **Scalable** - Handles millions of files  
✅ **Secure** - Built-in RLS policies  
✅ **Automatic backups** - Supabase handles it  
✅ **Image transformations** - Resize on-the-fly (optional)  
✅ **Direct frontend access** - No backend proxy needed  

---

## 🧪 Testing

### 1. Upload an avatar:
```bash
curl -X POST http://localhost:8080/api/v1/users/{userId}/avatar \
  -H "Authorization: Bearer {jwt_token}" \
  -F "avatar=@/path/to/image.jpg"
```

### 2. Check Supabase Storage:
- Go to Supabase Dashboard → Storage → avatars bucket
- You should see the uploaded file

### 3. Access avatar directly:
```
https://your-project.supabase.co/storage/v1/object/public/avatars/{userId}/avatar_{timestamp}.jpg
```

---

## 🔄 Migration from Local Storage

If you have existing avatars in `uploads/avatars/`, you'll need to:

1. **Upload existing files to Supabase Storage**
2. **Update database records** with new Supabase URLs
3. **Remove local files** (optional cleanup)

Migration script can be created if needed.

---

## 📝 API Changes

### Before:
```json
{
  "avatar": "/uploads/avatars/user-id_uuid.jpg"
}
```

### After:
```json
{
  "avatar": "https://your-project.supabase.co/storage/v1/object/public/avatars/user-id/avatar_1234567890.jpg"
}
```

Frontend code doesn't need changes - it just uses the URL!

---

## 🎉 Next Steps

1. ✅ Create `avatars` bucket in Supabase
2. ✅ Add environment variables
3. ✅ Update Go backend code (see implementation files)
4. ✅ Test avatar upload
5. ✅ Verify frontend displays avatars correctly

---

## 🆘 Troubleshooting

### Issue: "Bucket not found"
- **Solution**: Create the `avatars` bucket in Supabase Dashboard

### Issue: "403 Forbidden"
- **Solution**: Check Service Role Key is correct and bucket is public

### Issue: "File not uploading"
- **Solution**: Verify file size < 5MB and MIME type is `image/*`

### Issue: "Avatar not displaying"
- **Solution**: Check bucket is set to **public** in Supabase

---

## 📚 Resources

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase Storage API Reference](https://supabase.com/docs/reference/javascript/storage)
- [Storage RLS Policies](https://supabase.com/docs/guides/storage/security/access-control)
