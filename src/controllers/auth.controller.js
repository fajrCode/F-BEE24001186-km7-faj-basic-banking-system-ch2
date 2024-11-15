import AuthService from "../services/auth.service.js";
import { loginValidator, registerValidator } from "../validations/auth.validation.js";
import ResponseHandler from "../utils/response.js";
import { Error400 } from "../utils/custom_error.js";

export default class AuthController {
    constructor() {
        this.test = "test";
        this.service = new AuthService();
        this.response = new ResponseHandler();
        // this.login = this.login.bind(this); // Bind the login method if use function declaration (async login (req, res) {})
    }

    login = async (req, res) => {
        try {
            const { error, value } = loginValidator.validate(req.body);

            if (error) {
                throw new Error400(`${error.details[0].message}`);
            }

            const result = await this.service.login(value);
            return this.response.res200("Login success", result, res);
        } catch (error) {
            if (error instanceof Error400) {
                return this.response.res400(error.message, res);
            } else {
                console.log(error.message);
                return this.response.res500(res);
            }
        };
    };

    register = async (req, res) => {
        try {
            const { error, value } = registerValidator.validate(req.body);

            if (error) {
                throw new Error400(`${error.details[0].message}`);
            }

            const result = await this.service.register(value);
            return this.response.res200("Register success", result, res);
        } catch (error) {
            if (error instanceof Error400) {
                return this.response.res400(error.message, res);
            } else {
                console.log(error.message);
                return this.response.res500(res);
            }
        };
    };

    authenticate = async (req, res) => {
        try {
            const result = await this.service.authenticate(req.user.id);
            return this.response.res200("Authenticated", result, res);
        } catch (error) {
            console.log(error.message);
            return this.response.res500(res);
        };
    };

    forgotPassword = async (req, res) => {
        try {
            const result = await this.service.forgotPassword(req.body.email);
            return this.response.res200("Forgot password success", result, res);
        } catch (error) {
            console.log(error.message);
            return this.response.res500(res);
        };
    };

};