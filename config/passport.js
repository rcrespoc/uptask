const passport = require('passport');
const LocalStrategy = require('passport-local');

// Referencia al modelo a donde vamos a autenticar
const { Usuarios } = require('../models');

// LocalStrategy - Login con credenciales propios.

passport.use(
  new LocalStrategy(
    //  Por default espera un usuario y password.
    // Aqui deben ir los campos que serán autenticados
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuarios.findOne({
          where: {
            email,
            activo: 1
          }
        })
        // El usuario existe pero la contraseña no es correcta
        if(!usuario.verificarPassword(password)){
          return done(null, false, {
            message: 'El correo o contraseña son incorrectos'
          })
        }
        return done(null, usuario);
      } catch (error) {
        return done(null, false, {
          message: 'Esa cuenta no existe.'
        })
      }
    }
  )
)

// Serializar el usuario
passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
})

// Deserializarlo
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
})

module.exports = passport;