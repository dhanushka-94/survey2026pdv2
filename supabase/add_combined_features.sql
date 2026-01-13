-- Add support for combined question type and multiple images
-- Run this in Supabase SQL Editor

-- 1. Add media_urls column for multiple images (JSONB array)
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS media_urls JSONB DEFAULT NULL;

-- 2. Update question_type check constraint to include 'combined'
ALTER TABLE questions 
DROP CONSTRAINT IF EXISTS questions_question_type_check;

ALTER TABLE questions
ADD CONSTRAINT questions_question_type_check 
CHECK (question_type IN ('like_dislike', 'rating_1_5', 'combined'));

-- 3. Create index for media_urls
CREATE INDEX IF NOT EXISTS idx_questions_media_urls ON questions USING GIN (media_urls);

-- 4. Update responses table to support combined answers (stored as JSON)
-- Format: {"like": "like", "rating": "5"} or {"like": "dislike", "rating": "3"}
-- No schema change needed - answer_value already accepts text

COMMENT ON COLUMN questions.media_urls IS 'Array of media URLs for multiple images';
COMMENT ON COLUMN questions.question_type IS 'Type: like_dislike, rating_1_5, or combined (both)';
