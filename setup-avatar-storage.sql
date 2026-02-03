-- ============================================
-- Supabase Avatar Storage Setup Script - SECURE VERSION
-- ============================================
-- This version implements secure avatar access with authentication
-- ============================================

-- Step 1: Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatar" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update avatar" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete avatar" ON storage.objects;
DROP POLICY IF EXISTS "Service role has full access" ON storage.objects;

-- Step 3: Create secure policies for avatars bucket

-- Policy 1: Allow AUTHENTICATED USERS to READ any avatar (for profile viewing)
-- This allows logged-in users to view other users' avatars
CREATE POLICY "Authenticated users can view avatars"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars');

-- Policy 2: Allow users to INSERT their own avatar (based on JWT user_id)
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Allow users to UPDATE their own avatar (based on JWT user_id)
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 4: Allow users to DELETE their own avatar (based on JWT user_id)
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 5: Allow service role full access (for backend operations)
CREATE POLICY "Service role has full access"
ON storage.objects
TO service_role
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

-- ============================================
-- Alternative: If you want avatars completely private
-- ============================================
-- Uncomment below if you want avatars accessible only to the owner

-- DROP POLICY IF EXISTS "Authenticated users can view avatars" ON storage.objects;
-- CREATE POLICY "Users can only view their own avatar"
-- ON storage.objects FOR SELECT
-- TO authenticated
-- USING (
--   bucket_id = 'avatars'
--   AND auth.uid()::text = (storage.foldername(name))[1]
-- );

-- ============================================
-- Verification Queries
-- ============================================

-- Check if policies were created successfully
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%avatar%' OR policyname LIKE '%Authenticated users can view avatars%' OR policyname LIKE '%Service role%'
ORDER BY policyname;

-- ============================================
-- Notes:
-- ============================================
-- 1. Make sure you've created the 'avatars' bucket first in the Supabase Dashboard
-- 2. Set the bucket to PUBLIC in the bucket settings
-- 3. After running this script, restart your Go backend
-- 4. Test by uploading an avatar through the web app
-- ============================================
