-- Add GPS location columns to session_tracking for survey-filling devices
-- Run this in your Supabase SQL Editor

ALTER TABLE session_tracking ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION DEFAULT NULL;
ALTER TABLE session_tracking ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION DEFAULT NULL;

-- Index for location-based queries (optional)
CREATE INDEX IF NOT EXISTS idx_session_tracking_location 
ON session_tracking(latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
