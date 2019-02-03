const Productos = require('../models/producto');
const {verificaToken} = require('../middlewares/autenticacion');
const {verificaCategoria} = require('../middlewares/checkCategoria');
const express = require('express');
const app = express();

// =======================================
// Mostrar todos los Productos por paginas
// =======================================

app.get('/productos', verificaToken, (req, res) => {
  //incluir populate
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 10;
  limite = Number(limite);

  Productos.find({disponible: true})
    .skip(desde)
    .limit(limite)
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre email')
    .exec((err, productosDB) => {
      if(err){
        return res.status(400).json({
          ok: false,
          err
        })
      }

      Productos.count({disponible: true}, (err, conteo) => {
        if(err){
          return res.status(400).json({
            ok: false,
            err
          })
        }
        res.json({
          ok: true,
          productos: productosDB,
          conteo 
        })
      })
    });

});

// =============================
// Mostrar el producto por ID
// =============================

app.get('/productos/:id', verificaToken, (req, res) => {

  let id =  req.params.id;

  Productos.findById(id, (err, productoDB) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!productoDB) {
      return res.status(401).json({
        ok: true,
        err: {
          message: 'Producto no se encuentra en la base de datos'
        }
      });
    }

    return res.json({
      ok: true,
      producto: productoDB
    });
  });
});

// =============================
// Buscar productos
// =============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

  let termino = req.params.termino;

  let regex = new RegExp(termino, 'i'); //expresion regular

  Productos.find({nombre: regex})
        .populate('categoria', 'nombre')
        .exec((err, productosDB) => {
          if(err){
            return res.status(500).json({
              ok: false,
              err
            });
          }
      
          if(!productosDB) {
            return res.status(401).json({
              ok: true,
              err: {
                message: 'no hay resultados para la busqueda'
              }
            });
          }

          res.status(200).json({
            ok: true,
            productosDB
          })
        })
});

// =============================
// Crear un producto
// =============================

app.post('/productos', [verificaToken, verificaCategoria], (req, res) => {
  let body = req.body;

  let producto = new Productos({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion:  body.descripcion,
    usuario: req.usuario._id,
    categoria: req.categoria._id
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    return res.status(201).json({
      ok: true,
      producto: productoDB
    })
  });

});

// =============================
// Actualizar un producto
// =============================

app.put('/productos/:id', [verificaToken, verificaCategoria], (req, res) => {
  let id = req.params.id;
  let update = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    precioUni: req.body.precioUni,
    categoria: req.categoria._id,
    usuario: req.usuario._id
  }
  

  Productos.findByIdAndUpdate(id, update, {new: true, runValidators: true, context: 'query'}, (err, updated) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!updated) {
      return res.status(401).json({
        ok: true,
        err: {
          message: 'Producto no se encuentra en la base de datos'
        }
      });
    }

    return res.json({
      ok: true,
      producto: updated
    })
  });
});

// =============================
// Eliminar un producto
// =============================

app.delete('/productos/:id', verificaToken, (req, res) => {
  
  let id = req.params.id;

  Productos.findByIdAndUpdate(id, {disponible: false}, {new: true, runValidators: true, context: 'query'}, (err, deleted) => {
    if(err){
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if(!deleted) {
      return res.status(401).json({
        ok: true,
        err: {
          message: 'Producto no se encuentra en la base de datos'
        }
      });
    }

    return res.json({
      ok: true,
      producto: deleted,
      message: 'producto cambiado a no disponible'
    })
  })
});


module.exports = app;