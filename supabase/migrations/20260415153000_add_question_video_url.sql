ALTER TABLE questions
ADD COLUMN IF NOT EXISTS video_url TEXT;

COMMENT ON COLUMN questions.video_url IS 'Optional embeddable video link associated with the question';
