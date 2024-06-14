const { Router } = require('express');
const Marca = require('../models/Marca'); 
const { validationResult, check } = require('express-validator');
const {validarJWT} = require('../middleware/validar-jwt');
const {validarRolAdmin} = require('../middleware/validar-rol-admin');

const router = Router();

router.post('/',[validarJWT, validarRolAdmin], [
  check('nombre', 'invalid.nombre').not().isEmpty(),
  check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo'])

], async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errores: errors.array()});   }
  
    let marca = new Marca(); 
    marca.nombre = req.body.nombre;
    marca.estado = req.body.estado;
    marca.fechaCreacion = new Date();
    marca.fechaActualizacion = new Date();

    // Guarda el marca en la base de datos
    marca = await marca.save();

    res.send(marca);

  } catch (error) {
    console.error(error);
    res.status(500).send('ocurrio un error');
  }
});

// Ruta para obtener todos los marcas
router.get('/', [validarJWT, validarRolAdmin], async function (req, res) {
  try {
    const marcas = await Marca.find();
    res.send(marcas);
  } catch (error) {
    console.log(error);
    res.status(500).send('Ocurrió un error');
  }
});

router.put('/:marcaId', [validarJWT, validarRolAdmin], async function (req, res) { 
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({mensaje: errors.array()});
    }

    let marca = await Marca.findById(req.params.marcaId);
    if(!marca){
        return res.status(400).send('Marca no existe');
    }

    marca.nombre = req.body.nombre;
    marca.estado = req.body.estado;
    marca.fechaActualizacion = new Date();

    marca = await marca.save();

    res.send(marca);

  } catch (error) {
    console.log(error);
    res.status(500).send('Ocurrió un error');
  }

});

router.delete('/:deleteId', [validarJWT, validarRolAdmin], async (req, res) => {
  try {
    const marca = await Marca.findByIdAndDelete(req.params.deleteId);

    if (!marca) {
      return res.status(400).send('marca no existe');
    }

    res.send(marca);
  } catch (error) {
    console.log(error);
    res.status(500).send('Ocurrió un error');
  }
});


module.exports = router;
