var express = require('express')
var app = express()
var path = require('path')
var http = require('http').Server(app)
var io = require('socket.io')(http)
var Controllers = require('./controllers')

var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

var session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const sessionStore = new MongoStore({
    url: "mongodb://122.152.219.175/technode"
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(session({
    name: "technode",
    secret: 'technode',
    resave: true,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 60 * 1000*10
    }
}))

var port = process.env.PORT || 3000
var messages = []


app.use(express.static(path.join(__dirname, '/static')))
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './static/index.html'))
})


app.post('/api/login', function (req, res) {
    var email = req.body.email
    if (email) {
        Controllers.User.findByEmailOrCreate(email, function (err, user) {
            if (err) {
                res.json(500, { msg: err })
            } else {
                req.session._userId = user._id
                res.json(user)
            }
        })
    } else {
        res.json(403)
    }
})

app.get('/api/logout', function (req, res) {
    Controllers.User.offline(req.session._userId,function (err,user) {
        if(err){
            res.json(500, { msg: err })
        }else{
            req.session._userId = null
            delete req.session._userId
            res.redirect('/')
        }

    })
})

app.get('/api/validate', function (req, res) {
    var _userId = req.session._userId
    if (_userId) {
        Controllers.User.findUserById(_userId, function (err, user) {
            if (err) {
                res.json(401, { msg: err })
            } else {
                Controllers.User.online(_userId,function (err,_user) {
                    if(err){
                        res.json(500,{msg:err})
                    }else{
                        res.json(_user)
                    }
                })
            }
        })
        
    } else {
        res.json(401, null)
    }
})


io.use(function (socket, next) {
    var handshakeData = socket.request;
    var signedCookieParser = cookieParser('technode');//输入签名，返回以此签名解析的函数
    signedCookieParser(handshakeData, null, function (err) {
        if (err) {
            next(err)
        } else {
            sessionStore.get(handshakeData.signedCookies['technode'], function (err, session) {
                if (err) throw err
                handshakeData.session = session
                next()
            })
        }
    })
})
io.on('connection', function (socket) {
    if (socket.request.session){
        var _userId = socket.request.session._userId
        Controllers.User.online(_userId, function (err, user) {
            if (err) {
                socket.emit('err', { msg: err })
            } else {
                socket.broadcast.emit('online', user)
            }
        })
    }
    
    socket.on('getRoom',function () {
         function getOnline() {
            return new Promise((resolve, reject) => {
                Controllers.User.getOnlinesUsers(function (err, users) {
                    if (err) {
                        socket.emit('err', { msg: err })
                    } else {
                        resolve(users)
                    }
                })
            })
        }
         function read() {
            return new Promise((resolve, reject) => {
                Controllers.Message.read(function (err, data) {
                    if (err) {
                        socket.emit('err', err)
                    } else {
                        resolve(data)
                    }
                })
            })
        }
        async function done() {
            let users = await getOnline()
            let msg = await read()
            console.log(msg);
            
            socket.emit('roomData',{
                users:users,
                messages:msg
            })
        }
        done()
    })
    socket.on('getAllMessages', function () { 
        socket.emit('allMessages', messages)
    })
    socket.on('createMessage', function (message) {
        Controllers.Message.create(message,function (err,message) {
            if(err){
                socket.emit('err',{
                    msg:err
                })
            }else{
                io.emit('messageAdded', message)
            }
        })
    })
})
io.on('disconnect',function () {
    Controllers.User.offline(_userId,function (err,user) {
        if(err){
            socket.emit('err',{
                msg:err
            })
        }else{
            socket.broadcast.emit('offline',user)
        }
    })
})


http.listen(port, function () {
    console.log('technode is on port' + port + '!');

})