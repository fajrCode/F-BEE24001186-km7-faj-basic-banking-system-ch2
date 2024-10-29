import TransactionService from '../transaction.service';
import prisma from '../../configs/database';
import { Error404, Error400 } from '../../utils/custom_error';

jest.mock("../../configs/database.js", () => ({
    transaction: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
    },
    bankAccount: {
        findUnique: jest.fn(),
        update: jest.fn(),
    },
}));

describe('Transaction Service', () => {
    let transactionService;
    let mockTransaction1;
    let mockTransaction2;
    let sourceAccount;
    let destinationAccount;
    let mockInsertData;
    let mockInsertDataSameAccount;

    beforeEach(() => {
        jest.clearAllMocks();
        transactionService = new TransactionService();
        mockTransaction1 = {
            id: 1,
            amount: 1200000,
            sourceAccount: {
                id: 3,
                bankAccountNumber: "1234567891",
                balance: 1000000,
                user: {
                    id: 3,
                    name: "fulan"
                }
            },
            destinationAccount: {
                id: 1,
                bankAccountNumber: "1234567890",
                balance: 1000000,
                user: {
                    id: 3,
                    name: "fulan"
                }
            }
        };
        sourceAccount = {
            id: 1,
            balance: 1000000
        };
        destinationAccount = {
            id: 2,
            balance: 2000000
        };
        mockInsertData = {
            sourceAccountId: 1,
            destinationAccountId: 2,
            amount: 1000000
        };
        mockInsertDataSameAccount = {
            sourceAccountId: 1,
            destinationAccountId: 1,
            amount: 1000000
        };
    });

    describe('get all transaction', () => {
        it('should return all transaction', async () => {
            const mockData = [mockTransaction1, mockTransaction2];
            prisma.transaction.findMany.mockResolvedValue(mockData);
            const result = await transactionService.getAll();
            expect(result).toEqual(mockData);
            expect(prisma.transaction.findMany).toHaveBeenCalledTimes(1);
        })

        it('should return error 500', async () => {
            prisma.transaction.findMany.mockRejectedValue(new Error('Server Error'));
            await expect(transactionService.getAll()).rejects.toThrow();
            expect(prisma.transaction.findMany).toHaveBeenCalledTimes(1);
        });

    })

    describe('get one transaction', () => {
        it('should return one transaction', async () => {
            prisma.transaction.findUnique.mockResolvedValue(mockTransaction1);
            const result = await transactionService.getById(1);
            expect(result).toEqual(mockTransaction1);
            expect(prisma.transaction.findUnique).toHaveBeenCalledTimes(1);
        });

        it('should return null if data not found', async () => {
            prisma.transaction.findUnique.mockResolvedValue(null);
            const result = await transactionService.getById(1);
            expect(result).toEqual(null);
            expect(prisma.transaction.findUnique).toHaveBeenCalledTimes(1);
        });

        it('should return error 500', async () => {
            prisma.transaction.findUnique.mockRejectedValue(new Error('Server Error'));
            await expect(transactionService.getById(1)).rejects.toThrow(new Error('Server Error'));
            expect(prisma.transaction.findUnique).toHaveBeenCalledTimes(1);

        });

    });

    describe('create transaction', () => {
        it('should successfully create a transaction', async () => {
            prisma.bankAccount.findUnique
                .mockResolvedValueOnce(sourceAccount)
                .mockResolvedValueOnce(destinationAccount);
            prisma.bankAccount.update
                .mockResolvedValueOnce({
                    ...sourceAccount,
                    balance: sourceAccount.balance - mockInsertData.amount
                })
                .mockResolvedValueOnce({
                    ...destinationAccount,
                    balance: destinationAccount.balance + mockInsertData.amount
                });
            prisma.transaction.create.mockResolvedValue(mockTransaction1);

            const result = await transactionService.create(mockInsertData);

            expect(result).toEqual(mockTransaction1);
            expect(prisma.bankAccount.findUnique).toHaveBeenCalledTimes(2);
            expect(prisma.bankAccount.update).toHaveBeenCalledTimes(2);
            expect(prisma.transaction.create).toHaveBeenCalledTimes(1);
        });

        it('should throw Error404 when source account not found', async () => {
            prisma.bankAccount.findUnique.mockResolvedValue(null);

            await expect(transactionService.create(mockInsertData)).rejects.toThrow(Error404);
            expect(prisma.bankAccount.findUnique).toHaveBeenCalledTimes(1);
        });

        it('should throw Error404 when destination account not found', async () => {
            prisma.bankAccount.findUnique.mockResolvedValueOnce(sourceAccount).mockResolvedValueOnce(null);

            await expect(transactionService.create(mockInsertData)).rejects.toThrow(Error404);
            expect(prisma.bankAccount.findUnique).toHaveBeenCalledTimes(2);
        });

        it('should throw Error400 when source and destination accounts are the same', async () => {

            prisma.bankAccount.findUnique.mockResolvedValue(sourceAccount);

            mockInsertDataSameAccount.destinationAccountId = mockInsertDataSameAccount.sourceAccountId;

            await expect(transactionService.create(mockInsertDataSameAccount)).rejects.toThrow(Error400);
            expect(prisma.bankAccount.findUnique).toHaveBeenCalledTimes(2);
        });

        it('should throw Error400 when balance is insufficient', async () => {
            prisma.bankAccount.findUnique.mockResolvedValueOnce(sourceAccount);
            mockInsertData.amount = 2000000; // Greater than sourceAccount balance

            await expect(transactionService.create(mockInsertData)).rejects.toThrow(Error400);
            expect(prisma.bankAccount.findUnique).toHaveBeenCalledTimes(2);
        });

        it('should handle unexpected errors gracefully', async () => {
            prisma.bankAccount.findUnique.mockRejectedValue(new Error('Unexpected error'));

            await expect(transactionService.create(mockInsertData)).rejects.toThrow(Error);
            expect(prisma.bankAccount.findUnique).toHaveBeenCalledTimes(1);
        });
    });

    describe('delete transaction', () => {
        it('should return one transaction', async () => {
            prisma.transaction.findUnique.mockResolvedValue(mockTransaction1);
            prisma.bankAccount.update.mockResolvedValue(sourceAccount);
            prisma.transaction.delete.mockResolvedValue(mockTransaction1);
            const result = await transactionService.delete(1);
            expect(result).toEqual(mockTransaction1);
            expect(prisma.transaction.findUnique).toHaveBeenCalledTimes(1);
            expect(prisma.bankAccount.update).toHaveBeenCalledTimes(2);
            expect(prisma.transaction.delete).toHaveBeenCalledTimes(1);
        });

        it('should return error 400 if data not found', async () => {
            prisma.transaction.findUnique.mockResolvedValue(null);
            await expect(transactionService.delete(1)).rejects.toThrow(Error404);
            expect(prisma.transaction.findUnique).toHaveBeenCalledTimes(1);
        });

        it('should return error 404 not found if source account not found', async () => {
            prisma.transaction.findUnique.mockRejectedValue(new Error404('Source account not found'));
            await expect(transactionService.delete(1)).rejects.toThrow(Error404);
            expect(prisma.transaction.findUnique).toHaveBeenCalledTimes(1);
        });

        it('should return error 404 not found if destination account not found', async () => {
            prisma.transaction.findUnique.mockRejectedValue(new Error404('Destination account not found'));
            await expect(transactionService.delete(1)).rejects.toThrow(Error404);
            expect(prisma.transaction.findUnique).toHaveBeenCalledTimes(1);
        });

        it('should return error 500', async () => {
            prisma.transaction.findUnique.mockRejectedValue(new Error('Server Error'));
            await expect(transactionService.delete(1)).rejects.toThrow(new Error('Server Error'));
            expect(prisma.transaction.findUnique).toHaveBeenCalledTimes(1);
        });

    });

});