const express = require('express');
const router = express.Router();

const {signUp, signIn, signOut} = require('../controllers/UserController');
const {userSignUpValidator} = require('../validators/UserValidator');

router.post('/signup', userSignUpValidator, signUp);
router.post('/signin', signIn);
router.get('/signout', signOut);

module.exports = router;

