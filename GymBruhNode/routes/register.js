const express = require('express');

const registerController = require('../controller/register');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

// signup GET
router.get('/signup', registerController.getSignup);

// signup POST
router.post('/signup', registerController.postSignup);

// login POST
router.post('/login', registerController.postLogin);


router.get('/test', isAuth, registerController.getAuth);

module.exports = router;
