// services/userService.js
import BaseService from './base.service.js';
import prisma from '../configs/database.js';
import { Error400 } from '../utils/custom_error.js';

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

            const destinationAccount = await prisma.bankAccount.findUnique({
                where: { id: data.destinationAccountId },
            });

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
            console.error(err.message);
            if (err.code === 'P2025') {
                throw new Error400('Account not found');
            } else if (err.code === 'P2002') {
                throw new Error400(err.meta.cause);
            } else if (err instanceof Error400) {
                throw err;
            } else {
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
            console.error(err.message);
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

            return transaction;
        } catch (err) {
            console.error(err.message);
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
                throw new Error400('Transaction not found');
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
            console.error(err.message);
            if (err.code === 'P2025') {
                throw new Error400('Transaction not found');
            } else {
                throw new Error(err.message);
            }
        }
    }

}
