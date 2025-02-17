const User = require('../model/user');

exports.getProfile = async (req, res, next) => {
    const user = await User.findById(req.userId);
    if(!user){
        const error = new Error('User not found');
        error.status = 401;
        throw error;
    }
    res.json({user: user, msg: 'Fetched Profile'});
}