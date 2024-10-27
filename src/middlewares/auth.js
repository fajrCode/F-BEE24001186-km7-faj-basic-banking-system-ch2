import ResponseHandler from "../utils/response.js";
import jwt from "jsonwebtoken";

export class Auth {
    constructor() {
        this.response = new ResponseHandler();
    }

    authenticate = (req, res, next)=> {
        const { authorization } = req.headers;

        if (!authorization) {
            return this.response.res401(res);
        }

        const token = authorization.split(" ")[1] || authorization;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const payload = {
                id: decoded.id,
                name: decoded.name,
            };
            req.user = payload;
            next();
        } catch (error) {
            return this.response.res401(res);
        }
    }

    checkLoginAuth = (req, res, next) => {
        try {
            const { authorization } = req.headers;
            if(authorization){
                return this.response.res401(res);
            }
            next();
        } catch (error) {
            console.log(error.message);
            return this.response.res500(res);
        }
    }

}