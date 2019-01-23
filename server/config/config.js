//=====================
// PUERTO
//=====================

process.env.PORT = process.env.PORT || 3000;


//======================
// Entorno
//======================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//======================
// DataBase
//======================

// let urlDB;

if (process.env.NODE_ENV === 'dev'){
urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = 'mongodb://tetsuryuuken:hinokami01@ds163014.mlab.com:63014/example';
}
process.env.URLDB = urlDB;




