const { Router } = require('express');
const Usuario = require('../models/Usuario'); 
const bcrypt = require('bcryptjs');
const { validationResult, check } = require('express-validator');
const {validarJWT} = require('../middleware/validar-jwt');
const {validarRolAdmin} = require('../middleware/validar-rol-admin');

const router = Router();

router.post('/', [
  check('nombre', 'invalid.nombre').not().isEmpty(),
  check('email', 'invalid.email').isEmail(),
  check('password', 'invalid.password').not().isEmpty(),
  check('rol', 'invalid.rol').isIn(['Administrador', 'Docente']),
  check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo'])

], async function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() }); 
    }

    const existeUsuario = await Usuario.findOne({ email: req.body.email }); 
    if (existeUsuario) {
      return res.status(400).send('Email ya existe');
    }

    let usuario = new Usuario(); 
    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    usuario.estado = req.body.estado;
    const salt = bcrypt.genSaltSync(); 
    const password = bcrypt.hashSync(req.body.password, salt);
    usuario.password = password;
    usuario.rol = req.body.rol;
    usuario.fechaCreacion = new Date();
    usuario.fechaActualizacion = new Date();

    // Guarda el usuario en la base de datos
    usuario = await usuario.save();

    
    res.send(usuario);

  } catch (error) {
    console.error(error);
    res.status(500).send('ocurrio un error');
  }
});

// Ruta para obtener todos los usuarios
router.get('/', [validarJWT, validarRolAdmin], async function (req, res) {
  try {
    const usuarios = await Usuario.find();
    res.send(usuarios);
  } catch (error) {
    console.log(error);
    res.status(500).send('Ocurrió un error');
  }
});


router.put('/:usuarioId', [validarJWT, validarRolAdmin], async function (req, res) { 
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({mensaje: errors.array()});
    }

    let usuario = await Usuario.findById(req.params.usuarioId);

    if(!usuario){
        return res.status(400).send('usuario no existe');
    }

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    usuario.estado = req.body.estado;
    const salt = bcrypt.genSaltSync(); 
    const password = bcrypt.hashSync(req.body.password, salt);
    usuario.password = password;
    usuario.rol = req.body.rol;
    usuario.fechaActualizacion = new Date();

    usuario = await usuario.save();

    res.send(usuario);

  } catch (error) {
    console.log(error);
    res.status(500).send('Ocurrió un error');
  }

});

router.delete('/:deleteId', [validarJWT, validarRolAdmin], async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.deleteId);

    if (!usuario) {
      return res.status(400).send('Usuario no existe');
    }

    res.send(usuario);
  } catch (error) {
    console.log(error);
    res.status(500).send('Ocurrió un error');
  }
});


module.exports = router;
