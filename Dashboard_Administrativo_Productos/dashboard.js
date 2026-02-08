const BASE_URL = "https://dummyjson.com/products";

let skip = 0;
const limit = 10;
let total = 0;

let filtros = {
    busqueda: "",
    categoria: "",
    ordenar: null
};

async function cargarProductos() {

    let url = `${BASE_URL}?limit=${limit}&skip=${skip}`;

    if (filtros.busqueda) {
        url = `${BASE_URL}/search?q=${filtros.busqueda}`;
    }

    if (filtros.categoria) {
        url = `${BASE_URL}/category/${filtros.categoria}`;
    }

    if (filtros.ordenar) {
        url += `&sortBy=${filtros.ordenar.campo}&order=${filtros.ordenar.tipo}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    total = data.total;

    renderizarTabla(data.products);
    actualizarPaginacion();
}

function renderizarTabla(productos) {

    productTable.innerHTML = "";

    productos.forEach(p => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${p.id}</td>
            <td><img src="${p.thumbnail}"></td>
            <td>${p.title}</td>
            <td>$${p.price}</td>
            <td>${p.category}</td>
            <td>
                <button class="btn btn-warning btn-sm"
                    onclick="editarProducto(${p.id})">Editar</button>
                <button class="btn btn-danger btn-sm"
                    onclick="eliminarProducto(${p.id})">Eliminar</button>
            </td>
        `;

        productTable.appendChild(tr);
    });
}

function actualizarPaginacion() {

    const paginaActual = Math.floor(skip / limit) + 1;
    const totalPaginas = Math.ceil(total / limit);

    pageInfo.textContent = `Página ${paginaActual} de ${totalPaginas}`;

    prevBtn.disabled = skip === 0;
    nextBtn.disabled = skip + limit >= total;
}

/* EVENTOS */

prevBtn.onclick = () => {
    skip -= limit;
    cargarProductos();
};

nextBtn.onclick = () => {
    skip += limit;
    cargarProductos();
};

searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        filtros.busqueda = e.target.value;
        filtros.categoria = "";
        skip = 0;
        cargarProductos();
    }
});

categorySelect.addEventListener("change", e => {
    filtros.categoria = e.target.value;
    filtros.busqueda = "";
    skip = 0;
    cargarProductos();
});

sortSelect.addEventListener("change", e => {

    if (!e.target.value) filtros.ordenar = null;
    else {
        const [campo, tipo] = e.target.value.split("-");
        filtros.ordenar = { campo, tipo };
    }

    skip = 0;
    cargarProductos();
});

/* CATEGORIAS */

async function cargarCategorias() {

    const res = await fetch(`${BASE_URL}/category-list`);
    const data = await res.json();

    data.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
}

/* EDITAR */

async function editarProducto(id) {

    const nuevoTitulo = prompt("Nuevo título:");
    const nuevoPrecio = prompt("Nuevo precio:");

    if (!nuevoTitulo || !nuevoPrecio) return;

    await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: nuevoTitulo,
            price: nuevoPrecio
        })
    });

    alert("Producto actualizado");

    cargarProductos();
}

/* ELIMINAR */

async function eliminarProducto(id) {

    if (!confirm("¿Eliminar este producto?")) return;

    await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

    alert("Producto eliminado");

    cargarProductos();
}

/* INIT */

cargarCategorias();
cargarProductos();
