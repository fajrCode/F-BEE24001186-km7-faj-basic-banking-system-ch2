import AuthController from '../auth.controller.js';
import AuthService from '../../services/auth.service.js';
import ResponseHandler from '../../utils/response.js';
import { Error400 } from '../../utils/custom_error.js';

jest.mock('../../services/auth.service.js');

describe('Testing Auth Controller', () => {
    let authController;
    let responseHandler;
    let req;
    let res;
    let mockData;

    beforeEach(() => {
        jest.clearAllMocks();
        authController = new AuthController();
        responseHandler = new ResponseHandler();
        req = {};
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        mockData = {
            token: 'token',
        };
    });

    describe('Login', () => {
        beforeEach(() => {
            req.body = {
                email: 'fulan@mail.com',
                password: 'password',
            }
        });

        it('should return token when login success', async () => {
            AuthService.prototype.login.mockResolvedValue(mockData);

            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 200, message: 'Login success' },
                data: mockData,
            });
        });

        it('should throw error when email is wrong', async () => {
            AuthService.prototype.login.mockRejectedValue(new Error400('Email not found!'));

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 400, message: 'Bad Request! - Email not found!' },
                data: null,
            });
        });

        it('should throw error when password is wrong', async () => {
            AuthService.prototype.login.mockRejectedValue(new Error400('Password wrong!'));

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 400, message: 'Bad Request! - Password wrong!' },
                data: null,
            });
        });

        it('should throw error when login failed', async () => {
            AuthService.prototype.login.mockRejectedValue(new Error('Internal Server Error'));

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 500, message: 'Server error!' },
                data: null,
            });
        });

        it('should return 400 if validation error', async () => {
            req.body.email = 'fulan';
            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 400, message: 'Bad Request! - "email" must be a valid email' },
                data: null,
            });
        });

    });

    describe('Register', () => { 
        beforeEach(() => {
            req.body = {
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: '123456',
                confirmPassword: '123456',
                identityType: 'ktp',
                identityNumber: '1234567890123456',
                address: 'Address'
            }
        });

        it('should return user when register success', async () => {
            AuthService.prototype.register.mockResolvedValue(mockData);

            await authController.register(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 200, message: 'Register success' },
                data: mockData,
            });
        });

        it('should return 400 if validation error', async () => {
            req.body.email = 'fulan';
            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 400, message: 'Bad Request! - \"email\" must be a valid email' },
                data: null,
            });
        });

        it('should return 400 if error from service', async () => {
            AuthService.prototype.register.mockRejectedValue(new Error400('Some field already exists'));

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 400, message: 'Bad Request! - Some field already exists' },
                data: null,
            });
        });

        it('should return 500 if error', async () => {
            AuthService.prototype.register.mockRejectedValue(new Error('Internal Server Error'));

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 500, message: 'Server error!' },
                data: null,
            });
        });

     })


});

