CREATE OR REPLACE PROCEDURE deposit(
    p_account_id INT,
    p_amount DECIMAL(10, 2)
) AS $$
BEGIN
    -- Update saldo akun dan set updated_at
    UPDATE accounts
    SET balance = balance + p_amount,
        updated_at = CURRENT_TIMESTAMP  -- Memperbarui kolom updated_at
    WHERE id = p_account_id;

    -- Catat transaksi deposit
    INSERT INTO transactions (account_id, type, amount, status, created_at)
    VALUES (p_account_id, 'deposit', p_amount, TRUE, CURRENT_TIMESTAMP);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE withdraw(
    p_account_id INT,
    p_amount DECIMAL(10, 2)
) AS $$
BEGIN
    -- Pastikan saldo cukup untuk melakukan penarikan
    IF (SELECT balance FROM accounts WHERE id = p_account_id) >= p_amount THEN
        -- Update saldo akun dan set updated_at
        UPDATE accounts
        SET balance = balance - p_amount,
            updated_at = CURRENT_TIMESTAMP  -- Memperbarui kolom updated_at
        WHERE id = p_account_id;

        -- Catat transaksi withdraw
        INSERT INTO transactions (account_id, type, amount, status, created_at)
        VALUES (p_account_id, 'withdraw', p_amount, TRUE, CURRENT_TIMESTAMP);
    ELSE
        RAISE EXCEPTION 'Insufficient balance for withdrawal';
    END IF;
END;
$$ LANGUAGE plpgsql;

DROP PROCEDURE IF EXISTS deposit;
DROP PROCEDURE IF EXISTS withdraw;