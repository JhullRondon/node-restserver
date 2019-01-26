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
  urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//======================
// Vencimiento del Token
//======================
// 60 segundo
// 60 minutos
// 24 horas
// 30 dias

process.env.EXP_TOKEN = 60 * 60 * 24 * 30;

//======================
// SEED de autenticacion
//======================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//======================
// Google Client ID
//======================

process.env.CLIENT_ID = process.env.CLIENT_ID || '542917453713-6ns01e9ho905k84d8k6jkdsq1gi44b4e.apps.googleusercontent.com';