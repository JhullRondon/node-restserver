//Archivo de rutas para usuarios
const Usuario = require('../models/usuario');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const mongoose = require('mongoose');

app.get('/usuario', (req, res) => {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Usuario.find({estado: true}, 'nombre email google estado role img')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }

      Usuario.count({estado: true}, (err, conteo) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err
          });
        }
        res.json({
          ok: true,
          usuarios,
          cuantos: conteo
        })
      })
    })
});
// para crear usuarios
app.post('/usuario', (req, res) => {

  let body = req.body;
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    })

  });
});

// Actualizar la informacion de usuarios
app.put('/usuario/:id', (req, res) => {
  //get the parameter in the url to make an update throught the method PUT
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

  Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'},(err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });
  });

});
app.delete('/usuario/:id', (req, res) => {

  let id =  req.params.id;
 

  Usuario.findByIdAndUpdate(id, { estado: false }, {new: true}, (err, usuarioDesact) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    if (!usuarioDesact) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        }
      });
    }

    res.json({
      ok: true,
      msg: 'Usuario Desactivado',
      usuarioDesact
    });

  });

  // Usuario.findByIdAndRemove(id, (err, usuario) => {
  //   if (err) {
  //     return res.status(400).json({
  //       ok: false,
  //       err
  //     });
  //   }

  //   if (!usuario) {
  //     return res.status(400).json({
  //       ok: false,
  //       err: {
  //         message: 'Usuario no encontrado'
  //       }
  //     });
  //   }

  //   res.json({
  //     ok: true,
  //     usuario
  //   });
  // })

});

module.exports = app;