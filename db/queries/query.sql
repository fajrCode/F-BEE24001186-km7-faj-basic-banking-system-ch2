-- CUSTOMERS
-- Customer insert
INSERT INTO customers (full_name, gender, phone, address, created_at)
VALUES ('John Doe', 'male', '1234567890', 'Jl. Raya No. 1', CURRENT_TIMESTAMP);

-- Customer Read
SELECT * FROM customers;

-- Mengambil satu customer berdasarkan ID
SELECT * FROM customers WHERE id = 1;

-- Update data customer
UPDATE customers
SET full_name = 'Jane Doe', updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Delete data customer
DELETE FROM customers WHERE id = 1;

-- ACCOUNTS
-- Account insert
INSERT INTO accounts (account_number, customer_id, type, balance, status, created_at)
VALUES ('ACC_123456', 5, 'silver', 1000, TRUE, CURRENT_TIMESTAMP);

-- Account Read
SELECT * FROM accounts;

-- Mengambil satu account berdasarkan ID
SELECT * FROM accounts WHERE id = 5;

-- Update data account
UPDATE accounts
SET balance = 2000, updated_at = CURRENT_TIMESTAMP
WHERE id = 7;

-- Delete data account
DELETE FROM accounts WHERE id = 10;

-- TRANSACTIONS
-- Transaction insert
INSERT INTO transactions (account_id, type, amount, status, created_at)
VALUES (11, 'deposit', 1000, TRUE, CURRENT_TIMESTAMP);

-- Transaction Read
SELECT * FROM transactions;

-- Mengambil satu transaksi berdasarkan ID
SELECT * FROM transactions WHERE id = 11;

-- Mengambil data transaksi dengan limit dan offset
SELECT * FROM transactions LIMIT 5 OFFSET 5;

-- Update data transaction
UPDATE transactions
SET amount = 2000, updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Delete data transaction
DELETE FROM transactions WHERE id = 10;

-- Mengambil informasi lengkap tentang setiap customer, termasuk detail akunnya dan transaksi yang pernah dilakukan
SELECT 
    c.id AS customer_id,
    c.full_name,
    c.gender,
    c.phone,
    c.address,
    a.account_number,
    a.balance,
    t.type AS transaction_type,
    t.amount AS transaction_amount,
    t.created_at AS transaction_date
FROM 
    customers c
JOIN 
    accounts a ON c.id = a.customer_id
LEFT JOIN 
    transactions t ON a.id = t.account_id
ORDER BY 
    c.id, t.created_at DESC;

-- Mengambil Data dengan CTE untuk Akun dan Transaksi
WITH account_balances AS (
    SELECT 
        a.id AS account_id,
        a.account_number,
        a.balance,
        c.full_name,
        c.gender,
        c.phone,
        c.address,
        SUM(CASE WHEN t.type = 'deposit' THEN t.amount 
                 WHEN t.type = 'withdraw' THEN -t.amount 
                 ELSE 0 END) AS total_transactions
    FROM 
        accounts a
    JOIN 
        customers c ON a.customer_id = c.id
    LEFT JOIN 
        transactions t ON a.id = t.account_id
    GROUP BY 
        a.id, c.id
)
SELECT 
    account_id,
    account_number,
    full_name,
    balance,
    total_transactions,
    (balance + COALESCE(total_transactions, 0)) AS final_balance
FROM 
    account_balances
ORDER BY 
    final_balance DESC;  -- Mengurutkan berdasarkan saldo akhir

