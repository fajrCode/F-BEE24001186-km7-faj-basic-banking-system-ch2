import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import UserCtrl from '../user.controller.js';
import UserService from '../../services/user.service.js';
import { Error400 } from '../../utils/custom_error.js';

jest.mock('../../services/user.service.js'); // Mock UserService

describe('User Controller', () => {
    let userCtrl;
    let res;
    let req;

    beforeEach(() => {
        jest.clearAllMocks();
        userCtrl = new UserCtrl();
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    describe('create a user', () => {
        req = {
            body: {
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: '123456',
                identityType: 'ktp',
                identityNumber: '1234567890123456',
                address: 'Address'
            }
        };

        it('should return 500 other error', async () => {
            UserService.prototype.create.mockRejectedValueOnce(new Error('UnknownError'));

            await userCtrl.create(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 500, message: 'Server error!' },
                data: null,
            });

        });

        it('should return 400 if error is instance of Error400', async () => {
            UserService.prototype.create.mockRejectedValueOnce(new Error400('Email field already exists'));

            await userCtrl.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 400, message: 'Bad Request! - Email field already exists' },
                data: null,
            });

        });

        it('should return 400 if validation error', async () => {
            let reqWrong = { body: { name: 'Jane Doe', email: 'jane@mail.com' } };

            UserService.prototype.create.mockResolvedValueOnce({ id: 1, ...req.body });

            await userCtrl.create(reqWrong, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 400, message: 'Bad Request! - Validation error: "password" is required' },
                data: null,
            });
        });

        it('should create a user', async () => {
            UserService.prototype.create.mockResolvedValueOnce({ id: 1, ...req.body });

            await userCtrl.create(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 201, message: 'Create User and Profile Success' },
                data: { id: 1, ...req.body },
            });
        });

    });

    describe('get all user', () => {
        it('should get all users', async () => {
            UserService.prototype.getAll.mockResolvedValueOnce([{ id: 1, name: 'Jane Doe', email: 'jane@example.com' }]);

            await userCtrl.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 200, message: 'Get All Data Success' },
                data: [{ id: 1, name: 'Jane Doe', email: 'jane@example.com' }],
            });
        });

        it('should return 500 other error', async () => {
            UserService.prototype.getAll.mockRejectedValueOnce(new Error('UnknownError'));

            await userCtrl.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 500, message: 'Server error!' },
                data: null,
            });
        });

    })

    describe('get one user', () => {
        it('should get a user by ID', async () => {
            req = { params: { id: 1 } };

            UserService.prototype.getById.mockResolvedValueOnce({ id: 1, name: 'Jane Doe', email: 'jane@example.com' });

            await userCtrl.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 200, message: 'Get Data Success' },
                data: { id: 1, name: 'Jane Doe', email: 'jane@example.com' },
            });
        });

        it('should return 404 if user not found', async () => {
            req = { params: { id: 1 } };

            UserService.prototype.getById.mockResolvedValueOnce(null);

            await userCtrl.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 404, message: 'Data Not Found' },
                data: null,
            });
        });

        it('should return 500 other error', async () => {
            req = { params: { id: 1 } };

            UserService.prototype.getById.mockRejectedValueOnce(new Error('UnknownError'));

            await userCtrl.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 500, message: 'Server error!' },
                data: null,
            });
        });
    })

    describe('update a user', () => {
        it('should return 500 other error', async () => {
            req = {
                params: { id: 1 },
                body: {
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    password: '123456',
                    identityType: 'ktp',
                    identityNumber: '1234567890123456',
                    address: 'Address'
                }
            };

            UserService.prototype.update.mockRejectedValueOnce(new Error('UnknownError'));

            await userCtrl.update(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 500, message: 'Server error!' },
                data: null,
            });
        });

        it('should return 400 if error is instance of Error400', async () => {
            req = {
                params: { id: 1 },
                body: {
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    password: '123456',
                    identityType: 'ktp',
                    identityNumber: '1234567890123456',
                    address: 'Address'
                }
            };

            UserService.prototype.update.mockRejectedValueOnce(new Error400('Error: Invocation Error'));

            await userCtrl.update(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 400, message: 'Bad Request! - Error: Invocation Error' },
                data: null,
            });
        });

        it('should update a user', async () => {
            req = {
                params: { id: 1 },
                body: {
                    name: 'Jane Doe',
                    email: 'jane@example.com',
                    password: '123456',
                    identityType: 'ktp',
                    identityNumber: '1234567890123456',
                    address: 'Address'
                }
            };

            UserService.prototype.update.mockResolvedValueOnce({ id: 1, ...req.body });

            await userCtrl.update(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 201, message: 'Update User and Profile Success' },
                data: { id: 1, ...req.body },
            });
        });

        it('should return 400 if validation error', async () => {
            req = { params: { id: 1 }, body: { name: 'Jane Doe' } };

            UserService.prototype.update.mockResolvedValueOnce({ id: 1, name: 'Jane Doe' });

            await userCtrl.update(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 400, message: 'Bad Request! - Validation error: "email" is required' },
                data: null,
            });
        });

    })

    describe('update a user image profile', () => {
        let mockResponse = {
            "id": 24,
            "name": "fulans",
            "email": "fulans@gmail.com",
            "profile": {
                "id": 14,
                "userId": 24,
                "identityTypes": "ktp",
                "identityNumber": "1571123456789100",
                "address": "Jln. Jalan 1",
                "imgUrl": "https://ik.imagekit.io/username/folder/image.jpg"
            }
        };

        beforeEach(() => {
            jest.clearAllMocks();

            req = {
                user: { id: 1 },
                file: { filename: 'default.jpg' }
            };
        });

        it('should return 500 other error', async () => {
            UserService.prototype.uploadImage.mockRejectedValueOnce(new Error('UnknownError'));

            await userCtrl.uploadImage(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 500, message: 'Server error!' },
                data: null,
            });
        });

        it('should upload image profile', async () => {
            UserService.prototype.uploadImage.mockResolvedValueOnce(mockResponse);

            await userCtrl.uploadImage(req, res);

            expect(res.status).toHaveBeenCalledWith(201);

            expect(res.json).toHaveBeenCalledWith({
                status: { code: 201, message: 'Upload Image Success' },
                data: mockResponse
            });
        });

        it('should return 400 if no file uploaded', async () => {
            req = { user: { id: 1 } };

            UserService.prototype.uploadImage.mockResolvedValueOnce(null);

            await userCtrl.uploadImage(req, res);

            expect(res.status).toHaveBeenCalledWith(400);

            expect(res.json).toHaveBeenCalledWith({
                status: { code: 400, message: 'Bad Request! - Please select an image to upload' },
                data: null,
            });


        });

    });

});
