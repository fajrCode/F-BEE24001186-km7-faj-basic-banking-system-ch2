import { Router } from 'express';
import { IndexCtrl } from '../../../controllers/index.controller.js';
import UserRoute from './user.route.js';
import AccountRoute from './account.route.js';
import TransactionRoute from './transaction.route.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../../docs/api-v1.json' with { type: "json" };
import AuthRoute from './auth.route.js';

export default (app) => {
    const router = Router();
    const index = new IndexCtrl();

    app.get('/', index.welcome);
    
    app.use('/api/v1', router);
    app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    
    router.get('/', index.root);
    router.get('/notification', index.notification);
    new AuthRoute(router);
    new UserRoute(router);
    new AccountRoute(router);
    new TransactionRoute(router);

}