const API_URL = "https://690bbedc6ad3beba00f610ef.mockapi.io/users";
const results = document.getElementById("results");

// Mostrar usuarios en la lista
function mostrar(usuarios) {
  results.innerHTML = "";
  usuarios.forEach(u => {
    results.innerHTML += `<li class="list-group-item bg-dark text-white">ID ${u.id}: ${u.name} ${u.lastname}</li>`;
  });
}

// Mostrar alerta de error
function mostrarError() {
    const alertError = document.getElementById('alert-error');
    alertError.classList.add('show');
    setTimeout(() => alertError.classList.remove('show'), 3000);
}

// Buscar (todos o por ID)
async function buscar() {
    const id = document.getElementById("inputGet1Id").value.trim();
    const url = id ? `${API_URL}/${id}` : API_URL;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Response not ok');
        const data = await res.json();
        mostrar(Array.isArray(data) ? data : [data]);
    } catch {
        mostrarError();
    }
}

// Agregar
async function agregar() {
    const name = document.getElementById("inputPostNombre").value.trim();
    const lastname = document.getElementById("inputPostApellido").value.trim();

    if (!name || !lastname) return;

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, lastname }),
        });
        if (!res.ok) throw new Error('Response not ok');
        document.getElementById("inputPostNombre").value = "";
        document.getElementById("inputPostApellido").value = "";
        togglePostButton(); // Deshabilitar el botón después de agregar
        buscar();
    } catch {
        mostrarError();
    }
}

// Variables para el modal
const dataModal = new bootstrap.Modal(document.getElementById('dataModal'));
const btnSendChanges = document.getElementById('btnSendChanges');

// Modificar - Cargar datos en el modal
async function modificar() {
    const id = document.getElementById("inputPutId").value.trim();
    if (!id) return;

    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Response not ok');
        const data = await response.json();
        
        // Cargar datos en el modal
        document.getElementById("inputPutNombre").value = data.name;
        document.getElementById("inputPutApellido").value = data.lastname;
        
        // Habilitar el botón de guardar si los campos tienen datos
        toggleModalSaveButton();
        
        // Mostrar el modal
        dataModal.show();
    } catch {
        mostrarError();
    }
}

// Función para habilitar/deshabilitar el botón de guardar del modal
function toggleModalSaveButton() {
    const nombre = document.getElementById("inputPutNombre").value.trim();
    const apellido = document.getElementById("inputPutApellido").value.trim();
    document.getElementById("btnSendChanges").disabled = !nombre || !apellido;
}

// Guardar cambios del modal
async function guardarCambios() {
    const id = document.getElementById("inputPutId").value.trim();
    const name = document.getElementById("inputPutNombre").value.trim();
    const lastname = document.getElementById("inputPutApellido").value.trim();

    if (!name || !lastname) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, lastname }),
        });
        if (!res.ok) throw new Error('Response not ok');
        dataModal.hide();
        document.getElementById("inputPutId").value = "";
        togglePutButton(); // Deshabilitar el botón después de modificar
        buscar();
    } catch {
        mostrarError();
    }
}

// Borrar
async function borrar() {
    const id = document.getElementById("inputDelete").value.trim();
    if (!id) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error('Response not ok');
        document.getElementById("inputDelete").value = "";
        toggleDeleteButton(); // Deshabilitar el botón después de borrar
        buscar();
    } catch {
        mostrarError();
    }
}

// Función para habilitar/deshabilitar el botón de agregar
function togglePostButton() {
  const nombre = document.getElementById("inputPostNombre").value.trim();
  const apellido = document.getElementById("inputPostApellido").value.trim();
  document.getElementById("btnPost").disabled = !nombre || !apellido;
}

// Función para habilitar/deshabilitar el botón de modificar
function togglePutButton() {
  const id = document.getElementById("inputPutId").value.trim();
  document.getElementById("btnPut").disabled = !id;
}

// Función para habilitar/deshabilitar el botón de borrar
function toggleDeleteButton() {
  const id = document.getElementById("inputDelete").value.trim();
  document.getElementById("btnDelete").disabled = !id;
}

// Eventos
document.getElementById("btnGet1").addEventListener("click", buscar);
document.getElementById("btnPost").addEventListener("click", agregar);
document.getElementById("btnPut").addEventListener("click", modificar);
document.getElementById("btnDelete").addEventListener("click", borrar);
document.getElementById("btnSendChanges").addEventListener("click", guardarCambios);

// Eventos para habilitar/deshabilitar los botones
document.getElementById("inputPostNombre").addEventListener("input", togglePostButton);
document.getElementById("inputPostApellido").addEventListener("input", togglePostButton);
document.getElementById("inputPutId").addEventListener("input", togglePutButton);
document.getElementById("inputDelete").addEventListener("input", toggleDeleteButton);

// Eventos para el modal
document.getElementById("inputPutNombre").addEventListener("input", toggleModalSaveButton);
document.getElementById("inputPutApellido").addEventListener("input", toggleModalSaveButton);

// Mostrar todos al inicio
buscar();
 