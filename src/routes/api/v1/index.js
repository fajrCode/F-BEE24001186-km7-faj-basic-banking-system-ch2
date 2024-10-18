import { Router } from 'express';
import { IndexCtrl } from '../../../controllers/index.controller.js';
import UserRoute from './user.route.js';

export default (app) => {
    const router = Router();
    const index = new IndexCtrl();

    app.use('/api/v1', router);
    
    router.get('/', index.root);

    new UserRoute(router);

}