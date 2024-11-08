import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { IndexCtrl } from "../index.controller";

describe('Index Controller', () => {
    let indexCtrl;

    beforeEach(() => {
        indexCtrl = new IndexCtrl();
    });

    it('should return a message', async () => {
        const req = {};
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await indexCtrl.root(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: { code: 200, message: 'Binar x Fajri API v1 Ready to use (❁´◡`❁) Happy Coding!' },
            data: null,
        });
    });
});