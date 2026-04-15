ALTER TABLE questions
DROP CONSTRAINT IF EXISTS questions_question_type_check;

ALTER TABLE questions
ADD CONSTRAINT questions_question_type_check
CHECK (question_type IN ('like_dislike', 'rating_1_5', 'combined', 'multi_checkbox', 'all_three'));
