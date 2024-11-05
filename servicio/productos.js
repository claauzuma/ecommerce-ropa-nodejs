import ModelFactory from "../model/DAO/productosFactory.js";

class ServicioProductos {
    constructor(persistencia) {
        this.model = ModelFactory.get(persistencia);
    }

    obtenerProductos = async id => {
        const productos = await this.model.obtenerProductos(id);
        return productos;
    };

    agregarProducto = async producto => {
        try {
            const productoAgregado = await this.model.guardarProducto(producto);
            return productoAgregado; 
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            throw new Error('No se pudo agregar el producto'); 
        }
    };

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
