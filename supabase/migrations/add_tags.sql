-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create post_tags junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS post_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(post_id, tag_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- Enable Row Level Security (RLS)
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for tags table
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can insert tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for post_tags table
CREATE POLICY "Post tags are viewable by everyone"
  ON post_tags FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can insert post tags"
  ON post_tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete post tags"
  ON post_tags FOR DELETE
  TO authenticated
  USING (true);
