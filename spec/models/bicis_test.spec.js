var Bicicleta = require('../../models/bicicleta');
beforeEach(()=>{
    Bicicleta.allBicis = [];
})
describe('Bicicleta.allbicics', ()=>{
    it('comienza vacia', ()=>{
        expect(Bicicleta.allBicis.length).toBe(0)
    });
});

describe('Bicicletas.add', ()=>{
    it('agregando una', () =>{
        expect(Bicicleta.allBicis.length).toBe(0)
        
        var a = new Bicicleta(1, 'rojo', 'urbana', [-58.3861497, -34.6012424]);
        Bicicleta.add(a)

        expect(Bicicleta.allBicis.length).toBe(1)
        expect(Bicicleta.allBicis[0]).toBe(a)

    })
})

describe('Bicicletas.fundById', ()=>{
    it('debe devolver la bici con id 1', ()=>{
        expect(Bicicleta.allBicis.length).toBe(0)
        var aBici = new Bicicleta(1, 'verde', 'urbana');
        var abici2 = new Bicicleta(2, 'rojo', 'montaña');
        Bicicleta.add(aBici);
        Bicicleta.add(abici2);

        var targetBici = Bicicleta.findById(1)

        expect(targetBici.id).toBe(1)
        expect(targetBici.color).toBe(aBici.color)
        expect(targetBici.modelo).toBe(aBici.modelo)
    })
})