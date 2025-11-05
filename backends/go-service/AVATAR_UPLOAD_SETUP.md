# Avatar Upload Feature Setup

## ✅ Backend Implementation Complete

### **What's Been Added:**

1. **File Upload Handler** (`internal/handlers/user.go`)
   - `UploadAvatar()` - Handles multipart file uploads
   - Validates file type (images only)
   - Validates file size (5MB max)
   - Generates unique filenames
   - Saves to `uploads/avatars/` directory

2. **Service Method** (`internal/services/user.go`)
   - `UpdateUserAvatar()` - Updates user's avatar URL in database

3. **API Route** (`cmd/server/main.go`)
   - `POST /api/v1/users/{userId}/avatar` - Upload endpoint
   - `/uploads/` - Static file serving for avatars

4. **Frontend API Client** (`apps/web/src/lib/api.ts`)
   - `api.user.uploadAvatar()` - Upload method with FormData

5. **Frontend UI** (`apps/web/src/app/dashboard/profile/page.tsx`)
   - Camera button triggers file picker
   - Image preview before upload
   - Upload/Cancel buttons
   - Real-time upload with backend integration

---

## 🚀 How to Use

### **Backend:**
```bash
cd backends/go-service
go run .\cmd\server\main.go
```

### **Frontend:**
```bash
cd apps/web
npm run dev
```

### **Test the Feature:**
1. Navigate to Profile page
2. Click camera icon on avatar
3. Select an image (JPEG, PNG, JPG, WebP)
4. Click "Upload" button
5. Avatar updates immediately

---

## 📁 File Structure

```
backends/go-service/
├── uploads/
│   └── avatars/          # Uploaded avatar images
│       └── {userId}_{uuid}.jpg
├── internal/
│   ├── handlers/
│   │   └── user.go       # UploadAvatar handler
│   └── services/
│       └── user.go       # UpdateUserAvatar service
└── cmd/
    └── server/
        └── main.go       # Route + static file serving
```

---

## 🗄️ Database

The `users` table already has an `avatar` column (TEXT):
```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255),
    avatar TEXT,           -- Stores avatar URL
    bio TEXT,
    country VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## 🔒 Security Features

✅ **File Type Validation** - Only images allowed  
✅ **File Size Limit** - 5MB maximum  
✅ **Unique Filenames** - UUID prevents conflicts  
✅ **Authentication Required** - JWT token validation  
✅ **User-Specific Uploads** - UserID in filename  

---

## 🌐 API Endpoint

**Upload Avatar:**
```
POST /api/v1/users/{userId}/avatar
Content-Type: multipart/form-data
Authorization: Bearer {jwt_token}

Body:
- avatar: File (image file)

Response:
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name",
    "avatar": "/uploads/avatars/user-id_uuid.jpg",
    ...
  }
}
```

**Access Avatar:**
```
GET http://localhost:8080/uploads/avatars/{filename}
```

---

## ✨ Features

- ✅ Real-time image preview
- ✅ File validation (type & size)
- ✅ Progress indicators
- ✅ Error handling with toast notifications
- ✅ Automatic profile update
- ✅ Static file serving
- ✅ Database persistence

---

## 🔧 Configuration

**Backend** (`.env`):
```env
PORT=8080
DATABASE_URL=your_database_url
SUPABASE_JWT_SECRET=your_jwt_secret
```

**Frontend** (`apps/web/src/lib/api.ts`):
```typescript
const API_BASE_URL = 'http://localhost:8080/api/v1';
```

---

## 📝 Notes

- Uploaded files are stored in `backends/go-service/uploads/avatars/`
- Avatar URLs are relative: `/uploads/avatars/{filename}`
- Full URL: `http://localhost:8080/uploads/avatars/{filename}`
- Old avatars are NOT automatically deleted (implement cleanup if needed)

---

## 🎉 Status: READY TO USE!

The avatar upload feature is fully integrated and ready for testing!
