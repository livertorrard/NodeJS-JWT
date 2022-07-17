const express = require('express');
const app = express();
const createError = require('http-errors');
const userRoute = require('./routes/user.route');
require('dotenv').config();

app.get('/', (req, res, next) => {
    res.send('Home');
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRoute);

//Error handling
app.use((req, res, next) => {
    next(createError.NotFound('This is not found'));
})

app.use((err, req, res, next) => {
    res.json({
        status: err.status || 500,
        message: err.message
    });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
})