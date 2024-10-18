import AccountCtrl from '../../../controllers/account.controller.js';

export default class AccountRoute {
    constructor(router) {
        this.router = router;
        this.controller = new AccountCtrl();
        this.basepath = '/accounts';
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(this.basepath + '/', this.controller.create);
        this.router.get(this.basepath + '/', this.controller.getAll);
        this.router.get(this.basepath + '/:id', this.controller.getById);
    }
}