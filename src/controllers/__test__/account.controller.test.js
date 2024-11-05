import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import AccountCtrl from "../account.controller";
import AccountService from "../../services/account.service";
import { Error400, Error404 } from "../../utils/custom_error";

jest.mock("../../services/account.service");

describe('account controller', () => {
    let accountCtrl;
    let req;
    let res;
    let mockDataAccount1;
    let mockDataAccount2;

    beforeEach(() => {
        jest.clearAllMocks();
        accountCtrl = new AccountCtrl();
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        mockDataAccount1 = {
            "id": 1,
            "userId": 1,
            "bankName": "Bank Binar 1",
            "bankAccountNumber": "1234567892",
            "balance": 1000000,
            "user": {
                "id": 1,
                "name": "fulan",
                "email": "fulan2@gmail.com"
            }
        };
        mockDataAccount2 = {
            "id": 2,
            "userId": 2,
            "bankName": "Bank Binar 2",
            "bankAccountNumber": "1234567892",
            "balance": 1000000,
            "user": {
                "id": 2,
                "name": "fulana",
                "email": "fulana@gmail.com"
            }
        };
    });

    describe('get all account', () => {
        it('should return all account', async () => {
            AccountService.prototype.getAll.mockResolvedValue([mockDataAccount1, mockDataAccount2]);
            await accountCtrl.getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 200, message: 'Get All Data Success' },
                data: [mockDataAccount1, mockDataAccount2],
            });
        });

        it('should return 500 if error', async () => {
            AccountService.prototype.getAll.mockRejectedValue(new Error('Server error!'));
            await accountCtrl.getAll(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 500, message: 'Server error!' },
                data: null
            });
        });

    });

    describe('get one data account', () => {
        it('should return one account', async () => {
            req = { params: { id: 1 } };
            AccountService.prototype.getById.mockResolvedValue(mockDataAccount1);
            await accountCtrl.getById(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 200, message: 'Get Data Success' },
                data: mockDataAccount1,
            });
        });

        it('should return 404 if data null', async () => {
            req = { params: { id: 3 } };
            AccountService.prototype.getById.mockResolvedValue(null);
            await accountCtrl.getById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 404, message: 'Data Not Found' },
                data: null
            });
        });

        it('should return 404 if thwor error 404 from service', async () => {
            req = { params: { id: 3 } };
            AccountService.prototype.getById.mockRejectedValue(new Error404('Data not found!'));
            await accountCtrl.getById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 404, message: 'Data not found!' },
                data: null
            });
        })

        it('should return 500 if error', async () => {
            req = { params: { id: 1 } };
            AccountService.prototype.getById.mockRejectedValue(new Error('Server error!'));
            await accountCtrl.getById(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 500, message: 'Server error!' },
                data: null
            });
        });
    })

    describe('create data account', () => {
        req = {
            body: {
                userId: 1,
                bankName: "Bank Binar 1",
                bankAccountNumber: "1234567890",
                balance: 1000000
            }
        };

        it('should success create data account', async () => {
            AccountService.prototype.create.mockResolvedValue(mockDataAccount1);
            await accountCtrl.create(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 201, message: 'Create Bank Account Success' },
                data: mockDataAccount1,
            });
        });

        it('should return 400 if error validation controller', async () => {
            let reqWrong = {
                body: {
                    userId: 1,
                    bankName: "Bank Binar 1",
                    bankAccountNumber: "",
                    balance: 1000000
                }
            };
            
            await accountCtrl.create(reqWrong, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 400, message: 'Bad Request! - Validation error: "bankAccountNumber" is not allowed to be empty' },
                data: null
            });
        });

        it('should return 400 if error from validation prisma', async () => {
            AccountService.prototype.create.mockRejectedValue(new Error400('Some field already exists'));
            await accountCtrl.create(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 400, message: 'Bad Request! - Some field already exists' },
                data: null
            });
        });

        it('should return 400 if error from validation constraint with dynamic message', async () => {
            AccountService.prototype.create.mockRejectedValue(new Error400('(email) already exists'));
            await accountCtrl.create(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 400, message: 'Bad Request! - (email) already exists' },
                data: null
            });
        });

        it('should return 500 if error', async () => {
            AccountService.prototype.create.mockRejectedValue(new Error('Server error!'));
            await accountCtrl.create(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 500, message: 'Server error!' },
                data: null
            });
        });

    })

});