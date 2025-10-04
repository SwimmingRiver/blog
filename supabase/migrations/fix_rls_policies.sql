-- Drop existing policies
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON tags;
DROP POLICY IF EXISTS "Only authenticated users can insert tags" ON tags;
DROP POLICY IF EXISTS "Post tags are viewable by everyone" ON post_tags;
DROP POLICY IF EXISTS "Only authenticated users can insert post tags" ON post_tags;
DROP POLICY IF EXISTS "Only authenticated users can delete post tags" ON post_tags;

-- Recreate policies for tags table
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert tags"
  ON tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Recreate policies for post_tags table
CREATE POLICY "Post tags are viewable by everyone"
  ON post_tags FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert post tags"
  ON post_tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete post tags"
  ON post_tags FOR DELETE
  TO authenticated
  USING (true);
