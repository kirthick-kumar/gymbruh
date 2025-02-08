const express = require('express');

const userController = require('../controller/user');

const router = express.Router();

router.get('/signup', userController.getSignup);

module.exports = router;
