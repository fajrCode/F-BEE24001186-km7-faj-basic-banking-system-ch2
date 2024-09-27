const BankAccount = require('./bank_account');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const input = (text) => {
    return new Promise((resolve) => rl.question(text, resolve));
};

async function main() {
    const nama = await input('Masukkan nama anda: ');
    const bankAccount = new BankAccount(nama);

    console.log(nama, bankAccount.accountnumber);
    console.log(bankAccount.deposit(1000000));
    console.log(bankAccount.deposit('1000000'));
    console.log(bankAccount.deposit(0));
}

main();
// const bankAccount = new BankAccount('John Doe');

// console.log(bankAccount.deposit(1000000));
// console.log(bankAccount.deposit('1000000'));
// console.log(bankAccount.deposit(0));