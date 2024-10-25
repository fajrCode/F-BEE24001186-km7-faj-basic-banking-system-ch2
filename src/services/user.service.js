// services/userService.js
import bcrypt from 'bcrypt';
import BaseService from './base.service.js';
import prisma from '../configs/database.js';
import { ErrorDbInput } from '../utils/custom_error.js';

export default class UserService extends BaseService {
    constructor() {
        super(prisma.user); // Mengirim model user ke BaseService
    }

    // Override method getAll
    async getAll() {
        const users = await this._model.findMany({
            include: {
                profile: true,
            }
        });

        users.forEach(user => {
            if (user.password) {
                delete user.password;
            }
        });

        return users;
    }

    // Override method getById
    async getById(id) {
        const user = await this._model.findUnique({
            where: { id: Number(id) },
            include: {
                profile: true,
            }
        });

        delete user.password;

        return user;
    }

    // Override method create
    async create(data) {
        try {
            data.password = await bcrypt.hash(data.password, 10);
            const user = await this._model.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    profile: {
                        create: {
                            identityTypes: data.identityType,
                            identityNumber: String(data.identityNumber),
                            address: data.address,
                        }
                    }
                },
                include: {
                    profile: true,
                }
            });

            delete user.password;
            return user;

        } catch (err) {
            console.log(err.code);
            if (err.code === 'P2002') {  // Unique constraint violation
                throw new ErrorDbInput(err.message);
            } else if (err.code === 'P2025') {  // Record not found (just in case)
                throw new Error('RecordNotFoundError');
            } else {
                throw new Error('UnknownError');  // Fallback to generic error
            }
        }
    }

    // Override method update
    async update(id, data) {
        try {
            const user = await this._model.update({
                where: { id: Number(id) },
                data: {
                    name: data.name,
                    email: data.email,
                    profile: {
                        update: {
                            identityTypes: data.identityType,
                            identityNumber: String(data.identityNumber),
                            address: data.address,
                        }
                    }
                },
                include: {
                    profile: true,
                }
            });

            delete user.password;
            return user;

        } catch (err) {
            if (err.code === 'P2002') {  // Unique constraint violation
                throw new ErrorDbInput(err.message);
            } else if (err.code === 'P2025') {  // Record not found (just in case)
                throw new Error('RecordNotFoundError');
            } else {
                throw new Error('UnknownError');  // Fallback to generic error
            }
        }
    }

}
