import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { IndexCtrl } from "../index.controller";
import { getIoInstance } from '../../configs/websocket.js';

jest.mock('../../configs/websocket.js', () => ({
    getIoInstance: jest.fn(),
}));

describe('Index Controller', () => {
    let indexCtrl;

    beforeEach(() => {
        indexCtrl = new IndexCtrl();
    });

    describe('root', () => {
        it('should return 200 OK with message', async () => {
            const req = {};
            const res = {
                render: jest.fn(),
                status: jest.fn(() => res),
                json: jest.fn(),
            };

            const io = {
                emit: jest.fn(),
            };

            getIoInstance.mockReturnValue(io);

            await indexCtrl.root(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                status: { code: 200, message: 'Binar x Fajri API v1 Ready to use (❁´◡`❁) Happy Coding!' },
                data: null,
            });
            expect(res.render).toHaveBeenCalledTimes(0);
            expect(io.emit).toHaveBeenCalledTimes(2);
        });

    });

    describe('welcome', () => {
        it('should return welcome message', async () => {
            const req = {};
            const res = {
                render: jest.fn(),
            };

            const io = {
                emit: jest.fn(),
            };

            getIoInstance.mockReturnValue(io);

            await indexCtrl.welcome(req, res);

            expect(res.render).toHaveBeenCalledWith('welcome.ejs', { msg: 'Welcome Brodie' });
        });
    });

    describe('notification', () => {
        it('should return notification page', async () => {
            const req = {};
            const res = {
                render: jest.fn(),
            };

            await indexCtrl.notification(req, res);

            expect(res.render).toHaveBeenCalledWith('notification.ejs');
        });
    });

});