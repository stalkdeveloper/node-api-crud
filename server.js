const express = require('express');
const app = express();
const connect = require('./dbConnect');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./app/routes/UserRoute');
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            message: 'Invalid JSON',
            errors: { global: ['Request body contains invalid JSON'] }
        });
    }
    next(err);
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        message: 'Internal Server Error',
        errors: { global: [err.message] }
    });
});

connect();

app.listen(3000, () => {
    console.log('Server listening on port 3000...');
});
