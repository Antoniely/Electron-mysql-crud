const productoForm = document.getElementById('productoForm');

const productonombre = document.getElementById('nombre');
const productoprecio = document.getElementById('precio');
const productodescripcion = document.getElementById('descripcion');
const productosLista = document.getElementById('productos');

const { remote } = require('electron')
const main = remote.require('./main')

let productos = [];
let editButtonStatus = false;
let editProductoId = '';

productoForm.addEventListener('submit', async(e) => {
    e.preventDefault();


    const nuevoProducto = {
        nombre: productonombre.value,
        precio: productoprecio.value,
        descripcion: productodescripcion.value
    }

    if (!editButtonStatus) {
        await main.crearProducto(nuevoProducto);
    } else {
        await main.updateProducto(editProductoId, nuevoProducto);
        editButtonStatus = false;
        editProductoId = '';
    }

    productoForm.reset();
    productonombre.focus();
    await getProductos();

})

async function deleteProducto(id) {
    const respuesta = confirm('Estas seguro de eliminarlo?');
    if (respuesta) {
        await main.deleteProducto(id);
        await getProductos();
    }
    return;
}

async function editProducto(id) {
    const producto = await main.getProductoById(id);
    console.log(producto);
    productonombre.value = producto.nombre;
    productoprecio.value = producto.precio;
    productodescripcion.value = producto.descripcion;

    editButtonStatus = true;
    editProductoId = producto.id;
}

function renderizarProductos(productos) {
    productosLista.innerHTML = '';
    productos.forEach(producto => {
        productosLista.innerHTML += `
            <div class="card card-body my-2 animated fadeInLeft">
               <h4> ${producto.nombre}</h4>
               <p> ${producto.descripcion}</p>
               <h3> ${producto.precio}</h3>
               <p>
                    <button class="btn btn-danger" onclick="deleteProducto('${producto.id}')">
                        Borrar
                    </button>
                    <button class="btn btn-secondary" onclick="editProducto('${producto.id}')">
                        Editar
                    </button>
               </p>
               </div>
        `;
    });
}

const getProductos = async() => {
    productos = await main.getProductos();
    renderizarProductos(productos);
}

async function init() {
    await getProductos();
}

init();