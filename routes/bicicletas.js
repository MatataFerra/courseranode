const express = require('express');
var router = express.Router();
var bicicletasController = require('../controllers/bicicleta');

router.get('/', bicicletasController.bicicleta_list);

module.exports = router;