CREATE OR REPLACE FUNCTION get_balance(
    p_account_id INT
) RETURNS TABLE (full_name VARCHAR, account_number VARCHAR, balance DECIMAL(10, 2)) AS $$
BEGIN
    -- Ambil nama lengkap, nomor rekening, dan saldo akun
    RETURN QUERY
    SELECT c.full_name, a.account_number, a.balance
    FROM accounts a
    JOIN customers c ON a.customer_id = c.id
    WHERE a.id = p_account_id;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION IF EXISTS get_balance;