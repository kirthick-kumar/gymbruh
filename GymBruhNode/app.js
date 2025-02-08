const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

const MONGODB_URI = 'mongodb+srv://node:mongo@cluster0.hzv32.mongodb.net/gym?retryWrites=true&w=majority&appName=Cluster0'

const app = express();

app.use(bodyParser.json());

app.use(userRoutes);

app.use((req, res, next) => {
    // * ALL | site1.com, site2.com... FOR SPECIFIC SITES
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(8080);
    })
    .catch(err => console.log(err));
