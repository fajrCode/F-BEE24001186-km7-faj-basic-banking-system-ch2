import AuthService from "../services/auth.service.js";
import loginValidator from "../validations/auth.validation.js";

export default class AuthController {
    constructor() {
        this.test = "test";
        this.service = new AuthService();
        // this.login = this.login.bind(this); // Bind the login method if use function declaration (async login (req, res) {})
    }

    login = async (req, res) => {
        try {
            console.log(this.test);
            const data = await loginValidator.validateAsync(req.body);
            const result = await this.service.login(data);
            return res.status(200).json({
                status: "success",
                message: "Login success",
                data: result,
            });
        } catch (error) {
            const msg = error.message || "Internal Server Error";
            return res.status(500).json({
                status: "error",
                message: msg,
            });
        }
    }
}