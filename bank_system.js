const BankAccount = require("./bank_account");

const bankAccount = new BankAccount("John Doe");
bankAccount.deposit(1000000);
bankAccount.withdraw(500000);
console.log(bankAccount.saldo);
