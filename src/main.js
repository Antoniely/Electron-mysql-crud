const { BrowserWindow, Notification } = require('electron');
const { getConnection } = require('./database')

let window;

async function crearProducto(producto) {
    try {
        const conn = await getConnection();
        producto.precio = parseFloat(producto.precio)
        const resultado = await conn.query('INSERT INTO producto SET ?', producto);

        new Notification({
            title: 'Electron Mysql',
            body: 'Nuevo producto guardado'
        }).show();

        producto.id = resultado.insertId;
        return producto;

    } catch (error) {
        console.log(error);
    }
}

async function getProductos() {
    try {
        const conn = await getConnection();
        const resultado = await conn.query('SELECT * FROM producto ORDER BY id DESC');

        return resultado;
    } catch (error) {
        console.log(error);
    }
}

async function deleteProducto(id) {
    try {
        const conn = await getConnection();
        const resultado = await conn.query('DELETE FROM producto WHERE id = ?', id);
        console.log(resultado);

    } catch (error) {
        console.log(error);
    }
}

async function getProductoById(id) {
    try {
        const conn = await getConnection();
        const resultado = await conn.query('SELECT * FROM producto WHERE id = ?', id);

        return resultado[0];
    } catch (error) {
        console.log(error);
    }
}

async function updateProducto(id, producto) {
    try {
        const conn = await getConnection();
        const resultado = await conn.query('UPDATE producto SET ? WHERE id = ?', [producto, id]);
        console.log(resultado);
    } catch (error) {
        console.log(error);
    }
}

function createWindows() {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    window.loadFile('src/ui/index.html');
}

module.exports = {
    createWindows,
    crearProducto,
    getProductos,
    deleteProducto,
    getProductoById,
    updateProducto
}