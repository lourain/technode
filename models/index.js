var mongoose = require('mongoose')

mongoose.connect('mongodb://122.152.219.175/technode', { useNewUrlParser: true },function () {
    console.log('mongo connect success!');
    
})


exports.User = mongoose.model('User',require('./user.js'))