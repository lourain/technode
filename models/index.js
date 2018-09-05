var mongoose = require('mongoose')

mongoose.createConnection('mongodb://122.152.219.175/technode', { useNewUrlParser: true },function () {
    console.log('mongo connect success!');
    
})
.on('error',function (err) {
    console.log(err);
    
})

exports.User = mongoose.model('User',require('./user.js'))