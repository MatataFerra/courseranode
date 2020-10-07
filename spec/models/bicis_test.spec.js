var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');



describe('testing Bicicletas', ()=> {
    beforeEach(done=> {
        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB, {useNewUrlParser: true});

        const db = mongoose.connection;

        db.on('error', console.error.bind(console, 'Connection error'));
        db.once('open', ()=>{
            console.log('We are connected to test DB');
            done();
        })
    })
    afterEach((done)=>{
        Bicicleta.deleteMany({}, (err, success) => {
            if (err) console.log(err);
            done();
        })
    })

    describe('Bicicletas.createInstance', () => {
        it('crea una instancia de Bicicleta', ()=> {
            var bici = Bicicleta.createInstance(1, 'verde', 'urbana', [-34.5, -54.1]);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe('verde');
            expect(bici.modelo).toBe('urbana');
            expect(bici.ubicacion[0]).toEqual(-34.5);
            expect(bici.ubicacion[1]).toEqual(-54.1);
        })
    })

    describe('Bicicleta.allbicics', ()=>{
        it('comienza vacia', (done)=>{
            Bicicleta.allBicis((err, bicis)=>{
                expect(bicis.length).toBe(0)
                done();
            })
        });
    });

    describe('Bicicletas.add', ()=>{
        it('agregando una', (done) =>{
            var aBici = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana'});
            Bicicleta.add(aBici, (err, newBici) => {
                if(err) console.log(err);
                Bicicleta.allBicis((err, bicis)=>{
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);

                    done();
                })
            })
        
        })
    })

    describe('Bicicleta.findByCode', ()=> {
        it('debe devolver la bici con code 1', done => {
            Bicicleta.allBicis( (err, bicis) => {
                expect(bicis.length).toBe(0);

                var aBici1 = new Bicicleta({code: 1, color: "negra", modelo: "montaña"});

                Bicicleta.add(aBici2, (err, newBici)=>{
                    if (err) console.log(err);
                    var aBici2 = new Bicicleta({code: 2, color: "verde", modelo: "urbana"});
                    Bicicleta.add(aBici2, (err, newBici) => {
                        if (err) console.log(err);
                        Bicicleta.findByCode(1, (err, targetBici) => {
                            expect(targetBici.code).toBe(aBici.code);
                            expect(targetBici.color).toBe(aBici.color);
                            expect(targetBici.modelo).toBe(aBici.modelo);
    
                            done();
                        })
                    })
                })

            })
        })
    })
})



// beforeEach(()=>{
//     Bicicleta.allBicis = [];
// })
// describe('Bicicleta.allbicics', ()=>{
//     it('comienza vacia', ()=>{
//         expect(Bicicleta.allBicis.length).toBe(0)
//     });
// });

// describe('Bicicletas.add', ()=>{
//     it('agregando una', () =>{
//         expect(Bicicleta.allBicis.length).toBe(0)
        
//         var a = new Bicicleta(1, 'rojo', 'urbana', [-58.3861497, -34.6012424]);
//         Bicicleta.add(a)

//         expect(Bicicleta.allBicis.length).toBe(1)
//         expect(Bicicleta.allBicis[0]).toBe(a)

//     })
// })

// describe('Bicicletas.fundById', ()=>{
//     it('debe devolver la bici con id 1', ()=>{
//         expect(Bicicleta.allBicis.length).toBe(0)
//         var aBici = new Bicicleta(1, 'verde', 'urbana');
//         var abici2 = new Bicicleta(2, 'rojo', 'montaña');
//         Bicicleta.add(aBici);
//         Bicicleta.add(abici2);

//         var targetBici = Bicicleta.findById(1)

//         expect(targetBici.id).toBe(1)
//         expect(targetBici.color).toBe(aBici.color)
//         expect(targetBici.modelo).toBe(aBici.modelo)
//     })
// })