require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('./config/passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const jwt = require('jsonwebtoken');
require('newrelic');

//PassWord Mongo JD4OMXjPTAf6FqoV

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bicicletasRouter = require('./routes/bicicletas');
var bicicletasAPIRouter = require('./routes/api/bicicletas');
var usuariosAPIRouter = require('./routes/api/usuarios');
var tokenRouter = require('./routes/token');
var usuariosRouter = require('./routes/users')

const authAPIRouter = require('./routes/api/auth')

var mongoose = require('mongoose');
const Usuario = require('./models/usuario');
const Token = require('./models/token')
const { token } = require('morgan');
const authControllerAPI = require('./controllers/api/authControllerAPI');
const { assert } = require('console');
//var mongoDB = 'mongodb+srv://admin:JD4OMXjPTAf6FqoV@red-bicicletas.2ew8p.mongodb.net/red-bicicletas?retryWrites=true&w=majority';
var mongoDB = process.env.MONGO_URI
mongoose.connect(mongoDB, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

//const store = new session.MemoryStore;

let store;
if(process.env.NODE_ENV === 'development') {
  store = new session.MemoryStore;
} else {
  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'session'
  });
  store.on('error', (error)=>{
    assert.ifError(error);
    assert.ok(false)
  })
}

var app = express();
app.set('secretKey', 'jwt_pwd_!!223344');

app.use(session({
  cookie: {maxAge: 240 * 60 * 60 * 1000},
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'red_bicicletas_!!!%&/&____234234'
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res)=>{
  res.render('session/login')
})

app.post('/login', (req, res, next)=> {
  passport.authenticate('local', (err, user, info)=>{
    if(err) return next(err);
    if(!usuario) return res.render('session/login', {info});
    req.logIn(usuario, err =>{
      if(err) return next(err);
      return res.redirect('/');
    });
  }) (req, res, next);
})

app.get('/logout', (req, res)=>{
  req.logOut()
  res.redirect('/')
})

app.get('/forgotPassword', (req, res)=>{
  res.render('session/forgotPassword')
})

app.post('/forgotPassword', (req, res)=>{
  Usuario.findOne({email: req.body.email}, (err, usuario)=>{
    if(!usuario) return res.render('session/forgotPassword', {info: {message: 'No existe el email para el usuario existente'}});
    
    usuario.resetPassword(err=>{
      if(err) return next(err);
      console.log('session/forgotPasswordMessage');
    })
    res.render('session/forgotPasswordMessage')
  })
})

app.get('/resetPassword/:token', (req, res, next)=>{
  Token.findOne({token: req.params.token}, (err, token)=>{
    if(!token) return res.status(400).send({type: 'not-verified', msg: 'No existe una clave así'})

    Usuario.findById(token._userId, (err, usuario)=>{
      if(!usuario) return res.status(400).send({msg: 'No existe un usuario asociado a este password'});
      res.render('session/resetPassword', {errors: {}, usuario: usuario})
    })
  })
})

app.post('/resetPassword', (req, res)=>{
  if(req.body.password != req.body.confirm_password) {
    res.render('session/resetPassword', {errors: {confirm_password: {message: 'No coinciden las contraseñas'}},
    usuario: new Usuario({email: req.body.email})});
    return;
  }
  Usuario.findOne({email: req.body.email}, (err, usuario)=>{
    usuario.password = req.body.password;
    usuario.save(err=>{
      if(err){
        res.render('session/resetPassword', {errors: err.errors, usuario: new Usuario({email: req.body.email})});
      } else {
        res.redirect('/login')
      }
    })
  })
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bicicletas', loggedIn, bicicletasRouter);
app.use('/api/bicicletas', validarUsuario ,bicicletasAPIRouter);
app.use('/api/usuarios', usuariosAPIRouter);
app.use('/token', tokenRouter);
app.use('/usuarios', usuariosRouter);

app.use('/api/auth', authAPIRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function loggedIn(req, res, next){
  if(req.user){
    next()
  } else {
    console.log('user sin loguearse');
    res.redirect('/login')
  }
}

function validarUsuario(req, res, next){
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), (err, decoded)=>{
    if (err) {
      res.json({status: 'error', message: err.message, data:null});

    } else {
      req.body.userId = decoded.id;

      console.log('jwt verify: ' + decoded);

      next();
    }
  })
}

module.exports = app;
