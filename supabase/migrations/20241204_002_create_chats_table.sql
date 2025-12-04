-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  messages JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pinned BOOLEAN DEFAULT FALSE,
  shared BOOLEAN DEFAULT FALSE
);

-- Create indexes for chats
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at);
CREATE INDEX IF NOT EXISTS idx_chats_pinned ON chats(pinned);

-- Enable RLS on chats table
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own chats" ON chats;

-- Create RLS policies for chats
CREATE POLICY "Users can manage their own chats" ON chats
FOR ALL USING (auth.uid() = user_id);