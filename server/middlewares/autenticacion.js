const jwt = require('jsonwebtoken');

// ==============
// Verifica token
// ==============
let verificaToken = (req, res, next) => {
  let token = req.get('token');

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token no valido"
        }
      });
    }

    req.usuario = decoded.usuario;  
    next();
  });
};

// ==============
// Verifica token
// ==============

let verificaAdmin = (req, res, next) => {
  const usuario = req.usuario;

  if (usuario.role !== 'ADMIN_ROLE'){
    return res.status(401).json({
      ok: false,
      err: {
        message: "El Usuario no es Administrador"
      }
    });
  }else {
    next();
  }

};


module.exports = {
  verificaToken,
  verificaAdmin
}