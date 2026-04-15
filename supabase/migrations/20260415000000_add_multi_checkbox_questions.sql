ALTER TABLE questions
ADD COLUMN IF NOT EXISTS checkbox_options JSONB DEFAULT NULL;

ALTER TABLE questions
DROP CONSTRAINT IF EXISTS questions_question_type_check;

ALTER TABLE questions
ADD CONSTRAINT questions_question_type_check
CHECK (question_type IN ('like_dislike', 'rating_1_5', 'combined', 'multi_checkbox'));

COMMENT ON COLUMN questions.checkbox_options IS 'Array of checkbox options for multi_checkbox question type';
