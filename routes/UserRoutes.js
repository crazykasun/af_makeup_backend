const express = require('express');
const router = express.Router();

const {signUp, signIn, signOut, updateUserDetails, getUserById, getUserDetails} = require('../controllers/UserController');
const {userSignUpValidator, requiredSignIn, isAdmin} = require('../validators/UserValidator');

router.post('/signup', userSignUpValidator, signUp);
router.post('/signin', signIn);
router.get('/signout', signOut);
router.post('/admin/create', isAdmin, userSignUpValidator, signUp);
router.put('/user/:userId', updateUserDetails);
router.get('/user/:userId', getUserDetails);

router.param('userId', getUserById);

module.exports = router;

