CREATE TYPE transaction_type AS ENUM ('deposit', 'withdraw', 'transfer');

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    account_id INT REFERENCES accounts(id),
    type transaction_type NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS transactions;