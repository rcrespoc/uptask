const { Proyectos, Tareas } = require('../models');

const agregarTarea = async (req, res) => {
  const { url } = req.params;
  const proyecto = await Proyectos.findOne({
    where: {
      url
    }
  })
  const { tarea } = req.body;
  const estado = 0;
  const proyectoId = proyecto.id;

  // Insertar

  const resultado = await Tareas.create({ tarea, estado, proyectoId });
  if(!resultado){
    return next();
  }
  res.redirect(`/proyectos/${url}`);
}

const actualizarTareaEstado = async(req, res, next) => {
  const { id } = req.params;
  const tarea = await Tareas.findOne({where:{id}});
  tarea.estado = !tarea.estado;
  const resultado = await tarea.save();
  if(!resultado) return next();
  res.status(200).send('Cambiado')
}

const eliminarTarea = async (req, res, next) => {
  const { id } = req.params;
  const resp = await Tareas.destroy({where: {id}});
  res.send('Eliminado satisfactoriamente.');
}
module.exports = {
  agregarTarea,
  actualizarTareaEstado,
  eliminarTarea
}