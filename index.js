const express = require('express');
const routes = require('./routes');
const path = require('path')
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');
require('dotenv').config({path: '.env'});

// Helpers con funciones
const helpers = require('./helpers');

// Crear la conexion a la BD
const db = require('./config/db');

// Importando todos los modelos
require('./models');

// Define todos los modelos en la bd
db.sync()
  .then( () => console.log('Contectado a la BD'))
  .catch(error => console.log);

// Crear app de express
const app = express();

// Donde cargar los archivos estáticos
/**
 * Express necesita saber dónde están los archivos estáticos
 * Fotos, videos, css, js, etc...
 */
app.use(express.static('public'))

 // Habilitar pug
app.set('view engine', 'pug')

// Body parser para leer datos
app.use(bodyParser.urlencoded({extended: true}))



// Añadir carpeta de las vistas
app.set('views', path.join(__dirname, './views'))


app.use(flash());

app.use(cookieParser());

// Sesiones nos permite navegar entre distintas paginas sin recargar
app.use(session({
  secret: 'supersecreto',
  resav: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Pasar vardump
app.use((req, res, next) => {
  res.locals.usuario = {...req.user};
  res.locals.mensajes = req.flash();
  res.locals.vardump = helpers.vardump;
  next();
})



// Rutas
app.use('/', routes)



// Poner el servidor en el puerto
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
  console.log('El servidor está LISTO!');
})