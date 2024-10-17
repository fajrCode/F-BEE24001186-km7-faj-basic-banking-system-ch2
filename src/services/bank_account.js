class BankAccount {
    constructor(nama, nomorRekening) {
        this.nama = nama;
        this.nomorRekening = nomorRekening;
        this.saldo = 0;
    }

    _deposit(amount) {
        this.saldo += parseFloat(amount);
        return this.#formatRupiah(this.saldo);
    }

    _withdraw(amount) {
        this.saldo -= parseFloat(amount);
        return this.#formatRupiah(this.saldo);
    }

    _getSaldo() {
        return this.#formatRupiah(this.saldo);
    }

    #formatRupiah(number) {
        let rupiah = "";
        const numberrev = number.toString().split("").reverse().join("");
        for (let i = 0; i < numberrev.length; i++) {
            if (i % 3 === 0) rupiah += numberrev.substr(i, 3) + ".";
        }
        return "Rp. " + rupiah.split("", rupiah.length - 1).reverse().join("");
    }
}

module.exports = BankAccount;
