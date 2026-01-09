-- ================================================
-- Fix Storage Policies for File Uploads
-- Run this in Supabase SQL Editor if file uploads are failing
-- ================================================

-- First, drop all existing storage policies
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public files are viewable" ON storage.objects;

-- Make sure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-attachments', 
  'chat-attachments', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/heic', 'image/heif', 'text/plain', 'text/markdown']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/heic', 'image/heif', 'text/plain', 'text/markdown']::text[];

-- Create more permissive storage policies for authenticated users
-- Policy 1: Authenticated users can upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'chat-attachments'
);

-- Policy 2: Authenticated users can view all files in chat-attachments
CREATE POLICY "Authenticated users can view files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-attachments'
);

-- Policy 3: Users can delete their own files (based on folder structure)
CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Users can update their own files
CREATE POLICY "Users can update own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'chat-attachments' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 5: Public can view files (since bucket is public)
CREATE POLICY "Public can view chat attachments"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'chat-attachments'
);

-- ================================================
-- Storage policies updated! Try uploading files again.
-- ================================================
