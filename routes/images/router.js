/**
 * Created by julia on 15.10.2016.
 */
var express = require('express');
var router = express.Router();
var multer = require('multer');
var shortid = require('shortid');
var ImageModel = require('../../DB/image');
var fs = require("fs");
var winston = require('winston');
var path = require("path");
var id = "";
var authController = require('../../controller/auth');
var request = require('request');
var random = function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../images/'))
    },
    filename: function (req, file, cb) {
        id = shortid.generate();
        cb(null, id + '.' + getExt(file.originalname))
    }
});
var upload = multer({storage: storage});
module.exports = router;
function getExt(fname) {
    return fname.substr((~-fname.lastIndexOf(".") >>> 0) + 2);
}
var authCheck = ((req, res, next) => {
    if (typeof (req.headers.authorization) !== 'undefined') {
        authController.checkAccess(req.headers.authorization, 'upload', err => {
            if (err) return res.json(err);
            next();
        })
    } else {
        return res.json({error: 1, message: 'Unauthorized!'})
    }
});
router.get('/i', (req, res) => {
    res.json({error: 1, message: 'No image id supplied'})
});
router.get('/i/r', (req, res) => {
    let type = req.query.type;
    if (typeof (type) !== 'undefined' && type) {
        ImageModel.find({type: req.query.type}, (err, Images) => {
            if (err) return res.json({error: 1, message: err});
            let number = random(0, Images.length - 1);
            if (Images.length > 0) {
                let image = Images[number];
                res.json({path: `/i/${image.id}`, id: image.id})
            } else {
                res.json({error: 1, message: 'No images with that type!'});
            }
        });
    } else {
        ImageModel.find({}, (err, Images) => {
            if (err) return res.json({error: 1, message: err});
            let number = random(0, Images.length - 1);
            if (Images.length > 0) {
                let image = Images[number];
                res.json({path: `/i/${image.id}`, id: image.id})
            } else {
                res.json({error: 1, message: 'No images with that type!'});
            }
        });
    }
});
router.get('/i/:id', (req, res) => {
    ImageModel.findOne({id: req.params.id}, (err, Image) => {
        if (err) return res.json({error: 1, message: err});
        if (Image) {
            res.sendFile(Image.path);
        } else {
            res.sendFile(path.join(__dirname, '../../images/404.png'))
        }
    })
});
router.post('/i', upload.single('file'), authCheck, function (req, res, next) {
    req.connection.on('close', function (err) {

    });

    if (req.file && req.body.type) {
        var image = new ImageModel({
            id: id,
            name: req.file.originalname,
            type: req.body.type,
            filetype: req.file.mimetype,
            path: req.file.path,
            date: Date.now()
        });
        console.log(image);
        if (image.filetype === 'image/jpeg' || image.filetype === 'image/png' || image.filetype === 'image/gif') {
            image.save(function (err) {
                res.status(200).json({error: 0, id: id, path: `/i/${id}`});
            });
        } else {
            res.status(400).json({error: 1, message: 'This filetype is not allowed!'});
            fs.unlink(req.file.path, function (err) {
                if (err) {
                    return err;
                }
            });
        }
    } else {
        res.status(400).json({error: 1, message: 'No file attached/no type property!'})
    }
});
router.post('/i/url', authCheck, function (req, res, next) {
    req.connection.on('close', function (err) {

    });
    console.log(req.body);
    if (req.body.url && req.body.type) {
        let id = shortid.generate();
        let ext = getExt(req.body.url);
        request.get(req.body.url).pipe(fs.createWriteStream(path.join(__dirname, `../../images/${id}.${ext}`)));
        var image = new ImageModel({
            id: id,
            type: req.body.type,
            filetype: `image/${ext}`,
            path: path.join(__dirname, `../../images/${id}.${ext}`),
            date: Date.now()
        });
        console.log(image);
        image.save(function (err) {
            res.status(200).json({error: 0, id: id, path: `/i/${id}`});
        });
    } else {
        res.status(400).json({error: 1, message: 'No url attached/no type property!'})
    }
});