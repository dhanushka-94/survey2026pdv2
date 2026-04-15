ALTER TABLE visitor_logs
ADD COLUMN IF NOT EXISTS platform TEXT;

ALTER TABLE visitor_logs
ADD COLUMN IF NOT EXISTS language TEXT;

ALTER TABLE visitor_logs
ADD COLUMN IF NOT EXISTS screen_resolution TEXT;

ALTER TABLE visitor_logs
ADD COLUMN IF NOT EXISTS timezone TEXT;
