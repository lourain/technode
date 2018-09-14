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
    req.session._userId = null
    res.redirect('/')
})

app.get('/api/validate', function (req, res) {
    var _userId = req.session._userId
    if (_userId) {
        Controllers.User.findUserById(_userId, function (err, user) {
            if (err) {
                res.json(401, { msg: err })
            } else {
                res.json(user)
            }
        })
    } else {
        res.json(401, null)
    }
})


var messages = []
io.use(function (socket,next) {
    var handshakeData = socket.request;
    var signedCookieParser = cookieParser('technode')
    signedCookieParser(handshakeData,null,function (err) {
        if(err){
            next(err)
        }else {
            sessionStore.get(handshakeData.signedCookies['technode'],function (err,session) {
                if(err) throw err
                handshakeData.session = session
                next()
            })
        }
    })
    next()
})
io.on('connection', function (socket) {
    
    socket.on('getAllMessages', function () {
        socket.emit('allMessages', messages)
    })
    socket.on('createMessage', function (message) {
        messages.push(message)
        io.emit('messageAdded', message)
    })
})



http.listen(port, function () {
    console.log('technode is on port' + port + '!');

})