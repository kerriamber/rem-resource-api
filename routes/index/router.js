/**
 * Created by julia on 29.10.2016.
 */
var express = require('express');
var router = express.Router();
module.exports = router;
router.all('/', (req,res) => {
    res.json({error:1, message:'This is the Rem resource api.'})
});