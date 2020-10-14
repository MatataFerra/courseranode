var Usuario = require('../models/usuario');
var Token = require('../models/token');

module.exports = {
    confirmationGet: (req, res, next) => {
        Token.findOne({token: req.params.token}, (err, token)=>{
            if(!token) {return res.status(400).send({type: 'not-verified', msg: 'No está verificado'})};
            Usuario.findById(token._userId, (err, usuario)=>{
                if(!usuario) return res.status(400).send({type: 'not-verified', msg: 'No está verificado'})
                if(usuario.verificado) return res.redirect('/usuarios')
                usuario.verificado = true;
                usuario.save( err => {
                    if(err) {return res.status(500).send({msg: err.message})}
                    res.redirect('/')
                })
            })
        })
    }
}