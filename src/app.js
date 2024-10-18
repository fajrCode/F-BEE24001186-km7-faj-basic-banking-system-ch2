import express from 'express';
import ResponseHandler from './utils/response.js';

const response = new ResponseHandler();
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

// Root route
app.get('/', (req, res) => {
    return response.res200('Binar x Fajri API v1 Ready to use (❁´◡`❁) Happy Coding!', null, res);
});

// error handling 404
app.use((req, res) => {
    return response.res404(res);
});