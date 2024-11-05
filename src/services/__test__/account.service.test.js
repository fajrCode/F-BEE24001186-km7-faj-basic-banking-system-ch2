import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import AccountService from '../account.service';
import prisma from '../../configs/database.js';
import { Error400 } from '../../utils/custom_error.js';

jest.mock("../../configs/database.js", () => ({
    bankAccount: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
}));

describe('Testing Account Service', () => {
    let accountService;
    let mockData1;
    let mockData2;
    let mockInsertData;

    beforeEach(() => {
        accountService = new AccountService();
        jest.clearAllMocks();
        mockData1 = {
            "id": 1,
            "userId": 1,
            "bankName": "Bank Binar 1",
            "bankAccountNumber": "1234567890",
            "balance": 1000000,
            "user": {
                "id": 1,
                "name": "fulan",
                "email": "fulan@gmail.com"
            }
        };
        mockData2 = {
            "id": 2,
            "userId": 2,
            "bankName": "Bank Binar 2",
            "bankAccountNumber": "1234567891",
            "balance": 2000000,
            "user": {
                "id": 2,
                "name": "fulana",
                "email": "fulana@gmail.com"
            }
        }
        mockInsertData = {
            userId: 1,
            bankName: "Bank Binar 1",
            bankAccountNumber: "1234567890",
            balance: 1000000
        }
    });

    describe('Get All Data Account', () => {
        it('should return all data without password user', async () => {
            const mockData = [mockData1, mockData2];
            prisma.bankAccount.findMany.mockResolvedValue(mockData);
            const result = await accountService.getAll();
            expect(result).toEqual(mockData);
            expect(prisma.bankAccount.findMany).toHaveBeenCalledTimes(1);
        });
    })

    describe('Get One Data Account', () => {
        it('should return one data', async () => {
            prisma.bankAccount.findUnique.mockResolvedValue(mockData1);
            const result = await accountService.getById(1);
            expect(result).toEqual(mockData1);
            expect(prisma.bankAccount.findUnique).toHaveBeenCalledTimes(1);
        })

        it('should return null if data not found', async () => {
            prisma.bankAccount.findUnique.mockResolvedValue(null);
            const result = await accountService.getById(1);
            expect(result).toEqual(null);
            expect(prisma.bankAccount.findUnique).toHaveBeenCalledTimes(1);
        });
    });

    describe('Create Data Account', () => {
        it('should success create data account', async () => {
            prisma.bankAccount.create.mockResolvedValue(mockData1);
            await accountService.create(mockInsertData);
            expect(prisma.bankAccount.create).toHaveBeenCalledTimes(1);
            expect(prisma.bankAccount.create).toHaveBeenCalledWith({
                data: {
                    bankName: "Bank Binar 1",
                    bankAccountNumber: "1234567890",
                    balance: 1000000,
                    user: {
                        connect: {
                            id: 1
                        }
                    }
                },
                include: {
                    user: true
                }
            });
        });

        it('should error constraint data create data account with static message', async () => {
            prisma.bankAccount.create.mockRejectedValue({
                code: 'P2002',
                message: 'Some field already exists'
            });

            await expect(accountService.create(mockInsertData)).rejects.toThrow(Error400);
            expect(prisma.bankAccount.create).toHaveBeenCalledTimes(1);
        })

        it('should error constraint data create data account with dynamic message', async () => {
            prisma.bankAccount.create.mockRejectedValue({
                code: 'P2002',
                message: '(email) already exists'
            });

            await expect(accountService.create(mockInsertData)).rejects.toThrow(Error400);
            expect(prisma.bankAccount.create).toHaveBeenCalledTimes(1);
        })

        it('should error unknown error', async () => {
            prisma.bankAccount.create.mockRejectedValue(new Error('UnknownError'));
            await expect(accountService.create(mockInsertData)).rejects.toThrow(Error);
            expect(prisma.bankAccount.create).toHaveBeenCalledTimes(1);
        })

    })

    describe('Update Data Account', () => {
        it('should success update data account', async () => {
            const mockResponseUpdate = {
                "where": {
                    "id": 1,
                },
                "data": {
                    "balance": 1000000,
                    "bankAccountNumber": "1234567890",
                    "bankName": "Bank Binar 1",
                    "userId": 1,
                },
            };
            prisma.bankAccount.update.mockResolvedValue(mockData1);
            await accountService.update(1, mockInsertData);
            expect(prisma.bankAccount.update).toHaveBeenCalledTimes(1);
            expect(prisma.bankAccount.update).toHaveBeenCalledWith(mockResponseUpdate);
        });
    })

});