const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token')

passport.use(new LocalStrategy(
    (email, password, done)=>{
        Usuario.findOne({email: email}, (err, usuario)=>{
            if(err) return done(err)
            if(!usuario) return done(null, false, {message: 'Email no existente o incorrecto'});
            if (!usuario.validPassword(password)) return done(null, false, {message: 'Password no existente o incorrecto'});

            return done(null, usuario)
        })
    }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST + '/auth/google/callback'
},
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile);

        Usuario.findOneCreateByGoogle(profile, (err, user)=>{
            return cb(err, user)
        })
    }

));

passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
},
    function(accessToken, refreshToken, profile, done) {
        try {
            User.findOneCreateByFacebook(profile, (err, user)=> {
                if(err) console.log('err ' + err);
                return done(err, user);
            })
        } catch (error) {
            console.log(error);
            return done(error, null);
        }
    }

));

passport.serializeUser((user, cb )=> {
    cb(null, user.id);
}); 

passport.deserializeUser((id, cb)=>{
    Usuario.findById(id, (err, usuario)=>{
        cb(err, usuario)
    });
});

module.exports = passport;