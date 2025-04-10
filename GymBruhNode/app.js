const express = require('express');
const bodyParser = require('body-parser');

const stripeRoutes = require('./routes/stripe');

const app = express();



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use((error, req, res, next) => {
    console.log(error);
    
    res.status(error.status || 500).json({msg: error.message})
})

app.listen(8080);
