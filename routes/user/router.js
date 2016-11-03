/**
 * Created by julia on 29.10.2016.
 */
var express = require('express');
var router = express.Router();
var userModel = require('../../DB/user');
var authController = require('../../controller/auth');
var authCheck = ((req, res, next) => {
    if (typeof (req.headers.authorization) !== 'undefined') {
        authController.checkAccess(req.headers.authorization, 'user', err => {
            if (err) return res.json(err);
            next();
        });
    } else {
        return res.status(403).json({error: 403, message: 'Unauthorized!'})
    }
});
router.post('/u', authCheck, (req, res) => {
    authController.addUser(req.body.access, (err, User) => {
        if (err) return res.status(500).json({error:500, message:'Internal error!'});
        res.json({error:0, user:User});
    });
});
router.put('/u', authCheck, (req, res) => {

});
router.get('/u', authCheck, (req, res) => {
    userModel.find({}, (err, Users) => {
        if (err) return res.status(500).json({error:500, message:'Internal error!'});
        res.json(Users);
    });
});
router.get('/u/:id', authCheck, (req, res) => {
    userModel.findOne({id: req.params.id}, (err, User) => {
        if (err) return res.status(500).json({error:500, message:'Internal error!'});
        if (User) {
            res.json(User);
        } else {
            res.json({error: 1, message: 'No user found!'})
        }
    })
});
module.exports = router;
