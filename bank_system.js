const BankAccount = require('./bank_account');
const readline = require('readline');
const { InvalidInput, InvalidAmount } = require('./errors');

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// function for terminal input
const input = (text) => {
    return new Promise((resolve) => rl.question(text, resolve));
};

// function for generating account number
const generateAccountNumber = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

class BankSystem extends BankAccount {
    constructor(nama) {
        const nomorRekening = generateAccountNumber(); // Nomor rekening dihasilkan secara otomatis
        super(nama, nomorRekening);
    }

    /**
     * Main menu of the bank system application
     * @returns {Promise<void>}
     * @async
     */

    async menu() {
        console.log(`\nSelamat datang, ${this.nama}!`);
        console.log(`Nomor Rekening: ${this.nomorRekening}`);
        console.log("=== Menu Utama ===");
        console.log("1. Deposit");
        console.log("2. Withdraw");
        console.log("3. Cek Saldo");
        console.log("4. Keluar");

        const option = await askQuestion('Pilih menu (1-4): ');

        switch (option) {
            case '1':
                await this.handleDeposit();
                break;
            case '2':
                await this.handleWithdraw();
                break;
            case '3':
                this.checkSaldo();
                break;
            case '4':
                console.log("Terima kasih telah menggunakan sistem perbankan kami.");
                rl.close();
                process.exit(0);
                break;
            default:
                // Menampilkan kembali menu jika input tidak valid
                console.log("Pilihan tidak valid.");
                await this.menu(); 
        }
    }

    /**
     * Handle deposit process
     * @returns {Promise<void>}
     * @async
     * 
     */

    async handleDeposit(){
        const amount = await input('Masukkan jumlah saldo yang akan ditambahkan: ');
        try {
            if (this.validateAmount(amount)) {
                console.log('Memproses deposit...');
                
                // Delay deposit process for 2.5 seconds
                setTimeout(() => {
                    const newBalance = this.deposit(amount);
                    console.log(`Deposit berhasil! Saldo baru: ${newBalance}`);
                    this.menu();
                }, 2500); 
            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
            await this.menu();
        }
    }

    /**
     * Handle withdraw process
     * @returns {Promise<void>}
     * @async
     */

    async handleWithdraw() {
        const amount = await input('Masukkan jumlah saldo yang ingin ditarik: ');
        try {
            if (this.validateAmount(amount)) {
                if (amount > this.saldo) {
                    throw new InvalidAmount(`Maaf, saldo anda tidak cukup. Saldo saat ini: ${this.getSaldo()}`);
                }
                console.log('Memproses penarikan...');

                // Delay withdraw process for 2.5 seconds
                setTimeout(() => {
                    const newBalance = this.withdraw(amount);
                    console.log(`Penarikan berhasil! Saldo baru: ${newBalance}`);
                    this.menu();
                }, 2500);
            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
            await this.menu();
        }
    }

    /**
     * Check saldo
     * @returns {void}
     */

    checkSaldo() {
        console.log('Memproses deposit...');
        setTimeout(() => {
            console.log(`Saldo anda saat ini: ${this.getSaldo()}`);
            this.menu();
        }, 2000);
        this.menu(); 
    }

    // Validation for amount input
    validateAmount(amount) {
        if (amount === null || isNaN(amount) || !/^\d+$/.test(amount)) {
            throw new InvalidInput("Input tidak valid. Hanya angka yang diperbolehkan.");
        }

        if (amount <= 0) {
            throw new InvalidAmount("Jumlah harus lebih dari 0.");
        }

        return true;
    }

}

async function main() {
    const name = await input('Masukkan nama anda: ');
    const bankSystem = new BankSystem(name);
    await bankSystem.mainmenu();
    rl.close();
}

main();