/**
 * Created by julia on 15.10.2016.
 */
var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    token:String,
    id:String,
    access:[],
    enabled:Boolean
});
userSchema.methods.disable = function (cb) {
    this.model('users').update({id:this.id}, {$set:{enabled:false}}, cb);
};
var userModel = mongoose.model('users', userSchema);
module.exports = userModel;