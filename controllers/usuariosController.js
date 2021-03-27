const {Usuarios} = require('../models');
const { enviarCorreo } = require('../handlers/email')

const formCrearCuenta = (req, res) => {
  res.render('crearCuenta', {
    title: 'Crear cuenta en UpTask'
  })
}
const formIniciarSesion = (req, res) => {
  const { error } = res.locals.mensajes;
  res.render('iniciarSesion', {
    title: 'Iniciar Sesion en UpTask',
    error
  })
}

const crearCuenta = async (req, res) => {
  const { email, password } = req.body;
  try {
    await Usuarios.create({email, password});
    // Crear URL para confirmar
    const confirmUrl = `http://${req.headers.host}/confirmar/${email}`
    // Crear el objeto de usuario
    const usuario = {
      email
    }
    // Enviar email
    await enviarCorreo({
      usuario,
      subject: 'Confirmar correo',
      confirmUrl,
      archivo: 'confirmarCuenta'
    })
    // Redirigir
    req.flash('correcto', 'Enviamos un correo, confirma tu cuenta.')
    res.redirect('/iniciar-sesion');
  } catch (error) {
    req.flash('error', error.errors.map(error => error.message));
    res.render('crearCuenta', {
      mensajes: req.flash(),
      title: 'Crear cuenta en UpTask',
      email,
      password
    })
  }
}

const reestablecerContrasena = (req, res) => {
  res.render('reestablecerContrasena', {
    title: 'Reestablecer tu contraseña'
  })
}

const confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: { email:  req.params.email }
  })

  if(!usuario){
    req.flash('error', 'No valido');
    res.redirect('/crear-cuenta');
  }

  usuario.activo = 1;
  await usuario.save();
  req.flash('correcto','Cuenta creada correctamente');
  res.redirect('/iniciar-sesion');
}

module.exports = {
  formCrearCuenta,
  crearCuenta,
  formIniciarSesion,
  reestablecerContrasena,
  confirmarCuenta
}