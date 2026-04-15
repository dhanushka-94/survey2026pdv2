-- Anonymous Survey System Database Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT false,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    description TEXT,
    media_url TEXT,
    question_type TEXT NOT NULL CHECK (question_type IN ('like_dislike', 'rating_1_5')),
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    age_range TEXT NOT NULL,
    gender TEXT NOT NULL,
    answer_value TEXT NOT NULL,
    device_type TEXT DEFAULT 'desktop',
    browser TEXT DEFAULT 'Unknown',
    os TEXT DEFAULT 'Unknown',
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE session_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    current_page INTEGER DEFAULT 0,
    question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
    time_spent_seconds INTEGER DEFAULT 0,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(survey_id, session_id)
);

CREATE TABLE media_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_survey_id ON categories(survey_id);
CREATE INDEX idx_categories_order ON categories(survey_id, order_index);
CREATE INDEX idx_questions_survey_id ON questions(survey_id);
CREATE INDEX idx_questions_category_id ON questions(category_id);
CREATE INDEX idx_questions_order ON questions(survey_id, order_index);
CREATE INDEX idx_responses_survey_id ON responses(survey_id);
CREATE INDEX idx_responses_question_id ON responses(question_id);
CREATE INDEX idx_responses_session_id ON responses(session_id);
CREATE INDEX idx_responses_created_at ON responses(created_at);
CREATE INDEX idx_session_tracking_survey_id ON session_tracking(survey_id);
CREATE INDEX idx_session_tracking_session_id ON session_tracking(session_id);
CREATE INDEX idx_session_tracking_last_active ON session_tracking(last_active_at);
CREATE INDEX idx_media_views_survey_id ON media_views(survey_id);
CREATE INDEX idx_media_views_question_id ON media_views(question_id);
CREATE INDEX idx_media_views_session_id ON media_views(session_id);

ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active surveys"
    ON surveys FOR SELECT
    USING (
        is_active = true
        AND (start_date IS NULL OR start_date <= NOW())
        AND (end_date IS NULL OR end_date >= NOW())
    );

CREATE POLICY "Service role can do everything on surveys"
    ON surveys FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Public can read categories of active surveys"
    ON categories FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM surveys
            WHERE surveys.id = categories.survey_id
            AND surveys.is_active = true
            AND (surveys.start_date IS NULL OR surveys.start_date <= NOW())
            AND (surveys.end_date IS NULL OR surveys.end_date >= NOW())
        )
    );

CREATE POLICY "Public can read questions of active surveys"
    ON questions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM surveys
            WHERE surveys.id = questions.survey_id
            AND surveys.is_active = true
            AND (surveys.start_date IS NULL OR surveys.start_date <= NOW())
            AND (surveys.end_date IS NULL OR surveys.end_date >= NOW())
        )
    );

CREATE POLICY "Public can insert responses"
    ON responses FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM surveys
            WHERE surveys.id = responses.survey_id
            AND surveys.is_active = true
            AND (surveys.start_date IS NULL OR surveys.start_date <= NOW())
            AND (surveys.end_date IS NULL OR surveys.end_date >= NOW())
        )
    );

CREATE POLICY "Public can insert session tracking"
    ON session_tracking FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public can update their own session tracking"
    ON session_tracking FOR UPDATE
    USING (true);

CREATE POLICY "Public can read session tracking"
    ON session_tracking FOR SELECT
    USING (true);

CREATE POLICY "Public can insert media views"
    ON media_views FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public can read media views"
    ON media_views FOR SELECT
    USING (true);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_surveys_updated_at BEFORE UPDATE ON surveys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS visitor_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    browser TEXT,
    os TEXT,
    device_type TEXT,
    ip_address TEXT,
    country TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_at ON visitor_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_path ON visitor_logs(path);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_ip ON visitor_logs(ip_address);

ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;

ALTER TABLE visitor_logs ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION DEFAULT NULL;
ALTER TABLE visitor_logs ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_visitor_logs_location
ON visitor_logs(latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

ALTER TABLE session_tracking ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION DEFAULT NULL;
ALTER TABLE session_tracking ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_session_tracking_location
ON session_tracking(latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

ALTER TABLE questions
ADD COLUMN IF NOT EXISTS media_urls JSONB DEFAULT NULL;

ALTER TABLE questions
DROP CONSTRAINT IF EXISTS questions_question_type_check;

ALTER TABLE questions
ADD CONSTRAINT questions_question_type_check
CHECK (question_type IN ('like_dislike', 'rating_1_5', 'combined'));

CREATE INDEX IF NOT EXISTS idx_questions_media_urls ON questions USING GIN (media_urls);

COMMENT ON COLUMN questions.media_urls IS 'Array of media URLs for multiple images';
COMMENT ON COLUMN questions.question_type IS 'Type: like_dislike, rating_1_5, or combined (both)';
