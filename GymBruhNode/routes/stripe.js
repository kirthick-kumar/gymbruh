const { Router } = require('express');
const paymentController = require('../controller/stripe');

const router = Router();

router.post('/pay', paymentController.postPayment);

module.exports = router;
