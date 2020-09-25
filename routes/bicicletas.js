const express = require('express');
var router = express.Router();
var bicicletasController = require('../controllers/bicicleta');

router.get('/', bicicletasController.bicicleta_list);
router.get('/create', bicicletasController.bicicleta_create_get);
router.post('/create', bicicletasController.bicicleta_create_post);
router.get('/:id/update', bicicletasController.bicicleta_update_get);
router.post('/:id/update', bicicletasController.bicicleta_update_post);
router.post('/:id/delete', bicicletasController.bicicleta_delete_post);

module.exports = router;