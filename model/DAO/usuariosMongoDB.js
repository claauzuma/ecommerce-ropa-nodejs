import { ObjectId } from "mongodb";
import CnxMongoDB from "../DBMongo.js";

class ModelMongoDBUsuarios {



    obtenerUsuarios = async id => {   
        if (!CnxMongoDB.connection) {
            // Si no hay conexión, podrías manejar esto de manera más explícita.
            throw new Error('No hay conexión a la base de datos');
        }
        if(id) {
            const usuario = await CnxMongoDB.db.collection('usuarios').findOne({_id: new ObjectId(id)})
            return usuario
        }
        else {
            const usuarios = await CnxMongoDB.db.collection('usuarios').find({}).toArray()
            return usuarios
        }
    }


    guardarUsuario = async usuario => {
        if(!CnxMongoDB.connection) return {}

        await CnxMongoDB.db.collection('usuarios').insertOne(usuario)
        return usuario
    }




}

export default ModelMongoDBUsuarios