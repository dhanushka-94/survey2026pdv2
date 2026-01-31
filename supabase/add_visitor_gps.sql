-- Add GPS location columns to visitor_logs for each visitor
-- Run this in your Supabase SQL Editor

ALTER TABLE visitor_logs ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION DEFAULT NULL;
ALTER TABLE visitor_logs ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_visitor_logs_location 
ON visitor_logs(latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
