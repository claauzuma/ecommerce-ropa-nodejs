import ModelFactory from "../model/DAO/productosFactory.js";

class ServicioProductos {
    constructor(persistencia) {
        this.model = ModelFactory.get(persistencia);
    }

    // Obtener productos (por ID o todos)
    obtenerProductos = async id => {
        const productos = await this.model.obtenerProductos(id);
        return productos;
    };

    // Agregar un nuevo producto
    agregarProducto = async producto => {
        const productoAgregado = await this.model.guardarProducto(producto);
        return productoAgregado;
    };

    // Modificar un producto por ID
    modificarProducto = async (id, producto) => {
        const productoModificado = await this.model.actualizarProducto(id, producto);
        return productoModificado;
    };

    // Borrar un producto por ID
    borrarProducto = async idProducto => {
        const productoBorrado = await this.model.borrarProducto(idProducto);
        return productoBorrado;
    };
}

export default ServicioProductos;
