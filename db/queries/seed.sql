-- 1. Data dummy untuk tabel customers
INSERT INTO customers (full_name, gender, phone, address, created_at)
SELECT 
    'Fulan ' || gs AS full_name,
    CASE 
        WHEN gs % 2 = 0 THEN 'male' 
        ELSE 'female' 
    END AS gender,
    '08' || LPAD((gs % 1000000)::TEXT, 7, '0') AS phone,
    'Jl. Jalan ' || gs AS address,
    CURRENT_TIMESTAMP AS created_at
FROM generate_series(1, 500000) AS gs;

-- 2. Data dummy untuk tabel accounts (2 rekening per nasabah)
INSERT INTO accounts (account_number, customer_id, type, balance, status, created_at)
SELECT 
    'ACC_' || (c.id * 2 - 1 + gs) AS account_number,
    c.id AS customer_id,
    CASE 
        WHEN gs % 3 = 0 THEN 'silver' 
        WHEN gs % 3 = 1 THEN 'gold' 
        ELSE 'platinum' 
    END AS type,
    ROUND((RANDOM() * 10000)::numeric, 2) AS balance,
    TRUE AS status,
    CURRENT_TIMESTAMP AS created_at
FROM customers c, generate_series(1, 2) gs;

-- 3. Data dummy untuk tabel transactions (2 transaksi per rekening)
INSERT INTO transactions (account_id, type, amount, status, created_at)
SELECT 
    a.id AS account_id, -- ID rekening
    CASE 
        WHEN gs % 3 = 0 THEN 'deposit' 
        WHEN gs % 3 = 1 THEN 'withdraw' 
        ELSE 'transfer' 
    END AS type,
    ROUND((RANDOM() * 1000)::numeric, 2) AS amount,
    TRUE AS status,
    CURRENT_TIMESTAMP AS created_at
FROM accounts a, generate_series(1, 2) gs;
