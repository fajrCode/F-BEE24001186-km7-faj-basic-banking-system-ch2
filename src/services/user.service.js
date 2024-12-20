// services/userService.js
import bcrypt from 'bcrypt';
import BaseService from './base.service.js';
import prisma from '../configs/database.js';
import { Error400 } from '../utils/custom_error.js';
import { imagekit } from '../utils/imagekit.js';

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

        if (!user) return null;

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
                const match = err.message.match(/\(([^)]+)\)/);
                const message = match ? `${match[1]} already exists` : 'Some field already exists';
                throw new Error400(message);
            } else if (err.code === 'P2025') {  // Record not found (just in case)
                throw new Error400('Record not found');
            } else {
                console.log(err.message);
                throw new Error('UnknownError');  // Fallback to generic error
            }
        }
    }

    // Add new method uploadImage
    async uploadImage(id, file) {
        try {
            // Upload image to ImageKit
            const uploadFile = await imagekit.upload({
                file: file.buffer.toString('base64'),
                fileName: file.originalname,
                folder: '/profile',
            });

            // const filename = process.env.HOST + '/public/images/profiles/' + file.filename; // Local storage
            const user = await this._model.update({
                where: { id: Number(id) },
                data: {
                    profile: {
                        update: {
                            imgUrl: uploadFile.url,
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
            if (err.code === 'P2025') {  // Record not found
                throw new Error400('Record not found');
            } else {
                console.log(err.message);
                throw new Error('Server Error!');  // Fallback to generic error
            }
        }
    }

}
