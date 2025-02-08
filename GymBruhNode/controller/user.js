const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/user');

exports.getSignup = (req, res, next) => {
    res.json({msg: 'Signup'});
}

exports.postSignup = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const age = req.body.age;
    const weight = req.body.weight;
    const height = req.body.height;
    const goal = req.body.goal;
    
    // const user = new User({ 
    //     username: username, 
    //     email: email, 
    //     password: password, 
    //     age: age,
    //     weight: weight,
    //     height: height,
    //     goal: goal,
    // });
    const user = await User.findOne({email: email});
    user.password = await bcrypt.hash(password, 12);
    const result = await user.save();
    res.json({msg: 'Signup Success: ' + result._id + req.body.msg});
};

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({email: email});
    
    if(!user){
        const error = new Error('User not found');
        error.status = 401;
        throw error;
    }
    const password = req.body.password;
    const passwordCheck = await bcrypt.compare(password, user.password);

    if(!passwordCheck){
        const error = new Error('Incorrect Password');
        error.status = 401;
        throw error;
    }

    const token = jwt.sign({
        email: email,
        userId: user._id
    }, 
    '837reubfdmnbjhjki8fee8rndoay3', { expiresIn: '1h' });
    
    res.json({msg: 'Login Success: ' + user._id, token: token});
};

exports.getAuth = (req, res, next) => {
    res.json({msg: 'Authenticated'});
}
