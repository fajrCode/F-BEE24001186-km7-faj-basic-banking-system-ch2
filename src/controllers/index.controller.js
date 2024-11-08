import ResponseHandler from "../utils/response.js";

const response = new ResponseHandler();

export class IndexCtrl {
    root = (req, res) => {
        return response.res200('Binar x Fajri API v1 Ready to use (❁´◡`❁) Happy Coding!!!', null, res)
    }
}