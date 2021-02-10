const express = require('express');
const router = express.Router();

const {create, getImage, getPackageById, getAllPackages, read, updatePackage} = require('../controllers/PackageController');
const { getUserById } = require("../controllers/UserController");
const {isAdmin1} = require('../validators/UserValidator');

router.post("/package/create/:userId", isAdmin1, create);
router.get('/package/image/:packageId', getImage);
router.get('/packages', getAllPackages);
router.get("/package/:packageId", read);
router.put('/package/:packageId', updatePackage);

router.param("userId", getUserById);
router.param("packageId", getPackageById);

module.exports = router;
