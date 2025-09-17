// Variable de estado para controlar si estamos en modo edición
let edit = false;

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

    // Cargar las provincias al iniciar la página
    fetchProvincias();

    // Evento para el clic del botón de editar
    $(document).on('click', '.task-edit', function(e) {
        e.preventDefault();
        
        // Obtener el ID de la provincia de la fila de la tabla
        const element = $(this).closest('tr');
        const id = $(element).data('id');

        // Establecer el estado de edición a `true`
        edit = true;

        // Petición AJAX para obtener los datos de la provincia
        $.post('buscarprov.php', { id: id }, function(response) {
            const provincia = JSON.parse(response);
            
            // Llenar el formulario con los datos obtenidos
            $('#nombre').val(provincia.nombre);
            $('#descripcion').val(provincia.descripcion);
            $('#taskId').val(provincia.id); 

            // Cambiar el texto del botón de "Guardar" a "Actualizar"
            $('#task-form button[type="submit"]').text('Actualizar');
        });
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

    // Evento para el clic del botón de eliminar
    $(document).on('click', '.task-delete', function(e) {
        e.preventDefault();

        if (confirm('¿Estás seguro de que quieres eliminar esta provincia?')) {
            const element = $(this).closest('tr');
            const id = $(element).data('id');
            
            $.post('borrarprov.php', { id: id }, function(response) {
                console.log(response);
                fetchProvincias();
            });
        }
    });
});