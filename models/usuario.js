var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
var Reserva = require('./reserva');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const saltRounds = 10;

const Token = require('../models/token');
const mailer = require('../mailer/mailer')

var Schema = mongoose.Schema;

const validateEmail = email => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}

var usuarioSchema = new Schema ({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Por favor ingrese un email válido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} ya existe con otro usuario'})

usuarioSchema.methods.validPassword = password => {
    return bcrypt.compareSync(password, this.password);
}

usuarioSchema.pre('save', next => {
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }

    next();
})

usuarioSchema.methods.reservar = (biciId, desde, hasta, cb) => {
    var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta});
    console.log(reserva);
    reserva.save(cb)
}

usuarioSchema.methods.enviar_email_bienvenida = cb =>{
    const token  = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')})
    const email_destination = this.email;
    token.save( err =>{
        if(err) { return console.log(err.message); }

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Verificacion de cuenta',
            text: 'Hola, \n\n' + 'Por favor para verificar tu cuenta hacé click en el enlace: \n' + 'http://localhost:5000' + '\/token/confirmation' + token.token + '.\n'
        };

        mailer.sendMail(mailOptions, err => {
            if(err) { return console.log(err.message); }

            console.log('a verification email has benn sent to ' + email_destination)
        })
    })
}

usuarioSchema.methods.resetPassword = (cb) => { 
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')})
    const email_destination = this.email;
    token.save(err=>{
        if(err){return cb(err); }

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Reseteo de password de cuenta',
            text: 'Hola \n\n ' + 'Por favor, para resetear el password de su cuenta haga click en este link: \n' + 'http://localhost:5000' + '\/resetPassword\/' + token.token + '.\n'
        }

        mailer.sendMail(mailOptions, err=>{
            if(err) { return cb(err);}

            console.log('Se envío un email para resetear el password a: ' + email_destination + '.');

        });

        cb(err);
    });
};

module.exports = mongoose.model('Usuario', usuarioSchema);