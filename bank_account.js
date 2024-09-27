class BankAccount {
    constructor(nama) {
        this.nama = nama;
        this.accountnumber = Math.floor(Math.random() * 1000000000);
        this.saldo = 0;
    }

    deposit(amount) {
        if (amount === null) return;

        if (isNaN(amount) || !/^\d+$/.test(amount))
            return "Maaf, inputan tidak valid. Hanya angka yang diperbolehkan.";
        if (amount <= 0)
            return "Maaf, jumlah saldo tidak boleh kurang atau sama dengan 0.";

        this.saldo += parseFloat(amount);

        return `Selamat saldo berhasil ditambahkan. \nSaldo anda sekarang: ${this.formatRupiah(this.saldo)}`;
    }

    kurangiSaldo() {
        const saldoKurang = window.prompt(
            "Masukkan jumlah saldo yang ingin dikurangi (hanya angka): "
        );

        if (saldoKurang === null) return;

        if (isNaN(saldoKurang) || !/^\d+$/.test(saldoKurang))
            return alert(
                "Maaf, inputan tidak valid. Hanya angka yang diperbolehkan."
            );

        if (saldoKurang <= 0)
            return alert(
                "Maaf, jumlah saldo tidak boleh kurang atau sama dengan 0"
            );

        if (saldoKurang > this.saldo)
            return alert(`Maaf, saldo anda tidak cukup.\nSaldo anda sekarang: ${this.formatRupiah(this.saldo)}`);

        this.saldo -= parseFloat(saldoKurang);

        alert(
            `Selamat saldo berhasil dikurangi. \nSaldo anda sekarang: ${this.formatRupiah(
                this.saldo
            )}`
        );
    }

    formatRupiah(angka) {
        let rupiah = "";
        const angkarev = angka.toString().split("").reverse().join("");
        for (let i = 0; i < angkarev.length; i++) {
            if (i % 3 === 0) rupiah += angkarev.substr(i, 3) + ".";
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
const nama = prompt("Masukkan nama anda: ") || "User";
const akunBank = new AkunBank(nama);

document.getElementById("username").innerHTML = nama;

function menu() {
    const menu = parseInt(window.prompt(`Selamat datang ${nama} 🤩.\nSilahkan pilih menu yang ingin diakses (1,2,3,4):
    1. Tambah Saldo
    2. Kurangi Saldo
    3. Keluar
    `));

    switch (menu) {
        case 1:
            akunBank.tambahSaldo();
            break;
        case 2:
            akunBank.kurangiSaldo();
            break;
        case 3:
            alert("Terima kasih telah menggunakan layanan kami.");
            break;
        default:
            alert("Maaf, menu tidak tersedia.");
            menu();
    }

    const currentSaldo = document.getElementById("current_saldo");
    currentSaldo.innerHTML = akunBank.formatRupiah(akunBank.saldo);

}

menu();