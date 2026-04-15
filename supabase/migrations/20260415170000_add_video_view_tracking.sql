CREATE TABLE IF NOT EXISTS video_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_video_views_survey_id ON video_views(survey_id);
CREATE INDEX IF NOT EXISTS idx_video_views_question_id ON video_views(question_id);
CREATE INDEX IF NOT EXISTS idx_video_views_session_id ON video_views(session_id);
CREATE INDEX IF NOT EXISTS idx_video_views_survey_session_question
    ON video_views(survey_id, session_id, question_id);

ALTER TABLE video_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert video views" ON video_views;
CREATE POLICY "Public can insert video views"
    ON video_views FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read video views" ON video_views;
CREATE POLICY "Public can read video views"
    ON video_views FOR SELECT
    USING (true);

COMMENT ON TABLE video_views IS 'Tracks each question video open event and viewed duration in seconds.';
COMMENT ON COLUMN video_views.duration_seconds IS 'How many seconds the video modal remained open for this event.';
