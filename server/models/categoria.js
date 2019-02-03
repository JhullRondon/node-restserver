const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;
let CategoriaSchema = new Schema({
  nombre: {
    type: String,
    unique: true,
    required: [true, 'El nombre es necesario']
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'usuario',
    required: [true, 'Se requiere el id del usuario quien crea']
  }
});

CategoriaSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser unico'
});
mongoose.set('useCreateIndex', true);

module.exports = mongoose.model('categoria', CategoriaSchema);