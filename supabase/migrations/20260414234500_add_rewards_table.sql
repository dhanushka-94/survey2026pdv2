CREATE TABLE IF NOT EXISTS rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    coupon_code TEXT,
    website_url TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rewards_survey_id ON rewards(survey_id);
CREATE INDEX IF NOT EXISTS idx_rewards_is_active ON rewards(is_active);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active rewards for active surveys"
    ON rewards FOR SELECT
    USING (
        is_active = true
        AND EXISTS (
            SELECT 1 FROM surveys
            WHERE surveys.id = rewards.survey_id
            AND surveys.is_active = true
            AND (surveys.start_date IS NULL OR surveys.start_date <= NOW())
            AND (surveys.end_date IS NULL OR surveys.end_date >= NOW())
        )
    );

CREATE POLICY "Service role can do everything on rewards"
    ON rewards FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
