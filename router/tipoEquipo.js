const { Router } = require('express');
const TipoEquipo = require('../models/TipoEquipo');
const { validationResult, check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

const router = Router();

router.post('/', [validarJWT, validarRolAdmin], [
  check('nombre', 'invalid.nombre').not().isEmpty(),
  check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo'])

], async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }


    let tipoEquipo = new TipoEquipo();
    tipoEquipo.nombre = req.body.nombre;
    tipoEquipo.estado = req.body.estado;


    tipoEquipo.fechaCreacion = new Date();
    tipoEquipo.fechaActualizacion = new Date();

    // Guarda el tipoEquipo en la base de datos
    tipoEquipo = await tipoEquipo.save();


    res.send(tipoEquipo);

  } catch (error) {
    console.error(error);
    res.status(500).send('ocurrio un error');
  }
});

// Ruta para obtener todos los tipoEquipos
router.get('/', [validarJWT, validarRolAdmin], async function (req, res) {
  try {
    const tipoEquipos = await TipoEquipo.find();
    res.send(tipoEquipos);
  } catch (error) {
    console.log(error);
    res.status(500).send('Ocurrió un error');
  }
});

router.put('/:tipoEquipoId', [validarJWT, validarRolAdmin], async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ mensaje: errors.array() });
    }

    let tipoEquipo = await tipoEquipo.findById(req.params.tipoEquipoId);

    if (!tipoEquipo) {
      return res.status(400).send('tipoEquipo no existe');
    }

    tipoEquipo.nombre = req.body.nombre;
    tipoEquipo.estado = req.body.estado;
    tipoEquipo.fechaActualizacion = new Date();

    tipoEquipo = await tipoEquipo.save();

    res.send(tipoEquipo);

  } catch (error) {
    console.log(error);
    res.status(500).send('Ocurrió un error');
  }

});

router.delete('/:deleteId', [validarJWT, validarRolAdmin], async (req, res) => {
  try {
    const tipoEquipo = await TipoEquipo.findByIdAndDelete(req.params.deleteId);

    if (!tipoEquipo) {
      return res.status(400).send('tipoEquipo no existe');
    }

    res.send(tipoEquipo);
  } catch (error) {
    console.log(error);
    res.status(500).send('Ocurrió un error');
  }
});

module.exports = router;
