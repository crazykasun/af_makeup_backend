const express = require('express');
const router = express.Router();

const {create} = require('../controllers/PackageController');
const { getUserById } = require("../controllers/UserController");
const {isAdmin1} = require('../validators/UserValidator');

router.post("/package/create/:userId", isAdmin1, create);

router.param("userId", getUserById);

module.exports = router;
