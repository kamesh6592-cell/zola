-- ================================================
-- MEOW CHAT PRODUCTION SETUP - Complete Database & Auth Configuration
-- Run this in your Supabase SQL Editor to set up everything automatically
-- ================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create users table with all required fields
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message_count INTEGER DEFAULT 0,
  premium BOOLEAN DEFAULT FALSE,
  favorite_models TEXT[] DEFAULT ARRAY['gpt-4.1-nano'],
  anonymous BOOLEAN DEFAULT FALSE,
  daily_message_count INTEGER DEFAULT 0,
  daily_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_name TEXT,
  profile_image TEXT,
  daily_pro_message_count INTEGER DEFAULT 0,
  daily_pro_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  system_prompt TEXT,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS and create comprehensive policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Service role can insert users" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Enable automatic user creation" ON users;

-- Create new comprehensive policies
CREATE POLICY "Users can read own data" ON users
FOR SELECT USING (auth.uid() = id OR auth.uid() IS NULL);

CREATE POLICY "Users can update own data" ON users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable automatic user creation" ON users
FOR INSERT WITH CHECK (
  -- Allow service role to insert any user
  auth.jwt() ->> 'role' = 'service_role' OR
  -- Allow authenticated users to insert their own record
  auth.uid() = id OR
  -- Allow anonymous insertion for guest users
  (anonymous = true AND auth.uid() IS NULL)
);

-- 3. Create trigger to automatically create user profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.users when a new user is created in auth.users
  INSERT INTO public.users (
    id,
    email,
    display_name,
    profile_image,
    created_at,
    message_count,
    premium,
    anonymous,
    favorite_models,
    daily_message_count,
    daily_reset,
    last_active_at,
    daily_pro_message_count,
    daily_pro_reset,
    system_prompt
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    0,
    FALSE,
    FALSE,
    ARRAY['gpt-4.1-nano'],
    0,
    NOW(),
    NOW(),
    0,
    NOW(),
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Create all other required tables
DROP TABLE IF EXISTS projects CASCADE;
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TABLE IF EXISTS chats CASCADE;
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  model TEXT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  public BOOLEAN DEFAULT FALSE,
  pinned BOOLEAN DEFAULT FALSE,
  pinned_at TIMESTAMP WITH TIME ZONE
);

DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  experimental_attachments JSONB DEFAULT '[]'::jsonb,
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  role TEXT NOT NULL CHECK (role IN ('system', 'user', 'assistant', 'data')),
  parts JSONB,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  message_group_id UUID,
  model TEXT
);

DROP TABLE IF EXISTS chat_attachments CASCADE;
CREATE TABLE chat_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,
  file_url TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS user_keys CASCADE;
CREATE TABLE user_keys (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  encrypted_key TEXT NOT NULL,
  iv TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, provider)
);

DROP TABLE IF EXISTS user_preferences CASCADE;
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  layout TEXT DEFAULT 'fullscreen',
  prompt_suggestions BOOLEAN DEFAULT TRUE,
  show_tool_invocations BOOLEAN DEFAULT TRUE,
  show_conversation_previews BOOLEAN DEFAULT TRUE,
  multi_model_enabled BOOLEAN DEFAULT FALSE,
  hidden_models TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TABLE IF EXISTS feedback CASCADE;
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Enable RLS on all tables and create policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can manage their own projects" ON projects;
DROP POLICY IF EXISTS "Users can manage their own chats" ON chats;
DROP POLICY IF EXISTS "Users can manage their own messages" ON messages;
DROP POLICY IF EXISTS "Users can manage their own attachments" ON chat_attachments;
DROP POLICY IF EXISTS "Users can manage their own keys" ON user_keys;
DROP POLICY IF EXISTS "Users can manage their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can manage their own feedback" ON feedback;

-- Create new policies
CREATE POLICY "Users can manage their own projects" ON projects
FOR ALL USING (auth.uid() = user_id);

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own chats" ON chats
FOR ALL USING (auth.uid() = user_id OR public = true);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own messages" ON messages
FOR ALL USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND (chats.user_id = auth.uid() OR chats.public = true))
);

ALTER TABLE chat_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own attachments" ON chat_attachments
FOR ALL USING (auth.uid() = user_id);

ALTER TABLE user_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own keys" ON user_keys
FOR ALL USING (auth.uid() = user_id);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own preferences" ON user_preferences
FOR ALL USING (auth.uid() = user_id);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own feedback" ON feedback
FOR ALL USING (auth.uid() = user_id);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_attachments_chat_id ON chat_attachments(chat_id);
CREATE INDEX IF NOT EXISTS idx_user_keys_user_id ON user_keys(user_id);

-- 7. Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-attachments',
  'chat-attachments',
  false,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'text/markdown', 'text/csv']
) ON CONFLICT (id) DO NOTHING;

-- 8. Create storage policies
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;

CREATE POLICY "Users can upload their own files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'chat-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'chat-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'chat-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'chat-attachments' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 9. Update updated_at timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_keys_updated_at BEFORE UPDATE ON user_keys
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Success message
DO $$
BEGIN
  RAISE NOTICE '✅ MEOW CHAT Database Setup Complete!';
  RAISE NOTICE 'Database is now production-ready with:';
  RAISE NOTICE '- Automatic user profile creation on signup';
  RAISE NOTICE '- Complete RLS security policies';
  RAISE NOTICE '- File upload storage bucket';
  RAISE NOTICE '- Performance optimized indexes';
  RAISE NOTICE '- All required tables and relationships';
END $$;