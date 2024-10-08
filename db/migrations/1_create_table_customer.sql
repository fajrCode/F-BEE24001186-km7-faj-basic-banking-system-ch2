CREATE Table IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(50) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT NOT NULL
);

ALTER TABLE customers
ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE customers
ADD COLUMN updated_at TIMESTAMP;

CREATE INDEX ON customers (full_name);

DROP TABLE IF EXISTS customers;