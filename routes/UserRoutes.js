const express = require('express');
const router = express.Router();

const {signUp, signIn, signOut} = require('../controllers/UserController');
const {userSignUpValidator, requiredSignIn, isAdmin} = require('../validators/UserValidator');

router.post('/signup', userSignUpValidator, signUp);
router.post('/signin', signIn);
router.get('/signout', signOut);
router.post('/admin/create', isAdmin, userSignUpValidator, signUp);

module.exports = router;

