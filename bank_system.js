const BankAccount = require('./bank_account');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const input = (text) => {
    return new Promise((resolve) => rl.question(text, resolve));
};

class BankSystem extends BankAccount {
    constructor(name){
        super(name);
    }

    async mainmenu(){
        console.log('1. Tarik Tunai');
        console.log('2. Setor Tunai');
        console.log('3. Keluar');
        const option = await input('Masukkan pilihan anda: ');
        switch(option){
            case '1':
                await this.handleWithdraw();
                break;
            case '2':
                await this.handleDeposit();
                break;
            case '3':
                console.log('Terima kasih telah menggunakan layanan kami.');
                process.exit(0);
                break;
            default:
                console.log('Pilihan tidak valid');
                break;
        }
        await this.mainmenu();
    }

    async handleWithdraw() {
        this.saldo = 1000000;
        const amount = await input('Masukkan jumlah saldo yang ingin ditarik: ');
        const result = this.withdraw(amount);
        console.log(result);
    }
    async handleDeposit(){
        const amount = await input('Masukkan jumlah saldo yang akan ditambahkan: ');
        console.log(this.deposit(amount));
    }

}

async function main() {
    const name = await input('Masukkan nama anda: ');
    const bankSystem = new BankSystem(name);
    await bankSystem.mainmenu();
    rl.close();
}

main();