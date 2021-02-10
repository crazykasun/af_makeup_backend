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
    console.log(id);
    User.findById(id).populate('pack.pack').exec((err, user) => {
        if (err || !user) {
            res.status(400).json({
                error: 'User not found!'
            });
        }

        console.log(user);
        req.profile = user;
        next();
    });
};

//method to update users using requests
exports.updateUserDetails = (req, res) => {
    let updateSet = {$set: {}, $addToSet: {}};

    if (req.body.name != null) {
        updateSet.$set.name = req.body.name
    }
    if (req.body.phone != null) {
        updateSet.$set.phone = req.body.phone
    }
    if (req.body.email != null) {
        updateSet.$set.email = req.body.email
    }
    if (req.body.nic != null) {
        updateSet.$set.nic = req.body.nic
    }
    if (req.body.pack != null) {
        const packs =  {
            "pack" : req.body.pack.pack,
            "total" : req.body.pack.total
        };
        updateSet.$addToSet.pack = packs
    }

    console.log('Hi')
    console.log(req.body.pack.pack)

    //update user doc using user id
    User.findOneAndUpdate({_id: req.profile._id}, updateSet, {new: true}, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: 'Unauthorized Action!'
            })
        }

        user.hashed_password = undefined;
        user.salt = undefined;

        res.json(user);
    });
};

//function read user details
exports.getUserDetails = (req, res) => {
    console.log(req.profile);
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;

    return res.json(req.profile);   //get entire profile
};

exports.requiredSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

