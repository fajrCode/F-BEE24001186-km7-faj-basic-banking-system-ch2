import './instrument.js';
import * as Sentry from '@sentry/node';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import logger from './logger.js';
import ErrorHandler from '../middlewares/errorHandler.js';
import apiV1 from '../routes/api/v1/index.route.js';

export const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const viewsFolder = path.resolve(__dirname, '../views');

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');
app.set('views', viewsFolder);

// API Router
apiV1(app);

app.get("/debug-sentry", function mainHandler() {
  throw new Error("Error for sentry!");
});

Sentry.setupExpressErrorHandler(app);

// Error handling 404
app.use(ErrorHandler.handle404);

// Handle other errors
app.use(ErrorHandler.handleError);
