import TransactionCtrl from '../../../controllers/transaction.controller.js';
import { Auth } from '../../../middlewares/auth.js';

export default class TransactionRoute {
    constructor(router) {
        this.router = router;
        this.controller = new TransactionCtrl();
        this.basepath = '/transactions';
        this.auth = new Auth();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(this.basepath + '/', this.auth.authenticate, this.controller.create);
        this.router.get(this.basepath + '/', this.auth.authenticate, this.controller.getAll);
        this.router.get(this.basepath + '/:id', this.auth.authenticate, this.controller.getById);
        this.router.delete(this.basepath + '/:id', this.auth.authenticate, this.controller.delete);
    }
}