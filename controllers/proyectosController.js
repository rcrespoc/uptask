const {Request, Response} = require('express');
const {Proyectos, Tareas} = require('../models');

const proyectosHome = async (req = Request, res = Response) => {
  /**
   * Render va a renderizar el archivo llamado index de las vistas
   * usando el engine que ha sido declarado en el index.js
   */
  try {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});
    res.render('index', {
      title: 'Hey', 
      proyectos
    });
  } catch (error) {
    console.log(error)
  }
  
}
const Nosotros = (req, res) => {
  res.render('nosotros', {
    title: 'Nosotros', 
    message: 'Nosotros World!'
  });
}

const formularioProyecto = async(req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({where: {usuarioId}});
  res.render('nuevoProyecto',{
    title: 'Nuevo proyecto',
    proyectos
  })
}

const nuevoProyecto = async (req, res) => {
  const { nombre } = req.body;

  let errores = [];

  if(!nombre){
    errores.push({'texto': 'Agrega un nombre al proyecto'});
  }

  if(errores.length > 0){
    res.render('nuevoProyecto', {
      title: 'Nuevo proyecto',
      errores
    })
  }else{
    // Insertar en la BD
    try {
      const usuarioId = res.locals.usuario.id;
      await Proyectos.create({nombre, usuarioId});
      res.redirect('/');
    } catch (error) {
      console.log(error);
    }
  }
}

const proyectoPorUrl = async (req, res, next) => {
  const usuarioId = res.locals.usuario.id;
  const [proyectos, proyecto] = await Promise.all([
    Proyectos.findAll({where: {usuarioId}}),
    Proyectos.findOne({
      where: {
        url: req.params.url,
        usuarioId
      }
    })
  ])

  const tareas = await Tareas.findAll({
    where: {
      proyectoId: proyecto.id
    },
    include: [{
      model: Proyectos
    }]
  })
  if(!proyecto) return next();
  res.render('tareas', {
    nombrePagina: 'Tareas',
    proyecto,
    proyectos,
    tareas
  })
}

const formularioEditar = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const [proyectos, proyecto] = await Promise.all([
    Proyectos.findAll({where: {usuarioId}}),
    Proyectos.findOne({
      where: {
        id: req.params.id,
        usuarioId
      }
    })
  ])
  res.render('nuevoProyecto', {
    title: 'Editar proyecto',
    proyectos,
    proyecto
  })
}

const editarProyecto = async (req, res) => {
  const { nombre } = req.body;

  let errores = [];

  if(!nombre){
    errores.push({'texto': 'Agrega un nombre al proyecto'});
  }

  if(errores.length > 0){
    res.render('nuevoProyecto', {
      title: 'Nuevo proyecto',
      errores
    })
  }else{
    // Insertar en la BD
    try {
      await Proyectos.update(
        { nombre }, 
        { where: { 
            id: req.params.id 
          }
        }
      );
      res.redirect('/');
    } catch (error) {
      console.log(error);
    }
  }
}

const eliminarProyecto =  async (req, res) => {
  const { url } = req.params;
  try {
    const resultado = await Proyectos.destroy({
      where:{
        url
      }
    });
  } catch (error) {
    console.log(error)
  }
  res.send('Proyecto eliminado exitosamente.')
}

module.exports = {
  proyectosHome,
  Nosotros,
  formularioProyecto,
  nuevoProyecto,
  proyectoPorUrl,
  formularioEditar,
  editarProyecto,
  eliminarProyecto
}