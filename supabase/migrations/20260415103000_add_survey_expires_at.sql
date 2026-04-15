-- Precise survey expiration (date + time). Legacy end_date remains for older rows.
ALTER TABLE surveys ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

UPDATE surveys
SET expires_at = end_date
WHERE expires_at IS NULL AND end_date IS NOT NULL;

COMMENT ON COLUMN surveys.expires_at IS 'Instant when the survey stops accepting public responses. If null, end_date is used.';

-- Public survey visibility and related policies: use COALESCE(expires_at, end_date)
DROP POLICY IF EXISTS "Public can read active surveys" ON surveys;
CREATE POLICY "Public can read active surveys"
    ON surveys FOR SELECT
    USING (
        is_active = true
        AND (start_date IS NULL OR start_date <= NOW())
        AND (COALESCE(expires_at, end_date) IS NULL OR COALESCE(expires_at, end_date) >= NOW())
    );

DROP POLICY IF EXISTS "Public can read categories of active surveys" ON categories;
CREATE POLICY "Public can read categories of active surveys"
    ON categories FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM surveys
            WHERE surveys.id = categories.survey_id
            AND surveys.is_active = true
            AND (surveys.start_date IS NULL OR surveys.start_date <= NOW())
            AND (COALESCE(surveys.expires_at, surveys.end_date) IS NULL OR COALESCE(surveys.expires_at, surveys.end_date) >= NOW())
        )
    );

DROP POLICY IF EXISTS "Public can read questions of active surveys" ON questions;
CREATE POLICY "Public can read questions of active surveys"
    ON questions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM surveys
            WHERE surveys.id = questions.survey_id
            AND surveys.is_active = true
            AND (surveys.start_date IS NULL OR surveys.start_date <= NOW())
            AND (COALESCE(surveys.expires_at, surveys.end_date) IS NULL OR COALESCE(surveys.expires_at, surveys.end_date) >= NOW())
        )
    );

DROP POLICY IF EXISTS "Public can insert responses" ON responses;
CREATE POLICY "Public can insert responses"
    ON responses FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM surveys
            WHERE surveys.id = responses.survey_id
            AND surveys.is_active = true
            AND (surveys.start_date IS NULL OR surveys.start_date <= NOW())
            AND (COALESCE(surveys.expires_at, surveys.end_date) IS NULL OR COALESCE(surveys.expires_at, surveys.end_date) >= NOW())
        )
    );

DROP POLICY IF EXISTS "Public can read active rewards for active surveys" ON rewards;
CREATE POLICY "Public can read active rewards for active surveys"
    ON rewards FOR SELECT
    USING (
        is_active = true
        AND EXISTS (
            SELECT 1 FROM surveys
            WHERE surveys.id = rewards.survey_id
            AND surveys.is_active = true
            AND (surveys.start_date IS NULL OR surveys.start_date <= NOW())
            AND (COALESCE(surveys.expires_at, surveys.end_date) IS NULL OR COALESCE(surveys.expires_at, surveys.end_date) >= NOW())
        )
    );
