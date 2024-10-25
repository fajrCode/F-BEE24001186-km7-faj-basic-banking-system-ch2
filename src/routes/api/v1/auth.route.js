import AuthController from "../../../controllers/auth.controller.js";

export default class AuthRoute {
    constructor(router) {
        this.router = router;
        this.controller = new AuthController();
        this.basepath = '/auth';
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(this.basepath + '/login', this.controller.login);
    }
}