import UserCtrl from '../../../controllers/user.controller.js';
import { Auth } from '../../../middlewares/auth.js';

export default class UserRoute {
    constructor(router) {
        this.router = router;
        this.controller = new UserCtrl();
        this.basepath = '/users';
        this.auth = new Auth();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(this.basepath + '/', this.auth.authenticate, this.controller.getAll);
        this.router.get(this.basepath + '/:id', this.auth.authenticate, this.controller.getById);
        this.router.post(this.basepath + '/', this.auth.authenticate, this.controller.create);
        this.router.put(this.basepath + '/:id', this.auth.authenticate, this.controller.update);
    }
}