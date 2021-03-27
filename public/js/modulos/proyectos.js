import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
  btnEliminar.addEventListener('click', (e) => {
    const urlProyecto = e.target.dataset.proyectoUrl;
    Swal.fire({
      title: 'Deseas borrar el proyecto?',
      text: "Un proyecto eliminado no se recupera",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `${location.origin}/proyectos/${urlProyecto}`;
        axios.delete(url, {
          params: urlProyecto
        })
        .then((resp) => {
          Swal.fire(
            'Proyecto eliminado.',
            resp.data,
            'success'
          );
        })
        .catch((err) => console.log)
      }
    })
  })
}

export default btnEliminar;