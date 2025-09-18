
$(document).ready(function() {
    // Función para obtener y mostrar las provincias en la tabla
    function fetchProvincias() {
        $.ajax({
            url: 'provincias-list.php', 
            type: 'GET',
            success: function(response) {
                let provincias = JSON.parse(response);
                let template = '';
                provincias.forEach(provincia => {
                    template += `
                        <tr data-id="${provincia.id}">
                            <td>${provincia.id}</td>
                            <td>
                                <a href="#" class="task-item">
                                    ${provincia.nombre} 
                                </a>
                            </td>
                            <td>${provincia.status}</td>
                            <td>${provincia.descripcion}</td>
                            <td>
                                <button class="task-edit btn btn-warning btn-sm">
                                    Editar 📝
                                </button>
                            </td>
                            <td>
                                <button class="task-delete btn btn-danger btn-sm">
                                    Eliminar ❌
                                </button>
                            </td>
                        </tr>
                    `;
                });
                $('#tprovincias').html(template);
            }
        });
    }

    });

    // Evento para el envío del formulario (crear o editar)
    $('#task-form').submit(function(e) {
        e.preventDefault();

        // Obtener los datos del formulario
        const postData = {
            nombre: $('#nombre').val(),
            descripcion: $('#descripcion').val(),
            id: $('#taskId').val()
        };

        // Determinar la URL de destino usando la variable `edit`
        const url = (edit) ? 'editarprov.php' : 'add-provincia.php';
        
        // Enviar la petición AJAX
        $.post(url, postData, function(response) {
            console.log(response);

            // Restablecer el formulario y el estado de edición
            $('#task-form').trigger('reset');
            edit = false;
            $('#task-form button[type="submit"]').text('Guardar');

            // Actualizar la lista de provincias en la tabla
            fetchProvincias();
        });
    });

    
    