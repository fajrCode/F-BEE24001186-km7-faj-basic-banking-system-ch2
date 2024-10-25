import express from 'express';
import logger from './logger.js';
import ErrorHandler from '../middlewares/errorHandler.js';
import apiV1 from '../routes/api/v1/index.route.js';

export const app = express();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

// API Router
apiV1(app);

// error handling 404
app.use(ErrorHandler.handle404);

// Handle other error
app.use(ErrorHandler.handleError);