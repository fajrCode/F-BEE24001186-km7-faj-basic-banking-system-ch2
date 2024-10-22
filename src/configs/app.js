import express from 'express';
import sweagerUi from 'swagger-ui-express';
import logger from './logger.js';
import ErrorHandler from '../middlewares/errorHandler.js';
import apiV1 from '../routes/api/v1/index.js';
// import openapi from '../routes/api/v1/openapi.json' assert { type: 'json' };
import swaggerConfig from './swagger.js';
import oasGenerator, {SPEC_OUTPUT_FILE_BEHAVIOR} from 'express-oas-generator';

export const app = express();
oasGenerator.init(
    app,
    function (spec) { return spec; },
    './src/docs/swagger_output.json',
    60 * 1000,

    'api-docs',
    true,
    SPEC_OUTPUT_FILE_BEHAVIOR.RECREATE
)

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/public', express.static('public'));
// app.use('/api-docs', sweagerUi.serve, sweagerUi.setup(swaggerFile));
app.set('view engine', 'ejs');

// API Router
apiV1(app);
// app.use('/api/v1', apiV1);
// oasGenerator.handleRequests();

// // error handling 404
// app.use(ErrorHandler.handle404);

// // Handle other error
// app.use(ErrorHandler.handleError);