import UserCtrl from '../../../controllers/user.controller.js';

export default class UserRoute {
    constructor(router) {
        this.router = router;
        this.controller = new UserCtrl();
        this.basepath = '/users';
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get(this.basepath + '/', this.controller.getAll);
        this.router.get(this.basepath + '/:id', this.controller.getById);
    }
}