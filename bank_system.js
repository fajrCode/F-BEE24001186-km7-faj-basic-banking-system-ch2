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
    async handleWithdraw() {
        this.saldo = 1000000;
        const amount = await input('Masukkan jumlah saldo yang ingin ditarik: ');
        const result = this.withdraw(amount);
        console.log(result);
    async handleDeposit(){
        const amount = await input('Masukkan jumlah saldo yang akan ditambahkan: ');
        console.log(this.deposit(amount));
    }

}

async function main() {
    const name = await input('Masukkan nama anda: ');
    const bankSystem = new BankSystem(name);
    console.log(`Selamat datang, ${name}!`);
    await bankSystem.handleWithdraw();
    await bankSystem.handleDeposit();
}

main();