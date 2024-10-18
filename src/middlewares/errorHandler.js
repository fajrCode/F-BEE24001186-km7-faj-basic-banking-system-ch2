import ResponseHandler from '../utils/response.js';

class ErrorHandler {
    static handle404(req, res, next) {
        const responseHandler = new ResponseHandler();
        responseHandler.res404(res);
    }

    static handleError(err, req, res, next) {
        const responseHandler = new ResponseHandler();
        console.error(err.stack); // Log error ke console
        responseHandler.res500(res);
    }
}

export default ErrorHandler;
