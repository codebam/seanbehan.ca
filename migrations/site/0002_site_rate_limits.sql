CREATE TABLE IF NOT EXISTS site_rate_limits (
	bucket_key TEXT NOT NULL,
	window_start INTEGER NOT NULL,
	count INTEGER NOT NULL,
	PRIMARY KEY (bucket_key, window_start)
);

-- The 1% cleanup sweep deletes by window_start; without this index that sweep
-- scans every fixed window the table has accumulated.
CREATE INDEX IF NOT EXISTS site_rate_limits_window_start ON site_rate_limits (window_start);
