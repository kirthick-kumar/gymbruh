const express = require('express');

const userController = require('../controller/user');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

// signup GET
router.get('/profile', isAuth, userController.getProfile);


module.exports = router;
