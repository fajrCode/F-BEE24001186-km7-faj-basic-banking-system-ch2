// services/userService.js
import BaseService from './base.service.js';
import prisma from '../configs/database.js';
import { Error400, Error404 } from '../utils/custom_error.js';

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
            if (err.code === 'P2002') {  // Unique constraint violation
                const match = err.message.match(/\(([^)]+)\)/); 
                const message = match ? `${match[1]} already exists` : 'Some field already exists';
                throw new Error400(message);
            } else {
                console.log(err.message);
                throw new Error('UnknownError');  // Fallback to generic error
            }
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
            return null;
        }

        delete account.user.password;

        return account;
    }


}
