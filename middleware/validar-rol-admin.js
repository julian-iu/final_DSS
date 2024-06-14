const jwt = require('jsonwebtoken');

const validarRolAdmin = (req, res, next) => {

  if (req.payload.rol != 'Administrador') {
    return res.status(401).json({ mensaje: 'Error unatuthorized' });
  }
  next();

};

module.exports = {
  validarRolAdmin
};
