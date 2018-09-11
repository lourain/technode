var db = require('../models')
var gravatar = require('gravatar')

exports.findUserById = function (_userId, callback) {
    db.User.findById({
        _id: _userId
    }, callback)
}

exports.findByEmailOrCreate = function (email, callback) {
    db.User.findOne({ email: email }, function (err, user) {
        if (err) {
            throw err
        }
        if (user) {
            callback(null, user)
        } else {
        
            var obj = {
                name: email.split('@')[0],
                email: email,
                avatarUrl: gravatar.url(email),
            }
            user = new db.User(obj)
            user.save(callback)
        }
    })
}