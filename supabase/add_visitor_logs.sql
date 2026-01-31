-- Visitor Logs - Log every site visit
-- Run this in Supabase SQL Editor

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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_at ON visitor_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_path ON visitor_logs(path);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_ip ON visitor_logs(ip_address);

-- RLS: With no policies, anon gets no access. Service role bypasses RLS for admin.
ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;

-- Allow inserts from authenticated context (our server uses service_role)
CREATE POLICY "Allow insert visitor logs"
    ON visitor_logs FOR INSERT
    WITH CHECK (true);
