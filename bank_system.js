const BankAccount = require('./bank_account');
const readline = require('readline');
const { InvalidInput, InvalidAmount } = require('./custom_error');

// Membuat instance dari readline.Interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//  Fungsi untuk input dari user
const input = (text) => {
    return new Promise((resolve) => rl.question(text, resolve));
};

// fungsi untuk generate nomor rekening
const generateAccountNumber = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

class BankSystem extends BankAccount {
    constructor(nama) {
        const nomorRekening = generateAccountNumber();
        super(nama, nomorRekening);
    }

    /**
     * Main menu of the bank system application
     * @returns {Promise<void>}
     * @async
     */

    async mainmenu() {
        console.log(`\nSelamat datang, ${this.nama}!`);
        console.log(`Nomor Rekening: ${this.nomorRekening}`);
        console.log("\n=== Menu Utama ===");
        console.log("1. Deposit");
        console.log("2. Withdraw");
        console.log("3. Cek Saldo");
        console.log("4. Keluar\n");

        const option = await input('Pilih menu (1-4): ');

        switch (option) {
            case '1':
                await this.#handleDeposit();
                break;
            case '2':
                await this.#handleWithdraw();
                break;
            case '3':
                await this.#checkSaldo();
                break;
            case '4':
                console.log("Terima kasih telah menggunakan sistem perbankan kami.");
                rl.close();
                process.exit(0);
                break;
            default:
                // Menampilkan kembali menu jika input tidak valid
                console.log("Pilihan tidak valid.");
                setTimeout(() => {
                    this.mainmenu();
                }, 1500);
        }
    }

    /**
     * Handle deposit process
     * @returns {Promise<void>}
     * @async
     * 
     */

    async #handleDeposit(){
        const amount = await input('Masukkan jumlah saldo yang akan ditambahkan: ');
        try {
            if (this.#validateAmount(amount)) {
                console.log('Memproses deposit...');
                
                // Delay deposit process for 2.5 seconds
                setTimeout(() => {
                    const newBalance = this._deposit(amount);
                    console.log(`Deposit berhasil! Saldo baru: ${newBalance}`);
                    setTimeout(() => {
                        this.mainmenu();
                    }, 1500);
                }, 2500); 
            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
            setTimeout(() => {
                this.mainmenu();
            }, 1500);
        }
    }

    /**
     * Handle withdraw process
     * @returns {Promise<void>}
     * @async
     */

    async #handleWithdraw() {
        const amount = await input('Masukkan jumlah saldo yang ingin ditarik: ');
        try {
            if (this.#validateAmount(amount)) {
                if (amount > this.saldo) {
                    throw new InvalidAmount(`Maaf, saldo anda tidak cukup. Saldo saat ini: ${this._getSaldo()}`);
                }
                console.log('Memproses penarikan...');

                // Delay withdraw process for 2.5 seconds
                setTimeout(() => {
                    const newBalance = this._withdraw(amount);
                    console.log(`Penarikan berhasil! Saldo baru: ${newBalance}`);
                    setTimeout(() => {
                        this.mainmenu();
                    }, 1500);
                }, 2500);
            }
        } catch (error) {
            console.log(`Error: ${error.message}`);
            setTimeout(() => {
                this.mainmenu();
            }, 1500);
        }
    }

    /**
     * Check saldo process
     * @returns {Promise<void>}
     * @async
     */

    #checkSaldo() {
        console.log('Memproses cek saldo...');
        new Promise((resolve) => {
            setTimeout(() => {
                resolve(`Saldo anda saat ini: ${this._getSaldo()}`);
            }, 2000);
        }).then((message) => {
            console.log(message);
            return new Promise((resolve) => setTimeout(resolve, 1500));
        }).then(() => {
            this.mainmenu();
        }).catch((error) => {
            console.log(`Error: ${error.message}`);
            setTimeout(() => {
                this.mainmenu();
            }, 1500);
        });
    }

    // Validation for amount input
    #validateAmount(amount) {
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
    try {
        const nama = await input('Masukkan nama anda: ');

        // Membuat instance dari BankSystem
        const bankSystem = new BankSystem(nama);

        // Menampilkan menu
        await bankSystem.mainmenu();
    } catch (error) {
        console.log(`Error: ${error.message}`);
        rl.close();
        process.exit(1);
    }
}

main();