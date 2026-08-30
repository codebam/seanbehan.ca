CREATE TABLE site_stripe_fulfillments (
	checkout_session_id TEXT PRIMARY KEY,
	payment_intent_id TEXT NOT NULL UNIQUE,
	stripe_event_id TEXT NOT NULL UNIQUE,
	product_id TEXT NOT NULL,
	release_version TEXT NOT NULL,
	status TEXT NOT NULL CHECK (status IN ('sending', 'fulfilled', 'failed')),
	attempts INTEGER NOT NULL DEFAULT 1,
	email_message_id TEXT,
	last_error TEXT,
	created_at INTEGER NOT NULL,
	updated_at INTEGER NOT NULL,
	fulfilled_at INTEGER
);
