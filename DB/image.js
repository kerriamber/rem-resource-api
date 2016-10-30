/**
 * Created by julia on 15.10.2016.
 */
var mongoose = require('mongoose');
var imageSchema = mongoose.Schema({
    id: String,
    name: String,
    type: String,
    filetype: String,
    path: String,
    date: {type: Date, default:Date.now()},
    originPath: String,
    nsfw:Boolean
});
var imageModel = mongoose.model('Image', imageSchema);
module.exports = imageModel;