import express from 'express';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to the root route',
        data: null
    })
});

// error handling 404
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: '404 Not Found',
        data: null
    })
});