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

    agregarComentario = async (id, comentarioData) => {
        try {
          const producto = await this.model.findById(id);  // Usa el DAO correctamente
          console.log("El producto es " , producto)
    
          if (!producto) {
            throw new Error('Producto no encontrado');
          }
    
          const comentario = {
            fecha: comentarioData.fecha,
            hora: comentarioData.hora,
            nombre: comentarioData.nombre,
            email: comentarioData.email,
            comentario: comentarioData.comentario,
          };
    
          producto.comentarios.push(comentario);  // Añade el comentario
    
          const productoActualizado = await this.model.actualizarProducto(id, producto);  // Guarda los cambios
          return productoActualizado;
    
        } catch (error) {
          console.error('Error al agregar comentario:', error);
          throw new Error('No se pudo agregar el comentario');
        }
      };
      

    modificarProducto = async (id, producto) => {
        console.log("Aca modificamos el producto")
        const productoModificado = await this.model.actualizarProducto(id, producto);
        console.log("Se modifico el producto " ,productoModificado)
        return productoModificado;
    };

    // Borrar un producto por ID
    borrarProducto = async idProducto => {
        const productoBorrado = await this.model.borrarProducto(idProducto);
        return productoBorrado;
    };
}

export default ServicioProductos;
