const Sequealize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos')

const Tareas = db.define('tareas', {
  id: {
    type: Sequealize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  tarea: Sequealize.STRING(100),
  estado: Sequealize.INTEGER(1)
})

Tareas.belongsTo(Proyectos);

module.exports = Tareas;