CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts(id),
    type VARCHAR(15) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE transactions
ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE transactions
ADD COLUMN updated_at TIMESTAMP;

CREATE INDEX ON transactions (account_id);
CREATE INDEX ON transactions (type);

DROP TABLE IF EXISTS transactions;