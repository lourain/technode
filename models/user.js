var mongoose = require('mongoose')
var Schema = mongoose.Schema
var User = new Schema({
    email:String,
    name:String,
    online:Boolean,
    avatarUrl:String
})


module.exports = User