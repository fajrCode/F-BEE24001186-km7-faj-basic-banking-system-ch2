import AccountCtrl from '../../../controllers/account.controller.js';
import { Auth } from '../../../middlewares/auth.js';

export default class AccountRoute {
    constructor(router) {
        this.router = router;
        this.controller = new AccountCtrl();
        this.basepath = '/accounts';
        this.auth = new Auth();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(this.basepath + '/', this.auth.authenticate, this.controller.create);
        this.router.get(this.basepath + '/', this.auth.authenticate, this.controller.getAll);
        this.router.get(this.basepath + '/:id', this.auth.authenticate, this.controller.getById);
    }
}