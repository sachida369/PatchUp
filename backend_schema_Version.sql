-- Example schema for Patchup

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  sender VARCHAR(50),
  recipient VARCHAR(15),
  message TEXT,
  status VARCHAR(20), -- pending | unlocked
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add other tables as needed, e.g., appointments, messages, etc.
