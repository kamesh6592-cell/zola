-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message_count INTEGER DEFAULT 0,
  premium BOOLEAN DEFAULT FALSE,
  favorite_models TEXT[] DEFAULT ARRAY['gpt-4.1-nano'],
  preferences JSONB DEFAULT '{}'::JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Service role can insert users" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Create RLS policies
CREATE POLICY "Users can read own data" ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can insert users" ON users
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can insert own data" ON users
FOR INSERT WITH CHECK (auth.uid() = id);