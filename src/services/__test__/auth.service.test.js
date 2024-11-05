import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthService from '../auth.service';
import prisma from '../../configs/database.js';
import { Error400 } from '../../utils/custom_error.js';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../configs/database.js', () => ({
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
}));

describe('Testing Auth Service', () => {
    let authService;
    let mockData;
    let mockUser;

    beforeEach(() => {
        authService = new AuthService();
        jest.clearAllMocks();
        mockData = {
            email: 'fulan',
            password: 'password',
        };
        mockUser = {
            id: 1,
            name: 'fulan',
            email: 'fulan',
            password: 'password',
        };
    });

    describe('Login', () => {
        it('should return token when login success', async () => {
            prisma.user.findUnique.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token');

            const result = await authService.login(mockData);

            expect(result).toEqual({ token: 'token' });
        });

        it('should throw error when email is wrong', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            await expect(authService.login(mockData)).rejects.toThrow(Error400);
        });

        it('should throw error when password is wrong', async () => {
            prisma.user.findUnique.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await expect(authService.login(mockData)).rejects.toThrow(Error400);
        });

        it('should throw error when login failed', async () => {
            prisma.user.findUnique.mockRejectedValue(new Error('Internal Server Error'));

            await expect(authService.login(mockData)).rejects.toThrow(Error);
        });
    });

    describe('Register', () => {
        it('should return user when register success', async () => {
            prisma.user.create.mockResolvedValue(mockUser);

            const result = await authService.register(mockData);

            expect(result).toEqual(mockUser);
        });

        it('should throw error when email already exists', async () => {
            prisma.user.create.mockRejectedValue({ code: 'P2002', message: '(email) already exists' });

            await expect(authService.register(mockData)).rejects.toThrow(Error400);
        });

        it('should throw error ehten some field already exists', async () => {
            prisma.user.create.mockRejectedValue({ code: 'P2002', message: 'some field already exists' });

            await expect(authService.register(mockData)).rejects.toThrow(Error400);
        });

        it('should throw error when register failed', async () => {
            prisma.user.create.mockRejectedValue(new Error('Internal Server Error'));

            await expect(authService.register(mockData)).rejects.toThrow(Error);
        });

    });

    describe('Authenticate', () => {
        it('should return user when authenticate success', async () => {
            prisma.user.findUnique.mockResolvedValue(mockUser);

            const result = await authService.authenticate(1);

            expect(result).toEqual(mockUser);
        });

        it('should return null when user not found', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            const result = await authService.authenticate(1);

            expect(result).toBeNull();
        });

        it('should throw error when authenticate failed', async () => {
            prisma.user.findUnique.mockRejectedValue(new Error('Internal Server Error'));

            await expect(authService.authenticate(1)).rejects.toThrow(Error);
        });
    });

});
