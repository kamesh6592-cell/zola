-- ================================================
-- EMERGENCY FIX - Run this NOW in Supabase SQL Editor
-- This will create your user profile immediately
-- ================================================

-- Step 1: Check if your auth user exists
SELECT id, email, raw_user_meta_data FROM auth.users;

-- Step 2: Create your user profile (for the logged-in user)
INSERT INTO public.users (
  id, 
  email, 
  display_name, 
  profile_image, 
  created_at, 
  updated_at, 
  last_active_at,
  message_count,
  premium,
  favorite_models,
  anonymous,
  daily_message_count,
  daily_reset,
  daily_pro_message_count,
  daily_pro_reset
)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name', 
    au.raw_user_meta_data->>'name', 
    split_part(au.email, '@', 1)
  ),
  au.raw_user_meta_data->>'avatar_url',
  NOW(),
  NOW(),
  NOW(),
  0,
  FALSE,
  ARRAY['gemini-2.5-flash-lite'],
  FALSE,
  0,
  NOW(),
  0,
  NOW()
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE id = au.id);

-- Step 3: Create user preferences
INSERT INTO public.user_preferences (
  user_id,
  layout,
  prompt_suggestions,
  show_tool_invocations,
  show_conversation_previews,
  multi_model_enabled,
  hidden_models,
  created_at,
  updated_at
)
SELECT 
  au.id,
  NULL,
  TRUE,
  TRUE,
  TRUE,
  FALSE,
  ARRAY[]::TEXT[],
  NOW(),
  NOW()
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.user_preferences WHERE user_id = au.id);

-- Step 4: Create the auto-create trigger for future users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id, 
    email, 
    display_name, 
    profile_image, 
    created_at, 
    updated_at, 
    last_active_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name', 
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW(),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, users.display_name),
    profile_image = COALESCE(EXCLUDED.profile_image, users.profile_image),
    updated_at = NOW(),
    last_active_at = NOW();
  
  -- Also create default user preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Verify everything was created
SELECT 
  u.id, 
  u.email, 
  u.display_name, 
  u.created_at,
  CASE WHEN up.user_id IS NOT NULL THEN 'YES' ELSE 'NO' END as has_preferences
FROM public.users u
LEFT JOIN public.user_preferences up ON u.id = up.user_id;

-- ================================================
-- Done! Now refresh your MEOW CHAT app
-- ================================================
