exports.getSignup = (req, res, next) => {
    
    res.json({msg: 'Signup'});
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    console.log(email);
    res.json({msg: email});
}
