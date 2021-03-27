// Se debe crear el express Router

const { Router } = require('express');
const { proyectosHome, Nosotros, formularioProyecto, nuevoProyecto, proyectoPorUrl, formularioEditar, editarProyecto, eliminarProyecto } = require('../controllers/proyectosController');
const router = Router();
const { body } = require('express-validator/check');
const { agregarTarea, actualizarTareaEstado, eliminarTarea } = require('../controllers/tareasController');
const { formCrearCuenta, crearCuenta, formIniciarSesion, reestablecerContrasena, confirmarCuenta } = require('../controllers/usuariosController');
const { autenticarUsuario, usuarioAutenticado, cerrarSesion, enviarTokenGenerarPassword, resetPassword, actualizarPassword } = require('../controllers/authController');
// Importamos los controladores

router.get('/', 
  usuarioAutenticado,
  proyectosHome)


router.get('/nuevo-proyecto',
  usuarioAutenticado,
  formularioProyecto)

router.post('/nuevo-proyecto',
  usuarioAutenticado,
  body('nombre').not().isEmpty().trim().escape(),
  nuevoProyecto)

router.post('/nuevo-proyecto/:id',
  usuarioAutenticado,
  body('nombre').not().isEmpty().trim().escape(),
  editarProyecto)

router.post('/proyectos/:url', 
  usuarioAutenticado,
  agregarTarea)

router.get('/proyectos/:url', 
  usuarioAutenticado,
  proyectoPorUrl);

router.get('/proyecto/editar/:id', 
  usuarioAutenticado,
  formularioEditar);

router.delete('/proyectos/:url', 
  usuarioAutenticado,
  eliminarProyecto);

router.patch('/tareas/:id', 
  usuarioAutenticado,
  actualizarTareaEstado);

router.delete('/tareas/:id', 
  usuarioAutenticado,
  eliminarTarea);

router.get('/crear-cuenta', 
  formCrearCuenta);

router.post('/crear-cuenta', 
  crearCuenta);

router.get('/confirmar/:email', confirmarCuenta)

router.post('/iniciar-sesion', 
  autenticarUsuario);
  
router.get('/iniciar-sesion', 
  formIniciarSesion);

router.get('/cerrar-sesion', 
  cerrarSesion);

router.get('/reestablecer', 
  reestablecerContrasena);

router.post('/reestablecer', 
  enviarTokenGenerarPassword);

router.get('/reestablecer/:token', 
  resetPassword);

router.post('/reestablecer/:token', actualizarPassword)
module.exports = router;