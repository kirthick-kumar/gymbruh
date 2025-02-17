const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const registerRoutes = require('./routes/register');
const userRoutes = require('./routes/user');

const MONGODB_URI = 'mongodb+srv://node:mongo@cluster0.hzv32.mongodb.net/gym?retryWrites=true&w=majority&appName=Cluster0'

const app = express();

app.use(bodyParser.json());


app.use((req, res, next) => {
    // * ALL | site1.com, site2.com... FOR SPECIFIC SITES
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(registerRoutes);
app.use(userRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    
    res.status(error.status || 500).json({msg: error.message})
})

mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(8080);
    })
    .catch(err => console.log(err));
