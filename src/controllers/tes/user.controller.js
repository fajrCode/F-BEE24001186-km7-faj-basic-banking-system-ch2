// src/controllers/__tests__/user.controller.test.js
import UserCtrl from '../user.controller.js';
import UserService from '../../services/user.service.js';

jest.mock('../../services/user.service.js'); // Mock UserService

describe('User Controller', () => {
    let userCtrl;

    beforeEach(() => {
        userCtrl = new UserCtrl();
    });

    it('should create a user', async () => {
        const req = { body: { name: 'Jane Doe', email: 'jane@example.com', password: '123456', identityType: 'ktp', identityNumber: '1234567890123456', address: 'Address' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        
        UserService.prototype.create.mockResolvedValueOnce({ id: 1, ...req.body });

        await userCtrl.create(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: { code: 200, message: 'Create User and Profile Success' },
            data: { id: 1, ...req.body },
        });
    });

    it('should get all users', async () => {
        const req = {};
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        UserService.prototype.getAll.mockResolvedValueOnce([{ id: 1, name: 'Jane Doe', email: 'jane@example.com' }]);

        await userCtrl.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: { code: 200, message: 'Get All Data Success' },
            data: [{ id: 1, name: 'Jane Doe', email: 'jane@example.com' }],
        });
    });

    it('should get a user by ID', async () => {
        const req = { params: { id: 1 } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        UserService.prototype.getById.mockResolvedValueOnce({ id: 1, name: 'Jane Doe', email: 'jane@example.com' });

        await userCtrl.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: { code: 200, message: 'Get Data Success' },
            data: { id: 1, name: 'Jane Doe', email: 'jane@example.com' },
        });
    });

    // it('should update a user', async () => {
    //     const req = { params: { id: 1 }, body: { name: 'John Doe', email: 'john@example.com' } };
    //     const res = {
    //         json: jest.fn(),
    //         status: jest.fn().mockReturnThis(),
    //     };

    //     UserService.prototype.update.mockResolvedValueOnce({ id: 1, name: 'John Doe', email: 'john@example.com' });

    //     await userCtrl.update(req, res);

    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({
    //         status: { code: 200, message: 'User updated successfully!' },
    //         data: { id: 1, name: 'John Doe', email: 'john@example.com' },
    //     });
    // });

    it('should delete a user', async () => {
        const req = { params: { id: 1 } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        UserService.prototype.delete.mockResolvedValueOnce({ id: 1 });

        await userCtrl.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: { code: 200, message: 'Delete Data Success' },
            data: { id: 1 },
        });
    });
});
