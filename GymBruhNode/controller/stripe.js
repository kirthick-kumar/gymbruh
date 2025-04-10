const stripe = require('stripe')('sk_test_51QmyNVKGWa2x1KB4pXbkCIqTq5kN9QNoDCwbqPU4makgTFusipUWyQdzBy08AMnO34KeEaA0C7g8MtjafqnyvT4400CTnnc2Xw');

exports.postPayment = async (req, res, next) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [{
            price: 'price_1RCCrpKGWa2x1KB4DmheWBCc',
            quantity: 1,
        }],
        success_url: 'http://localhost:8081/success',
        cancel_url: 'http://localhost:8081/cancel',
      });
  
      res.json({ sessionId: session.id });
    } 
    catch (error) {
        next(error);
    }
}