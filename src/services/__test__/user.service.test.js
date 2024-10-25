// Unit test for userService.js
import UserService from '../user.service.js';
import prisma from '../../configs/database.js';
import { ErrorDbInput } from '../../utils/custom_error.js';

// Mock prisma dan ErrorDbInput
jest.mock('../../configs/database.js', () => ({
    user: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    }
}));

describe('UserService', () => {
    let userService;

    beforeEach(() => {
        userService = new UserService();
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('should return all users', async () => {
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

            expect(result).toEqual(
                users.map(user => ({ 
                    ...user, 
                    password: undefined // memastikan password dihapus 
                }))
            );
            expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('getById', () => {
        test('should return a user by id without password', async () => {
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
    });

    describe('create', () => {
        test('should create a new user without password', async () => {
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

        test('should throw error Unique constraint violation', async () => {
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

            await expect(userService.create(data)).rejects.toThrow(ErrorDbInput);
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

        test('should throw error Record not found (just in case)', async () => {
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

        test('should throw error UnknownError', async () => {
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
        test('should update a user', async () => {
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

        test('should throw error Unique constraint violation', async () => {
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

            await expect(userService.update(1, data)).rejects.toThrow(ErrorDbInput);

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

        test('should throw error Record not found', async () => {
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

        test('should throw error UnknownError', async () => {
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
});
