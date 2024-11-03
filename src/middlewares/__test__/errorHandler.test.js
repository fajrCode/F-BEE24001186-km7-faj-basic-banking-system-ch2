import ErrorHandler from '../errorHandler.js';
import { Error400 } from '../../utils/custom_error.js';

describe('Error Handler Middleware', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    describe('handle404', () => {
        it('should return 404 with message', () => {
            ErrorHandler.handle404(req, res, next);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                status: {
                    code: 404,
                    message: 'URL Not Found!',
                },
                data: null,
            });

        });
    });

    describe('handleError', () => {
        it('should return 400 with message', () => {
            const err = new Error400('error');
            ErrorHandler.handleError(err, req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                status: {
                    code: 400,
                    message: 'Bad Request! - error',
                },
                data: null,
            });
        });

        it('should return 500 with message', () => {
            const err = { message: 'error' };
            ErrorHandler.handleError(err, req, res, next);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                status: {
                    code: 500,
                    message: 'Server error!',
                },
                data: null,
            });

        });
    });

});


