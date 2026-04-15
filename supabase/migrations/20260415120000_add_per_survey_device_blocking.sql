-- Per-survey device blocking toggle and response device identifier.
ALTER TABLE surveys
ADD COLUMN IF NOT EXISTS block_multiple_submissions_per_device BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE responses
ADD COLUMN IF NOT EXISTS device_id TEXT;

CREATE INDEX IF NOT EXISTS idx_responses_survey_device
ON responses(survey_id, device_id)
WHERE device_id IS NOT NULL;

COMMENT ON COLUMN surveys.block_multiple_submissions_per_device IS
'If true, device can submit this survey only once.';

COMMENT ON COLUMN responses.device_id IS
'Browser-local device identifier used to prevent repeated submissions when enabled.';
