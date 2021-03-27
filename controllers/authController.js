const passport = require('passport');
const {request} = require('express');
const { Usuarios } = require('../models');
const crypto = require('crypto');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const { enviarCorreo } = require('../handlers/email');

const autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Ambos campos son obligatorios'
})

const usuarioAutenticado = (req = request, res, next) => {
  // Si el usuario está autenticado, adelante
  if(req.isAuthenticated()){
    return next();
  }

  
  // Sino, redirigir.
  return res.redirect('/iniciar-sesion');


}

const cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/iniciar-sesion');
  })
}

const enviarTokenGenerarPassword = async(req, res) => {
  // Verificar que el usuario existe
  const usuario = await Usuarios.findOne({where: {email: req.body.email}})

  if(!usuario){
    req.flash('error', 'No existe ese usuario')
    res.redirect('/reestablecer')
  }


  usuario.token = crypto.randomBytes(20).toString('hex');
  usuario.expiracion = Date.now()+3600000;

  await usuario.save();

  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  // Enviar correo
  await enviarCorreo({
    usuario,
    subject: 'Password Reset',
    resetUrl,
    archivo: 'reestablecerPassword'
  })
  req.flash('correcto', 'Se envió un mensaje a tu correo');
  res.redirect('/iniciar-sesion');
}

const resetPassword = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: { token: req.params.token }
  })

  if(!usuario){
    req.flash('error', 'No valido')
    res.redirect('/reestablecer')
  }

  // Formulario para generar password.
  res.render('resetPassword',{
    title: 'Reestablecer contraseña'
  })
}

const actualizarPassword = async( req, res ) => {
  // Verifica token y fecha de expiración
  const usuario = await Usuarios.findOne({
    whre: {
      token: req.params.token,
      expiracion: {
        [Op.gte]: Date.now()
      }
    }
  })
  if(!usuario){
    req.flash('error', 'No valido');
    res.redirect('/reestablecer');
  }
  // Hashear el nuevo password.
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;

  usuario.save();

  req.flash('correcto', 'Tu contraseña se ha cambiado con exito.')
  res.redirect('/iniciar-sesion');
}
module.exports =  {
  autenticarUsuario,
  usuarioAutenticado,
  cerrarSesion,
  enviarTokenGenerarPassword,
  resetPassword,
  actualizarPassword
}

