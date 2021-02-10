const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signUp = (req, res) => {
    console.log('Body', req.body);
    const user = new User(req.body);

    user.save((error, user) => {
        if (error) {
            return res.status(400).json({
                error: "Email already exists"
            })
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        return res.status(200).json({
            user, error: false
        })
    })
};

exports.signIn = (req, res) => {
    const {email, password} = req.body;
    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User does not exist'
            })
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and Password doesn't match"
            })
        }

        const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET);
        res.cookie('t', token, {expire: new Date() + 9999});

        const {_id, name, email, role} = user;
        return res.json({token, user: {_id, name, email, role}});
    })
};

exports.signOut = (req, res) => {
    res.clearCookie('t');
    res.json({message: "Signed Out"});
};

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            res.status(400).json({
                error: 'User not found!'
            });
        }

        req.profile = user;
        next();
    });
};

exports.requiredSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

