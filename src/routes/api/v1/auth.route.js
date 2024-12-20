import AuthController from "../../../controllers/auth.controller.js";
import { Auth } from "../../../middlewares/auth.js";

export default class AuthRoute {
    constructor(router) {
        this.router = router;
        this.controller = new AuthController();
        this.basepath = '/auth';
        this.auth = new Auth();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(this.basepath + '/login', this.auth.checkLoginAuth, this.controller.login);
        this.router.post(this.basepath + '/register', this.auth.checkLoginAuth, this.controller.register);
        this.router.get(this.basepath + '/authenticate', this.auth.authenticate, this.controller.authenticate);
        this.router.post(this.basepath + '/forgot-password', this.auth.checkLoginAuth, this.controller.forgotPassword);
        this.router.get(this.basepath + '/reset-password/:token', this.auth.checkLoginAuth, this.controller.resetPasswordPage);
        this.router.post(this.basepath + '/reset-password', this.auth.checkLoginAuth, this.controller.resetPassword);
    }
}