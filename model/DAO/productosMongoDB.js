import { ObjectId } from "mongodb";
import CnxMongoDB from "../DBMongo.js";

class ModelMongoDBProductos {
    
    // Obtener uno o todos los productos
    obtenerProductos = async (id) => {   
        if (!CnxMongoDB.connection) {
            throw new Error('No hay conexión a la base de datos');
        }
        if (id) {
            const producto = await CnxMongoDB.db.collection('productos').findOne({ _id: new ObjectId(id) });
            return producto;
        } else {
            const productos = await CnxMongoDB.db.collection('productos').find({}).toArray();
            return productos;
        }
    }

    findById = async (id) => {
        if (!CnxMongoDB.connection) {
          throw new Error('No hay conexión a la base de datos');
        }
        
        try {
          const producto = await CnxMongoDB.db.collection('productos').findOne({ _id: new ObjectId(id) });
          return producto;
        } catch (error) {
          console.error('Error al buscar producto por ID:', error);
          throw new Error('No se pudo encontrar el producto');
        }
      };
      

    // Guardar un nuevo producto
    guardarProducto = async (producto) => {
        if (!CnxMongoDB.connection) return {};

        await CnxMongoDB.db.collection('productos').insertOne(producto);
        return producto;
    }

    // Actualizar un producto existente
    actualizarProducto = async (id, producto) => {
        if (!CnxMongoDB.connection) return {};

        await CnxMongoDB.db.collection('productos').updateOne(
            { _id: new ObjectId(id) },
            { $set: producto }
        );

        const productoActualizado = await this.obtenerProductos(id);
        return productoActualizado;
    }

    // Borrar un producto por su id
    borrarProducto = async (id) => {
        if (!CnxMongoDB.connection) return {};

        const productoABorrar = await this.obtenerProductos(id);
        await CnxMongoDB.db.collection('productos').deleteOne({ _id: new ObjectId(id) });
        return productoABorrar;
    }
}

export default ModelMongoDBProductos;
