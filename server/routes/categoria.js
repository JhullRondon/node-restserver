const Categoria = require('../models/categoria');
const express = require('express');
const app = express();

const {verificaToken, verificaAdmin} = require('../middlewares/autenticacion');

// =============================
// Mostrar todas las categorias
// =============================
app.get('/categoria', verificaToken, (req, res)=> {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 10;
  limite = Number(limite);


  // mostrar todas las categorias
  Categoria.find({})
      .skip(desde)
      .limit(limite)
      .populate('usuario', 'nombre email')
      .exec((err, categorias) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err
          });
        }

        Categoria.count({}, (err, conteo) => {
          if (err) {
            return res.status(400).json({
              ok: false,
              err
            });
          }

          res.json({
            ok: true,
            categorias,
            cuantos: conteo
          })
        })
    });
});

// =============================
// Mostrar una categoria por ID
// =============================
app.get('/categoria/:id', verificaToken,(req, res) => {
  // Categoria.findByID()
  const id = req.params.id;

  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (!categoriaDB){
      res.json({
        ok: false,
        err: {
          message: 'No se pudo encontrar la categoria'
        }
      })
    }else {
      res.json({
        ok: true,
        categoria: categoriaDB
      })
    }
  });

});

// =============================
// Crear una nueva categoria
// =============================
app.post('/categoria', verificaToken, (req, res) => {
  // regresa una nuerva categoria
  // req.usuario._id
  let body = req.body;
  let usuario = req.usuario._id;
  let categoria = new Categoria({
    nombre: body.nombre,
    usuario
    });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    })
  });
});


// =============================
// Actualizar una nueva categoria
// =============================
app.put('/categoria/:id', verificaToken, (req, res) => {
  // regresa una nuerva categoria
  // req.usuario._id

  let id = req.params.id;

  let update = {
    nombre: req.body.nombre,
    usuarioId: req.usuario._id
  };

  Categoria.findByIdAndUpdate(id, update, {new: true, runValidators: true, context: 'query'}, (err, categoriaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (!categoriaDB){
      return res.status(401).json({
        ok: false,
        err: {
          message: 'No se pudo encontrar la categoria'
        }
      })
    }else {
      res.json({
        ok: true,
        categoria: categoriaDB
      })
    }
  });

});

app.delete('/categoria/:id', [verificaToken, verificaAdmin], (req, res) => {
  //solo pueden borrar los ADMIN_ROLE
  //Categoria.findByIdAndRemove()

  let id = req.params.id;

  Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Categoria no encontrada'
        }
      });
    }

    res.json({
      ok:true,
      message: 'Categoria Eliminada',
      categoriaDB
    });
  });
});



module.exports = app;
