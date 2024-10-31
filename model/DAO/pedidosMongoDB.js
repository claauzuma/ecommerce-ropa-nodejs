import { ObjectId } from "mongodb";
import CnxMongoDB from "../DBMongo.js";

class ModelMongoDBPedidos {
    
    // Obtener uno o todos los pedidos
    obtenerPedidos = async (id) => {   
        if (!CnxMongoDB.connection) {
            throw new Error('No hay conexión a la base de datos');
        }
        if (id) {
            const pedido = await CnxMongoDB.db.collection('pedidos').findOne({ _id: new ObjectId(id) });
            return pedido;
        } else {
            const pedidos = await CnxMongoDB.db.collection('pedidos').find({}).toArray();
            return pedidos;
        }
    }

    // Guardar un nuevo pedido
    guardarPedido = async (pedido) => {
        if (!CnxMongoDB.connection) return {};

        await CnxMongoDB.db.collection('pedidos').insertOne(pedido);
        return pedido;
    }

    // Actualizar un pedido existente
    actualizarPedido = async (id, pedido) => {
        if (!CnxMongoDB.connection) return {};
       console.log("Intentamos actualizar el pedido id" +id + " con el pedido " + pedido)
        await CnxMongoDB.db.collection('pedidos').updateOne(
            { _id: new ObjectId(id) },
            { $set: pedido }
        );

        const pedidoActualizado = await this.obtenerPedidos(id);
        return pedidoActualizado;
    }

    // Borrar un pedido por su id
    borrarPedido = async (id) => {
        if (!CnxMongoDB.connection) return {};

        const pedidoABorrar = await this.obtenerPedidos(id);
        await CnxMongoDB.db.collection('pedidos').deleteOne({ _id: new ObjectId(id) });
        return pedidoABorrar;
    }
}

export default ModelMongoDBPedidos;
