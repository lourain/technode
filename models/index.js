var mongoose = require('mongoose')

mongoose.connect('mongodb://122.152.219.175/technode',function () {
    console.log('mongo connect success!');
    
})
mongoose.on('error',function (err) {
    console.log(err);
    
})

exports.User = mongoose.model('User',require('./user.js'))