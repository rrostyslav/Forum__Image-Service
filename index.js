'use strict';
const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const dbPool = require('./middleware/dbConnectionPool');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const IndexRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(bodyparser.json());
app.use(morgan('dev'));
app.use(dbPool);

app.use('/', IndexRoutes);

app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')))

app.use((error, req, res, next) => {
  res.status(200).json({
    success: false,
    code: error.status,
    message: error.message
  });
})

app.listen(PORT, () => {
  console.log('Microservice: Image-Upload. Running on port:', PORT)
})