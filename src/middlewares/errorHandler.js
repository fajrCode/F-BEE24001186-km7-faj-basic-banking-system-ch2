import ResponseHandler from '../utils/response.js';

class ErrorHandler {
    static handle404(req, res, next) {
        const responseHandler = new ResponseHandler();
        responseHandler.res404("URL Not Found!", res);
    }

    static handleError(err, req, res, next) {
        const responseHandler = new ResponseHandler();
        console.log('Server error: ' + err.message);
        responseHandler.res500(res);
    }
}

export default ErrorHandler;
