const { InvalidInput, InvalidAmount } = require('./custom_error');

class BankAccount {
    constructor(nama) {
        this.nama = nama;
        this.accountnumber = Math.floor(Math.random() * 1000000000);
        this.saldo = 0;
    }

    // protected method to deposit money
    _deposit(amount) {
        if (amount === null) return;

        if (isNaN(amount) || !/^\d+$/.test(amount))
            throw new InvalidInput('Maaf, inputan tidak valid. Hanya angka yang diperbolehkan.');
        if (amount <= 0)
            throw new InvalidAmount('Maaf, jumlah saldo tidak boleh kurang atau sama dengan 0.');

        this.saldo += parseFloat(amount);

        return `Selamat saldo berhasil ditambahkan. \nSaldo anda sekarang: ${this.#formatRupiah(this.saldo)}`;
    }

    // protected method to withdraw money
    _withdraw(amount) {
        if (amount === null) return;

        if (isNaN(amount) || !/^\d+$/.test(amount))
            throw new InvalidInput('Maaf, inputan tidak valid. Hanya angka yang diperbolehkan.');

        if (amount <= 0)
            throw new InvalidAmount('Maaf, jumlah saldo tidak boleh kurang atau sama dengan 0.');

        if (amount > this.saldo)
            throw new InvalidAmount(`Maaf, saldo anda tidak cukup.\nSaldo anda sekarang: ${this.#formatRupiah(this.saldo)}`);

        this.saldo -= parseFloat(amount);

        return `Selamat saldo berhasil dikurangi. \nSaldo anda sekarang: ${this.#formatRupiah(this.saldo)}`
    }

    // private method to format number to rupiah
    #formatRupiah(number) {
        let rupiah = "";
        const numberrev = number.toString().split("").reverse().join("");
        for (let i = 0; i < numberrev.length; i++) {
            if (i % 3 === 0) rupiah += numberrev.substr(i, 3) + ".";
        }
        return (
            "Rp. " +
            rupiah
                .split("", rupiah.length - 1)
                .reverse()
                .join("")
        );
    }

}

module.exports = BankAccount;