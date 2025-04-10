const paymentController = require('../controller/stripe');


app.post('/create-checkout-session', paymentController.postPayment);
