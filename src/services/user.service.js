// services/userService.js
import BaseService from './base.service.js';
import prisma from '../configs/database.js';

export default class UserService extends BaseService {
    constructor() {
        super(prisma.user); // Mengirim model user ke BaseService
        this.profileModel = prisma.profile;
    }

    // Override method getAll
    async getAll() {
        const users = await this._model.findMany({
            include: {
                profile: true,
            }
        });
        
        users.forEach(user => {
            if (user.profile && typeof user.profile.identityNumber === 'bigint') {
                user.profile.identityNumber = user.profile.identityNumber.toString();
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

        if (user.profile && typeof user.profile.identityNumber === 'bigint') {
            user.profile.identityNumber = user.profile.identityNumber.toString();
        }
        
        delete user.password;

        return user;
    }

    // Override method create
    async create(data) {
        try {
            return await this._model.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    profile: {
                        create: {
                            identityTypes: data.identity_type,
                            identityNumber: data.identity_number,
                            address: data.address,
                        }
                    }
                },
                include: {
                    profile: true,
                }
            });
        } catch (err) {
            if (err.code === 'P2002') {  // Unique constraint violation
                throw new Error('UniqueConstraintError');
            } else if (err.code === 'P2025') {  // Record not found (just in case)
                throw new Error('RecordNotFoundError');
            } else {
                throw new Error('UnknownError');  // Fallback to generic error
            }
        }
    }
}
