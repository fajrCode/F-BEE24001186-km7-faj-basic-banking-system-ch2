import TransactionCtrl from '../../../controllers/transaction.controller.js';

export default class TransactionRoute {
    constructor(router) {
        this.router = router;
        this.controller = new TransactionCtrl();
        this.basepath = '/transactions';
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.post(this.basepath + '/', this.controller.create);
        this.router.get(this.basepath + '/', this.controller.getAll);
        this.router.get(this.basepath + '/:id', this.controller.getById);
        this.router.delete(this.basepath + '/:id', this.controller.delete);
    }
}