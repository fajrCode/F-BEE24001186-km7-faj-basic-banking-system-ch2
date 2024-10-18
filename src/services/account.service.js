// services/userService.js
import BaseService from './base.service.js';
import prisma from '../configs/database.js';
import { ErrorDbInput } from '../utils/custom_error.js';

export default class AccountService extends BaseService {
    constructor() {
        super(prisma.bankAccount); // Mengirim model user ke BaseService
    }

    // Override method create
    async create(data) {
        try {
            const account = await this._model.create({
                data: {
                    bankName: data.bankName,
                    bankAccountNumber: String(data.bankAccountNumber),
                    balance: data.balance,
                    user: {
                        connect: {
                            id: data.userId,
                        },
                    },
                },
                include: {
                    user: true,
                }
            });

            delete account.user.password;

            return account;
        } catch (err) {
            throw new ErrorDbInput(err.message);
        }
    }

    // Override method getAll
    async getAll() {
        const accounts = await this._model.findMany({
            include: {
                user: true,
            }
        });

        accounts.forEach(account => {
            delete account.user.password;
        });

        return accounts;
    }

    // Override method getById
    async getById(id) {
        const account = await this._model.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                user: true,
            }
        });

        if (!account) {
            throw new ErrorDbInput('Account not found');
        }

        delete account.user.password;

        return account;
    }


}
