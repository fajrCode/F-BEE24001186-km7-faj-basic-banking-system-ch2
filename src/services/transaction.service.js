// services/userService.js
import BaseService from './base.service.js';
import prisma from '../configs/database.js';
import { ErrorDbInput } from '../utils/custom_error.js';

export default class TransactionService extends BaseService {
    constructor() {
        super(prisma.transaction); // Mengirim model user ke BaseService
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
                throw new ErrorDbInput('Cannot transfer to the same account');
            }

            // Check source account balance is enough
            if (sourceAccount.balance < data.amount) {
                throw new ErrorDbInput('Insufficient balance');
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
                include: {
                    sourceAccount: true,
                    destinationAccount: true,
                }
            });

            return transaction;
        } catch (err) {
            console.error(err.message);
            if (err.code === 'P2025') {
                throw new ErrorDbInput('Account not found');
            } else if (err.code === 'P2002') {
                throw new ErrorDbInput(err.meta.cause);
            } else if (err instanceof ErrorDbInput) {
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
                include: {
                    sourceAccount: true,
                    destinationAccount: true,
                }
            });

            return transactions;
        } catch (err) {
            console.error(err.message);
            throw new Error(err.message);
        }
    }


}
