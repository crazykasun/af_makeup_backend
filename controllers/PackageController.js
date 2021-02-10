const Package = require('../models/Package');
const formidable = require('formidable');
const fs = require('fs');

// Create Product
exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }

        // Check for all the variables
        const {name, description, price, quantity} = fields;

        // Validating the variables
        if(!name || !description || !price || !quantity){
            return res.status(400).json({
                error: "Complete all fields!"
            });
        }

        let pack = new Package(fields);

        // Image validation
        if(files.image){
            if(files.image.size > 5000000){
                return res.status(400).json({
                    error: "Image size is too large. Upload an image < 5MB"
                });
            }
            pack.image.data = fs.readFileSync(files.image.path);
            pack.image.contentType = files.image.type;
        }

        pack.save((err, success) => {
            if(err){
                return res.status(400).json({
                    error: "Something went wrong"
                });
            }

            res.json(success);
        });
    });
};

exports.getImage = (req, res, next) => {
    if(req.pack.image.data){
        res.set('Content-Type', req.pack.image.contentType);
        return res.send(req.pack.image.data);
    }

    next();
};

exports.getPackageById = (req, res, next, id) => {
    Package.findById(id).exec((err, pack) => {
        if(err || !pack){
            return res.status(400).json({
                error: "Package could not be found"
            });
        }

        req.pack = pack;
        next();
    });
};

exports.getAllPackages = (req, res) => {
    let orderBy = req.query.orderBy ? req.query.orderBy:'ASC';
    let sortBy = req.query.sortBy ? req.query.sortBy:'_id';

    Package.find()
        .select("-image")
        .sort([[sortBy, orderBy]])
        .exec((err, data) => {
            if(err){
                res.status(400).json({
                    error: 'Packages not found!'
                });
            }

            res.json(data);
        });
};

exports.read = (req, res) => {
    req.pack.image = undefined;
    return res.json(req.pack);
};

exports.updatePackage = (req, res) => {
    Package.findOneAndUpdate({_id: req.pack._id}, { $set: {quantity: req.body.quantity}}, {upsert: false}, (err, user) => {
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
