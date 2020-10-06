
var Bicicleta = require('../../models/bicicleta');
var server = require('../../bin/www')


var req = require('request');

describe('Bicicleta API', ()=>{
    describe('GET BICICLETAS /', ()=>{
        it('status 200', ()=>{
            expect(Bicicleta.allBicis.length).toBe(0);

            var a = new Bicicleta(1, 'negro', 'urbana', [-58.3861497, -34.6012424]);
            Bicicleta.add(a);

            req.get('http://localhost:5000/api/bicicletas', (error, res, body)=>{
                expect(res.statusCode).toBe(200);
            })
        })
    })

    describe('POST BICICLETAS /', ()=>{
        it('status 200', (done)=>{
            var headers = {'content-type': 'application/json'};
            var aBici = {
                "id": 10,
                "color": "rojo",
                "modelo": "urbana",
                "lat": -34,
                "lng": -54
            }
            req.post({
                headers: headers,
                url: 'http://localhost:5000/api/bicicletas/create',
                body: JSON.stringify(aBici)
            }, (err, res, body) =>{
                expect(res.statusCode).toBe(200);
                expect(Bicicleta.findById(10).color).toBe('rojo');
                done();
            })
        })
    })
})