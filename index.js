const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dbPool = require('./middleware/dbConnectionPool');

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const IndexRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(dbPool);

app.use('/', IndexRoutes);

app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(PORT, () => {
    console.log('Microservice: Image-Upload. Running on port:', PORT)
})