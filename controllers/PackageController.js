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
