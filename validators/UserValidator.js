const expressJwt = require('express-jwt');

exports.userSignUpValidator = (req, res, next) => {
    req.check('name', 'Name is Required').notEmpty();

    req.check('email', 'Email not Valid')
        .matches(/.+\@.+\..+/)
        .withMessage('Email not Valid')
        .isLength({
            min: 4, max: 32
        });

    req.check('password', 'Password is Required').notEmpty();

    req.check('password')
        .isLength({min: 6})
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number');

    const errors = req.validationErrors();

    if (errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({
            error: firstError
        })
    }
    next();
};

exports.requiredSignIn = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});
