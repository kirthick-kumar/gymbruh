const express = require('express');

const userController = require('../controller/user');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

// signup GET
router.get('/signup', userController.getSignup);

// signup POST
router.post('/signup', userController.postSignup);

// login POST
router.post('/login', userController.postLogin);

// test GET
router.get('/test', isAuth, userController.getAuth);

module.exports = router;
