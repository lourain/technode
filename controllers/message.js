var db = require('../models')

exports.create = function (msg,callback) {
   var message = new db.Message()
   message.content =  msg.message,
   message.creator = msg.creator,
   message.save(callback)
}

exports.read = function (callback) {
    db.Message.find({})
                .sort({createAt:-1})
                .limit(20)
                .exec(callback)
}