import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import TransactionCtrl from "../transaction.controller";
import TransactionService from "../../services/transaction.service";
import { Error400, Error404 } from "../../utils/custom_error";

jest.mock("../../services/transaction.service");

describe('transaction controller', () => {
    let transactionCtrl;
    let req;
    let res;
    let mockDataTransaction1;
    let mockDataTransaction2;
    let mockWrongDataInsert;

    beforeEach(() => {
        jest.clearAllMocks();
        transactionCtrl = new TransactionCtrl();
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        mockDataTransaction1 = {
            "id": 1,
            "sourceAccountId": 1,
            "destinationAccountId": 2,
            "amount": 100000,
            "sourceAccount": {
                "id": 1,
                "bankAccountNumber": "1234567892",
                "balance": 1000000,
                "user": {
                    "id": 1,
                    "name": "fulan",
                }
            },
            "destinationAccount": {
                "id": 2,
                "bankAccountNumber": "1234567892",
                "balance": 1000000,
                "user": {
                    "id": 2,
                    "name": "fulana",
                }
            }
        };
        mockDataTransaction2 = {
            "id": 2,
            "sourceAccountId": 2,
            "destinationAccountId": 1,
            "amount": 100000,
            "sourceAccount": {
                "id": 2,
                "bankAccountNumber": "1234567892",
                "balance": 1000000,
                "user": {
                    "id": 2,
                    "name": "fulana",
                }
            },
            "destinationAccount": {
                "id": 1,
                "bankAccountNumber": "1234567892",
                "balance": 1000000,
                "user": {
                    "id": 1,
                    "name": "fulan",
                }
            }
        };
        mockWrongDataInsert = {
            "sourceAccountId": 1,
            "destinationAccountId": '',
            "amount": '100000'
        };
    });

    describe('create transaction', () => {
        it('should return new transaction', async () => {
            TransactionService.prototype.create.mockResolvedValue(mockDataTransaction1);
            req = {
                body: {
                    sourceAccountId: 1,
                    destinationAccountId: 2,
                    amount: 100000,
                }
            };
            await transactionCtrl.create(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 200, message: 'Create Transaction Success' },
                data: mockDataTransaction1,
            });
        });

        it('should return 400 if validation error', async () => {
            req = {
                body: {
                    sourceAccountId: 1,
                    destinationAccountId: '',
                    amount: '100000',
                }
            };

            TransactionService.prototype.create.mockResolvedValue(mockWrongDataInsert);
            await transactionCtrl.create(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 400, message: 'Bad Request! - Validation error: "destinationAccountId" must be a number' },
                data: null,
            });
        });

        it('should return 404 if source account not found', async () => {
            TransactionService.prototype.create.mockRejectedValue(new Error404('Source account not found'));
            req = {
                body: {
                    sourceAccountId: 1,
                    destinationAccountId: 2,
                    amount: 100000,
                }
            };
            await transactionCtrl.create(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 404, message: 'Source account not found' },
                data: null,
            });
        });

        it('should return 404 if destination account not found', async () => {
            TransactionService.prototype.create.mockRejectedValue(new Error404('Destination account not found'));
            req = {
                body: {
                    sourceAccountId: 1,
                    destinationAccountId: 2,
                    amount: 100000,
                }
            };
            await transactionCtrl.create(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 404, message: 'Destination account not found' },
                data: null,
            });
        });

        it('should return 400 if source account equal to destination account', async () => {
            TransactionService.prototype.create.mockRejectedValue(new Error400('Cannot transfer to the same account'));
            req = {
                body: {
                    sourceAccountId: 1,
                    destinationAccountId: 1,
                    amount: 100000,
                }
            };
            await transactionCtrl.create(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 400, message: 'Bad Request! - Cannot transfer to the same account' },
                data: null,
            });
        });

        it('should return 400 if insufficient balance', async () => {
            TransactionService.prototype.create.mockRejectedValue(new Error400('Insufficient balance'));
            req = {
                body: {
                    sourceAccountId: 1,
                    destinationAccountId: 2,
                    amount: 1000000,
                }
            };
            await transactionCtrl.create(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 400, message: 'Bad Request! - Insufficient balance' },
                data: null,
            });
        });

        it('should return 500 if error', async () => {
            TransactionService.prototype.create.mockRejectedValue(new Error('Server error!'));
            req = {
                body: {
                    sourceAccountId: 1,
                    destinationAccountId: 2,
                    amount: 100000,
                }
            };
            await transactionCtrl.create(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 500, message: 'Server error!' },
                data: null,
            });
        });

    });

    describe('get all transaction', () => {
        it('should return all transaction', async () => {
            TransactionService.prototype.getAll.mockResolvedValue([mockDataTransaction1, mockDataTransaction2]);
            req = {};
            await transactionCtrl.getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 200, message: 'Get All Data Success' },
                data: [mockDataTransaction1, mockDataTransaction2],
            });
        });

        it('should return 500 if error', async () => {
            TransactionService.prototype.getAll.mockRejectedValue(new Error('Server error!'));
            req = {};
            await transactionCtrl.getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 500, message: 'Server error!' },
                data: null,
            });
        });
    });

    describe('get one transaction', () => {
        it('should return one transaction', async () => {
            req = { params: { id: 1 } };
            TransactionService.prototype.getById.mockResolvedValue(mockDataTransaction1);
            await transactionCtrl.getById(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 200, message: 'Get Data Success' },
                data: mockDataTransaction1,
            });
        });

        it('should return 404 if data null', async () => {
            req = { params: { id: 3 } };
            TransactionService.prototype.getById.mockResolvedValue(null);
            await transactionCtrl.getById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 404, message: 'Data Not Found' },
                data: null,
            });
        });

        it('should return 404 if throw error 404 from service', async () => {
            req = { params: { id: 3 } };
            TransactionService.prototype.getById.mockRejectedValue(new Error404('Data not found!'));
            await transactionCtrl.getById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 404, message: 'Data not found!' },
                data: null,
            });
        });

        it('should return 500 if error', async () => {
            req = { params: { id: 1 } };
            TransactionService.prototype.getById.mockRejectedValue(new Error('Server error!'));
            await transactionCtrl.getById(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 500, message: 'Server error!' },
                data: null,
            });
        });

    });

    describe('delete transaction', () => {
        it('should return deleted transaction', async () => {
            req = { params: { id: 1 } };
            TransactionService.prototype.delete.mockResolvedValue(mockDataTransaction1);
            await transactionCtrl.delete(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 200, message: 'Delete Data Success' },
                data: mockDataTransaction1,
            });
        });

        it('should return 404 if data null', async () => {
            req = { params: { id: 3 } };
            TransactionService.prototype.delete.mockResolvedValue(null);
            await transactionCtrl.delete(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 404, message: 'Data Not Found' },
                data: null,
            });
        });

        it('should return 500 if error', async () => {
            req = { params: { id: 1 } };
            TransactionService.prototype.delete.mockRejectedValue(new Error('Server error!'));
            await transactionCtrl.delete(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 500, message: 'Server error!' },
                data: null,
            });
        });

    });

});