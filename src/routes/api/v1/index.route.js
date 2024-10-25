import { Router } from 'express';
import { IndexCtrl } from '../../../controllers/index.controller.js';
import UserRoute from './user.route.js';
import AccountRoute from './account.route.js';
import TransactionRoute from './transaction.route.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../../docs/api-v1.json' assert { type: "json" };

export default (app) => {
    const router = Router();
    const index = new IndexCtrl();
    
    app.use('/api/v1', router);
    app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    
    router.get('/', index.root);

    new UserRoute(router);
    new AccountRoute(router);
    new TransactionRoute(router);

}