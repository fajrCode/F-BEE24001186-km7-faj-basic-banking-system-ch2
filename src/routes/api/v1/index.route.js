import { Router } from 'express';
import { IndexCtrl } from '../../../controllers/index.controller.js';
import UserRoute from './user.route.js';
import AccountRoute from './account.route.js';
import TransactionRoute from './transaction.route.js';
import AuthRoute from './auth.route.js';

export default (app) => {
    const router = Router();
    const index = new IndexCtrl();

    app.use('/api/v1', router);
    
    router.get('/', index.root);

    new AuthRoute(router);
    new UserRoute(router);
    new AccountRoute(router);
    new TransactionRoute(router);

}