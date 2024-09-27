const BankAccount = require('./bank_account');

const bankAccount = new BankAccount('John Doe');

console.log(bankAccount.deposit(1000000));
console.log(bankAccount.deposit('1000000'));
console.log(bankAccount.deposit(0));