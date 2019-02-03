const Categoria = require('../models/categoria');

const verificaCategoria = (req, res, next) => {
  let categoria = req.body.categoria;

  Categoria.find({nombre: categoria}, (err, categoriaDB)=> {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB[0]){
      return res.status(401).json({
        ok: false,
        message: 'La categoria no existe'
      })
    } else {
      req.categoria = categoriaDB[0];
      next();
    }
  });    
};

module.exports = {
  verificaCategoria
};