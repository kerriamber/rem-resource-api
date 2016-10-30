/**
 * Created by julia on 29.10.2016.
 */
var userModel = require('../DB/user');
var shortid = require("shortid");
var rtoken = require('rand-token');
var checkAccess = ((token, name, cb) => {
    userModel.findOne({token: token}, (err, User) => {
        if (err) return cb(err);
        if (User) {
            if (User.enabled) {
                for (var i = 0; i < User.access.length; i++) {
                    if (User.access[i] === name) {
                        return cb(null, User);
                    }
                }
                return cb({error: 2, message: 'No access to this feature!'});
            } else {
                return cb({error: 3, message: 'This user is disabled!'});
            }
        } else {
            return cb({error: 1, message: 'Unauthorized!'});
        }
    })
});
var addUser = ((access, cb) => {
    var User = new userModel({
        id: shortid.generate(),
        token: rtoken.generate(20),
        access: access,
        enabled: true
    });
    User.save(err => {
        if (err) return cb(err);
        cb(null, User);
    });
});
var disableUser = ((id, cb) => {
    userModel.findOne({id: id}, (err, User) => {
        if (err) return cb(err);
        if (User) {
            User.disable(cb);
        } else {
            return cb({error: 1, message: 'No user found'});
        }
    })
});
module.exports = {checkAccess: checkAccess, addUser: addUser, disableUser: disableUser};