// Unit it for userService.js
import UserService from '../user.service.js';
import prisma from '../../configs/database.js';
import { Error400 } from '../../utils/custom_error.js';
import { imagekit } from '../../utils/imagekit.js';

// Mock prisma dan Error400
jest.mock('../../configs/database.js', () => ({
    user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}));

// Fully mock `imagekit` to prevent environment variable errors
jest.mock('imagekit', () => {
    return jest.fn().mockImplementation(() => ({
        upload: jest.fn(() => Promise.resolve({ url: 'https://mocked-url.com/image.jpg' })),
        deleteFile: jest.fn(() => Promise.resolve({}))
    }));
});

describe('UserService', () => {
    let userService;

    beforeEach(() => {
        userService = new UserService();
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('should return all users with password', async () => {
            const users = [
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'johndoe@main.com',
                    password: 'password',
                    profile: {
                        identityTypes: 'KTP',
                        identityNumber: '1234567890',
                        address: 'Jl. Kenangan No. 1',
                    }
                },
                {
                    id: 2,
                    name: 'Jane Doe',
                    email: 'jane@mail.com',
                    password: 'password',
                    profile: {
                        identityTypes: 'SIM',
                        identityNumber: '0987654321',
                        address: 'Jl. Jalan No. 2',
                    }
                }
            ];

            prisma.user.findMany.mockResolvedValue(users);

            const result = await userService.getAll();
            users.map(user => ({
                ...user,
            }));
            expect(result).toEqual(users);

            expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
        });

        it('should return all users without password', async () => {
            const users = [
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'johndoe@main.com',
                    profile: {
                        identityTypes: 'KTP',
                        identityNumber: '1234567890',
                        address: 'Jl. Kenangan No. 1',
                    }
                },
                {
                    id: 2,
                    name: 'Jane Doe',
                    email: 'jane@mail.com',
                    profile: {
                        identityTypes: 'SIM',
                        identityNumber: '0987654321',
                        address: 'Jl. Jalan No. 2',
                    }
                }
            ];

            prisma.user.findMany.mockResolvedValue(users);

            const result = await userService.getAll();

            expect(result).toEqual(users);

            expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('getById', () => {
        it('should return a user by id without password', async () => {
            const user = {
                id: 1,
                name: 'John Doe',
                email: 'johndoe@main.com',
                password: 'password',
                profile: {
                    identityTypes: 'KTP',
                    identityNumber: '1234567890',
                    address: 'Jl. Kenangan No. 1',
                }
            };

            prisma.user.findUnique.mockResolvedValue(user);

            const result = await userService.getById(1);

            expect(result).toEqual({
                ...user,
                password: undefined // memastikan password dihapus
            });
            expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { profile: true }
            });
        });

        it('should return null if user not found', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            const result = await userService.getById(1);

            expect(result).toBeNull();
            expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { profile: true }
            });
        });


    });

    describe('create', () => {
        it('should create a new user without password', async () => {
            const data = {
                name: 'John Doe',
                email: 'johndoe@mail.com',
                password: 'password',
                identityType: 'KTP',
                identityNumber: '1234567890',
                address: 'Jl. Kenangan No. 1'
            };

            const createdUser = {
                id: 1,
                ...data,
                profile: {
                    identityTypes: 'KTP',
                    identityNumber: '1234567890',
                    address: 'Jl. Kenangan No. 1',
                }
            };

            prisma.user.create.mockResolvedValue(createdUser);

            const result = await userService.create(data);

            expect(result).toEqual({
                ...createdUser,
                password: undefined // memastikan password dihapus
            });
            expect(prisma.user.create).toHaveBeenCalledTimes(1);
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    profile: {
                        create: {
                            identityTypes: data.identityType,
                            identityNumber: data.identityNumber,
                            address: data.address
                        }
                    }
                },
                include: { profile: true }
            });
        });

        it('should throw error Unique constraint violation with static message', async () => {
            const data = {
                name: 'John Doe',
                email: 'john@mail.com',
                password: 'password',
                identityType: 'KTP',
                identityNumber: '1234567890',
                address: 'Jl. Kenangan No. 1'
            };

            prisma.user.create.mockRejectedValue({
                code: 'P2002',
                message: 'Unique constraint violation'
            });

            await expect(userService.create(data)).rejects.toThrow(Error400);
            expect(prisma.user.create).toHaveBeenCalledTimes(1);
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    profile: {
                        create: {
                            identityTypes: data.identityType,
                            identityNumber: data.identityNumber,
                            address: data.address
                        }
                    }
                },
                include: { profile: true }
            });
        });

        it('should throw error Unique constraint violation with message dynamic field', async () => {
            const data = {
                name: 'John Doe',
                email: 'john@mail.com',
                password: 'password',
                identityType: 'KTP',
                identityNumber: '1234567890',
                address: 'Jl. Kenangan No. 1'
            };

            prisma.user.create.mockRejectedValue({
                code: 'P2002',
                message: 'Unique constraint violation (email)'
            });

            await expect(userService.create(data)).rejects.toThrow(Error400);

            expect(prisma.user.create).toHaveBeenCalledTimes(1);

            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    profile: {
                        create: {
                            identityTypes: data.identityType,
                            identityNumber: data.identityNumber,
                            address: data.address
                        }
                    }
                },
                include: { profile: true }
            });
        });

        it('should throw error Record not found (just in case)', async () => {
            const data = {
                name: 'John Doe',
                email: 'john@mail.com',
                password: 'password',
                identityType: 'KTP',
                identityNumber: '1234567890',
                address: 'Jl. Kenangan No. 1'
            };

            prisma.user.create.mockRejectedValue({
                code: 'P2025',
                message: 'Record not found'
            });

            await expect(userService.create(data)).rejects.toThrow(Error);

            expect(prisma.user.create).toHaveBeenCalledTimes(1);
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    profile: {
                        create: {
                            identityTypes: data.identityType,
                            identityNumber: data.identityNumber,
                            address: data.address
                        }
                    }
                },
                include: { profile: true }
            });
        });

        it('should throw error UnknownError', async () => {
            const data = {
                name: 'John Doe',
                email: 'john@mail.com',
                password: 'password',
                identityType: 'KTP',
                identityNumber: '1234567890',
                address: 'Jl. Kenangan No. 1'
            };

            prisma.user.create.mockRejectedValue(new Error('UnknownError'));

            await expect(userService.create(data)).rejects.toThrow(Error);

            expect(prisma.user.create).toHaveBeenCalledTimes(1);
            expect(prisma.user.create).toHaveBeenCalledWith({
                data: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    profile: {
                        create: {
                            identityTypes: data.identityType,
                            identityNumber: data.identityNumber,
                            address: data.address
                        }
                    }
                },
                include: { profile: true }
            });
        });

    });

    describe('update', () => {
        it('should update a user', async () => {
            const data = {
                name: 'John Doe',
                email: 'johndoe@mail.com',
                identityType: 'KTP',
                identityNumber: '1234567890',
                address: 'Jl. Kenangan No. 1'
            };

            const updatedUser = {
                id: 1,
                ...data,
                profile: {
                    identityTypes: 'KTP',
                    identityNumber: '1234567890',
                    address: 'Jl. Kenangan No. 1'
                }
            };

            prisma.user.update.mockResolvedValue(updatedUser);

            const result = await userService.update(1, data);

            expect(result).toEqual({
                ...updatedUser,
                password: undefined // memastikan password dihapus
            });
            expect(prisma.user.update).toHaveBeenCalledTimes(1);
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    name: data.name,
                    email: data.email,
                    profile: {
                        update: {
                            identityTypes: data.identityType,
                            identityNumber: data.identityNumber,
                            address: data.address
                        }
                    }
                },
                include: { profile: true }
            });
        });

        it('should throw error Unique constraint violation with static message', async () => {
            const data = {
                name: 'John Doe',
                email: 'john@mail.com',
                identityType: 'KTP',
                identityNumber: '1234567890',
                address: 'Jl. Kenangan No. 1'
            };

            prisma.user.update.mockRejectedValue({
                code: 'P2002',
                message: 'Unique constraint violation'
            });

            await expect(userService.update(1, data)).rejects.toThrow(Error400);

            expect(prisma.user.update).toHaveBeenCalledTimes(1);
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    name: data.name,
                    email: data.email,
                    profile: {
                        update: {
                            identityTypes: data.identityType,
                            identityNumber: data.identityNumber,
                            address: data.address
                        }
                    }
                },
                include: { profile: true }
            });
        });

        it('should throw error Unique constraint violation dynamic message', async () => {
            const data = {
                name: 'John Doe',
                email: 'john@mail.com',
                identityType: 'KTP',
                identityNumber: '1234567890',
                address: 'Jl. Kenangan No. 1'
            };

            prisma.user.update.mockRejectedValue({
                code: 'P2002',
                message: 'Unique constraint violation (email)'
            });

            await expect(userService.update(1, data)).rejects.toThrow(Error400);

            expect(prisma.user.update).toHaveBeenCalledTimes(1);
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    name: data.name,
                    email: data.email,
                    profile: {
                        update: {
                            identityTypes: data.identityType,
                            identityNumber: data.identityNumber,
                            address: data.address
                        }
                    }
                },
                include: { profile: true }
            });
        });

        it('should throw error Record not found', async () => {
            const data = {
                name: 'John Doe',
                email: 'john@mail.com',
                identityType: 'KTP',
                identityNumber: '1234567890',
                address: 'Jl. Kenangan No. 1'
            };

            prisma.user.update.mockRejectedValue({
                code: 'P2025',
                message: 'Record not found'
            });

            await expect(userService.update(1, data)).rejects.toThrow(Error);

            expect(prisma.user.update).toHaveBeenCalledTimes(1);
            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    name: data.name,
                    email: data.email,
                    profile: {
                        update: {
                            identityTypes: data.identityType,
                            identityNumber: data.identityNumber,
                            address: data.address
                        }
                    }
                },
                include: { profile: true }
            });
        });

        it('should throw error UnknownError', async () => {
            const data = {
                name: 'John Doe',
                email: 'john@mail.com',
                identityType: 'KTP',
                identityNumber: '1234567890',
                address: 'Jl. Kenangan No. 1'
            };

            prisma.user.update.mockRejectedValue(new Error('UnknownError'));

            await expect(userService.update(1, data)).rejects.toThrow(Error);

            expect(prisma.user.update).toHaveBeenCalledTimes(1);

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    name: data.name,
                    email: data.email,
                    profile: {
                        update: {
                            identityTypes: data.identityType,
                            identityNumber: data.identityNumber,
                            address: data.address
                        }
                    }
                },
                include: { profile: true }
            });

        });
    });

    describe('uploadImage', () => {
        it('should upload image and return updated user', async () => {
            const file = {
                originalname: 'image.jpg',
                buffer: Buffer.from('image.jpg')
            };

            const updatedUser = {
                id: 1,
                name: 'fulan',
                email: 'fulan@mail.com',
                profile: {
                    identityTypes: 'KTP',
                    identityNumber: '1234567890',
                    address: 'Jl. Kenangan No. 1',
                    imgUrl: 'https://ik.imagekit.io/username/image.jpg'
                }
            };

            prisma.user.update.mockResolvedValue(updatedUser);
            imagekit.upload.mockResolvedValue({
                url: 'https://ik.imagekit.io/username/image.jpg'
            });

            const result = await userService.uploadImage(1, file);

            expect(result).toEqual({
                ...updatedUser,
                password: undefined
            });

            expect(prisma.user.update).toHaveBeenCalledTimes(1);

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    profile: {
                        update: {
                            imgUrl: 'https://ik.imagekit.io/username/image.jpg'
                        }
                    }
                },
                include: { profile: true }
            });

            expect(imagekit.upload).toHaveBeenCalledTimes(1);

            expect(imagekit.upload).toHaveBeenCalledWith({
                file: file.buffer.toString('base64'),
                fileName: file.originalname,
                folder: '/profile'
            });

        });

        it('should throw error when record not found', async () => {
            const file = {
                originalname: 'image.jpg',
                buffer: Buffer.from('image.jpg')
            };

            prisma.user.update.mockRejectedValue({
                code: 'P2025',
                message: 'Record not found'
            });

            await expect(userService.uploadImage(1, file)).rejects.toThrow(Error400);

            expect(prisma.user.update).toHaveBeenCalledTimes(1);

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    profile: {
                        update: {
                            imgUrl: 'https://ik.imagekit.io/username/image.jpg'
                        }
                    }
                },
                include: { profile: true }
            });

            expect(imagekit.upload).toHaveBeenCalledTimes(1);

            expect(imagekit.upload).toHaveBeenCalledWith({
                file: file.buffer.toString('base64'),
                fileName: file.originalname,
                folder: '/profile'
            });

        });

        it('should throw error when unknown error', async () => {
            const file = {
                originalname: 'image.jpg',
                buffer: Buffer.from('image.jpg')
            };

            prisma.user.update.mockRejectedValue(new Error('UnknownError'));

            await expect(userService.uploadImage(1, file)).rejects.toThrow(Error);

            expect(prisma.user.update).toHaveBeenCalledTimes(1);

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    profile: {
                        update: {
                            imgUrl: 'https://ik.imagekit.io/username/image.jpg'
                        }
                    }
                },
                include: { profile: true }
            });

            expect(imagekit.upload).toHaveBeenCalledTimes(1);

            expect(imagekit.upload).toHaveBeenCalledWith({
                file: file.buffer.toString('base64'),
                fileName: file.originalname,
                folder: '/profile'
            });

        });

    });

});
