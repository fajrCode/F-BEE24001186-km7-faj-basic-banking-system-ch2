// services/userService.js
import BaseService from './base.service.js';
import prisma from '../configs/database.js';
import { Error404, Error400 } from '../utils/custom_error.js';

export default class TransactionService extends BaseService {
    constructor() {
        super(prisma.transaction); // Mengirim model user ke BaseService
        this.bankAccountSelection = {
            id: true,
            bankAccountNumber: true,
            balance: true,
            user: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    }

    // Override method create
    async create(data) {
        try {
            // Get source account
            const sourceAccount = await prisma.bankAccount.findUnique({
                where: { id: data.sourceAccountId },
            });

            if(!sourceAccount) throw new Error404('Source account not found');

            const destinationAccount = await prisma.bankAccount.findUnique({
                where: { id: data.destinationAccountId },
            });

            if(!destinationAccount) throw new Error404('Destination account not found');

            // Check if source account not equal to destination account
            if (data.sourceAccountId === data.destinationAccountId) {
                throw new Error400('Cannot transfer to the same account');
            }

            // Check source account balance is enough
            if (sourceAccount.balance < data.amount) {
                throw new Error400('Insufficient balance');
            }

            // Update balance source account
            await prisma.bankAccount.update({
                where: { id: data.sourceAccountId },
                data: {
                    balance: sourceAccount.balance - data.amount,
                },
            });

            // Update balance destination account
            await prisma.bankAccount.update({
                where: { id: data.destinationAccountId },
                data: {
                    balance: destinationAccount.balance + data.amount,
                },
            });

            const transaction = await this._model.create({
                data: {
                    amount: data.amount,
                    sourceAccount: {
                        connect: {
                            id: data.sourceAccountId
                        },
                    },
                    destinationAccount: {
                        connect: {
                            id: data.destinationAccountId
                        },
                    },
                },
                select: {
                    id: true,
                    amount: true,
                    sourceAccount: {
                        select: this.bankAccountSelection
                    },
                    destinationAccount: {
                        select: this.bankAccountSelection
                    },
                }
            });

            return transaction;
        } catch (err) {
            if (err instanceof Error404) {
                throw new Error404(err.message);
            } else if (err instanceof Error400) {
                throw new Error400(err.message);
            } else {
                console.log(err.message);
                throw new Error(err.message);
            }
        }
    }

    // Override method getAll
    async getAll() {
        try {
            const transactions = await this._model.findMany({
                select: {
                    id: true,
                    amount: true,
                    sourceAccount: {
                        select: this.bankAccountSelection
                    },
                    destinationAccount: {
                        select: this.bankAccountSelection
                    },
                }
            });

            return transactions;
        } catch (err) {
            console.log(err.message);
            throw new Error(err.message);
        }
    }

    // Override method getById
    async getById(id) {
        try {
            const transaction = await this._model.findUnique({
                where: { id: parseInt(id) },
                select: {
                    id: true,
                    amount: true,
                    sourceAccount: {
                        select: this.bankAccountSelection
                    },
                    destinationAccount: {
                        select: this.bankAccountSelection
                    },
                }

            });

            if (!transaction) return null;

            return transaction;
        } catch (err) {
            console.log(err.message);
            throw new Error(err.message);
        }
    }

    // Override method delete
    async delete(id) {
        try {
            const transaction = await this._model.findUnique({
                where: { id: parseInt(id) },
                select: {
                    id: true,
                    amount: true,
                    sourceAccount: {
                        select: this.bankAccountSelection
                    },
                    destinationAccount: {
                        select: this.bankAccountSelection
                    },
                }
            });

            if (!transaction) {
                throw new Error404('Transaction not found');
            }

            // Refund balance source account
            await prisma.bankAccount.update({
                where: { id: transaction.sourceAccount.id },
                data: {
                    balance: {
                        increment: transaction.amount
                    }
                }
            });

            // Refund balance destination account
            await prisma.bankAccount.update({
                where: { id: transaction.destinationAccount.id },
                data: {
                    balance: {
                        decrement: transaction.amount
                    }
                }
            });

            await this._model.delete({
                where: { id: parseInt(id) },
            });

            return transaction;
        } catch (err) {
            if (err.code === 'P2025' || err instanceof Error404) {
                throw new Error404('Transaction not found');
            } else {
                console.log(err.message);
                throw new Error(err.message);
            }
        }
    }

}
