const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un role valido'
};

let Schema = mongoose.Schema;


let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es necesario']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo es necesario']
  },
  password: {
    type: String,
    required: [true, 'El password es obligarotio']
  },
  img: {
    type: String
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: rolesValidos
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false
  }
});
// impedir que el password se muestre en el return de la CRUD
usuarioSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

//unique validator
usuarioSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser unico'
});

// esta por mongoose lanza un error con los unique
mongoose.set('useCreateIndex', true);
module.exports = mongoose.model('usuario', usuarioSchema);