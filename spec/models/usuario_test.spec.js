//minuto 26:53

var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta')
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');

describe('Testing Usuarios', () => {
    beforeEach(done => {
        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB, {useNewUrlParser: true});

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', ()=> {
            console.log('We are connected to test database');

            done();
        })
    });

    afterEach( done => {
        Reserva.deleteMany({}, (err, success) => {
            if (err) console.log(err);

            Usuario.deleteMany({}, (err, success) => {
                if (err) console.log(err);
                Bicicleta.deleteMany({}, (err, success)=> {
                    if (err) console.log(err);
                    done();
                })
            })
        })
    })

    describe('Cuando un usuario reserva una bici', () => {
        it ('desde existir la reserva', done => {
            const usuario = new Usuario ({nombre: 'Mati'});
            usuario.save();
            const bici = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana'})
            bici.save();

            var hoy = new Date();
            var mañana = new Date();

            mañana.setDate(hoy.getDate() + 1);
            usuario.reservar(bici.id, hoy, mañana, (err, reserva) => {
                Reserva.find({}).populate('bicicleta').populate('usuario').exec((err, reservas) => {
                    console.log(reservas[0]);
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bici.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done()
                })
            })
        })
    })
})