CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL,
    customer_id INT REFERENCES customers(id),
    type VARCHAR(15) NOT NULL,
    balance DECIMAL(15, 2) NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE accounts
ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE accounts
ADD COLUMN updated_at TIMESTAMP;

CREATE INDEX ON accounts (account_number);
CREATE INDEX ON accounts (customer_id);

DROP TABLE IF EXISTS accounts;