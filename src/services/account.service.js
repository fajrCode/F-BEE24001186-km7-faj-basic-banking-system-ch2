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
                    bankAccountNumber: data.bankAccountNumber,
                    balance: data.balance,
                    userId: data.userId,
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


}
