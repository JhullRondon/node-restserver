const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');


app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files){
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No se ha selecionado ningun archivo'
      }
    })
  }



  // validar tipo
  let tiposValidos = ['productos', 'usuarios'];

  if (tiposValidos.indexOf(tipo) < 0) { 
    return res.status(400).json({
      ok: false,
      err: {
        message: 'La url no es valida'
      }
    })
  }

  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split('.');

  let extencion = nombreCortado[nombreCortado.length -1];

  // extenciones permitidas

  let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  if (extencionesValidas.indexOf(extencion) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Las extensiones validas son: ' + extencionesValidas.join(', ')
      }
    })
  }

  //cambiar el nombre del archivo
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`
  archivo.mv(`../../uploads/${tipo}/${nombreImagen}`, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (tipo === 'usuarios') {
      imagenUsuario(id, res, nombreArchivo);
    } else {
      imagenProducto(id, res, nombreArchivo);
    }
  });
});


function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    
    if (err) {
      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!usuarioDB) {
      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El usuario no existe'
        }
      });
    }

    borraArchivo(usuarioDB.img, 'usuarios');

    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err, usuarioSaved) => {
      
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        usuario: usuarioSaved,
        img: nombreArchivo
      })
    })
  });
}

function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borraArchivo(nombreArchivo, 'productos');
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoDB) {
      borraArchivo(nombreArchivo, 'productos');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El producto no existe'
        }
      });
    }

    borraArchivo(productoDB.img, 'productos');

    productoDB.img = nombreArchivo;

    productoDB.save((err, productoSaved) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      res.json({
        ok: true,
        producto: productoSaved,
        img: nombreArchivo
      })
    });
  });
}

function borraArchivo(nombreImagen, tipo) {
  let pathURL = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
  if (fs.existsSync(pathURL)) {
    fs.unlinkSync(pathURL);
  }
}


module.exports = app;