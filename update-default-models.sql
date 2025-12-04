-- Update default models for existing users and new signups
UPDATE users 
SET favorite_models = ARRAY[
  'gpt-4o-mini',
  'claude-3-5-haiku-latest', 
  'gemini-2.5-flash-lite',
  'grok-3-mini',
  'open-mistral-7b',
  'sonar',
  'openrouter:deepseek/deepseek-r1:free'
];

-- Update the default in the database setup for new users
ALTER TABLE users ALTER COLUMN favorite_models SET DEFAULT ARRAY[
  'gpt-4o-mini',
  'claude-3-5-haiku-latest', 
  'gemini-2.5-flash-lite',
  'grok-3-mini',
  'open-mistral-7b',
  'sonar',
  'openrouter:deepseek/deepseek-r1:free'
];

-- Update the trigger function to use these models for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id, email, display_name, profile_image, created_at, message_count, premium, anonymous,
    favorite_models, daily_message_count, daily_reset, last_active_at,
    daily_pro_message_count, daily_pro_reset, system_prompt
  ) VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url', NEW.created_at, 0, FALSE, FALSE,
    ARRAY['gpt-4o-mini', 'claude-3-5-haiku-latest', 'gemini-2.5-flash-lite', 'grok-3-mini', 'open-mistral-7b', 'sonar', 'openrouter:deepseek/deepseek-r1:free'],
    0, NEW.created_at, NEW.created_at, 0, NEW.created_at, NULL
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

DO $$
BEGIN
  RAISE NOTICE '✅ Default Models Updated!';
  RAISE NOTICE 'All users now have 7 free models available:';
  RAISE NOTICE '• GPT-4o Mini (OpenAI) - $0.15/$0.60 per 1M tokens';
  RAISE NOTICE '• Claude 3.5 Haiku (Anthropic) - $0.25/$1.25 per 1M tokens';
  RAISE NOTICE '• Gemini 2.5 Flash Lite (Google) - $0.075/$0.30 per 1M tokens';
  RAISE NOTICE '• Grok 3 Mini (xAI) - FREE model';
  RAISE NOTICE '• Mistral 7B (FREE open-source)';
  RAISE NOTICE '• Perplexity Sonar - $1/$1 per 1M tokens';
  RAISE NOTICE '• DeepSeek R1 (FREE via OpenRouter)';
END $$;