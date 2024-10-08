CREATE TYPE account_type AS ENUM ('silver', 'gold', 'platinum');

CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(50) NOT NULL,
    customer_id INT REFERENCES customers(id),
    type account_type NOT NULL,
    balance DECIMAL(10, 2) NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS accounts;