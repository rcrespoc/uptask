import axios from 'axios'
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';
const tareas = document.querySelector('.listado-pendientes');
const boton = document.querySelector('.boton.nueva-tarea');


if(tareas){
  tareas.addEventListener('click', (e) => {
    if(e.target.classList.contains('fa-check-circle')){
      const icono = e.target;
      const idTarea = icono.parentElement.parentElement.dataset.tarea;
      
      const url = `${location.origin}/tareas/${idTarea}`;
      axios.patch(url, {idTarea})
      .then(resp => {
        icono.classList.toggle('completo');
        actualizarAvance();
      })
      .catch(err => console.log(err))
    }
    if(e.target.classList.contains('fa-trash')){
      const tareaHTML = e.target.parentElement.parentElement;
      const idTarea = tareaHTML.dataset.tarea;
      const url = `${location.origin}/tareas/${idTarea}`;
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(url, {params: { idTarea }})
              .then(resp => {
                Swal.fire(
                  'Deleted!',
                  resp.data,
                  'success'
                )
                if(resp.status === 200){
                  tareaHTML.parentElement.removeChild(tareaHTML);
                  actualizarAvance();
                }
              })
              .catch(err => console.log);
          
        }
      })
    }
  })

}

export default tareas;

