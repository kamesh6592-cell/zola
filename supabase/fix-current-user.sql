-- ================================================
-- MEOW CHAT - Fix Current User Profile
-- Run this AFTER setup-database.sql if you already logged in
-- ================================================

-- This will create a profile for your current logged-in user
-- Replace 'd9ae4d57-4866-46db-8999-540a49c355ac' with your actual user ID if different

-- Get your user ID from auth.users table
SELECT id, email, raw_user_meta_data FROM auth.users;

-- Create user profile manually for existing auth user
INSERT INTO public.users (id, email, display_name, profile_image, created_at, updated_at, last_active_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)),
  au.raw_user_meta_data->>'avatar_url',
  NOW(),
  NOW(),
  NOW()
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE id = au.id);

-- Create user preferences for existing users
INSERT INTO public.user_preferences (user_id)
SELECT au.id
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.user_preferences WHERE user_id = au.id);

-- Verify the user was created
SELECT id, email, display_name, created_at FROM public.users;

-- ================================================
-- User profile fixed! Refresh your app now.
-- ================================================
