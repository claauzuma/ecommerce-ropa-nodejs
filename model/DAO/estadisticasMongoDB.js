import { ObjectId } from "mongodb";
import CnxMongoDB from "../DBMongo.js";

class ModelMongoDBEstadisticas {
    // Obtener una o todas las estadísticas


    async obtenerEstadisticas(id) {
        if (!CnxMongoDB.connection) {
            throw new Error('No hay conexión a la base de datos');
        }
        if (id) {
            const estadistica = await CnxMongoDB.db.collection('estadisticas').findOne({ _id: new ObjectId(id) });
            return estadistica;
        } else {
            const estadisticas = await CnxMongoDB.db.collection('estadisticas').find({}).toArray();
            return estadisticas;
        }
    }


    async guardarEstadistica(datos) {
        if (!CnxMongoDB.connection) {
            throw new Error('No hay conexión a la base de datos');
        }
    
        console.log("Guardando o actualizando la estadística en MongoDB");
        console.log(datos.fecha);
        console.log(datos.visitas);
    
        const { fecha, id, ...camposActualizados } = datos; // Extrae el ID
        const filtro = { fecha };
    
        // Campos iniciales con valores en cero
        const camposIniciales = {
            fecha,
            visitas: 0,
            visitasProductos: 0,
            anadidosAlCarrito: 0,
            visitasCarrito: 0,
            prepedidos: 0,
            pedidosRealizados: 0,
            cantVentas: 0,
            totalVendido: 0,
            visitasInstagram: 0,
            visitasWhatsapp: 0,
            idProductosBuscados: []  // Inicializa como un array vacío
        };
    
        // Buscar el documento existente
        const estadisticaExistente = await CnxMongoDB.db.collection('estadisticas').findOne(filtro);
    
        if (estadisticaExistente) {
            // Lógica de actualización
            const actualizacion = { $inc: {} };
            const idProductoExistente = estadisticaExistente.idProductosBuscados.findIndex(obj => obj.id === id);
    
            if (idProductoExistente >= 0) {
                // Si el ID del producto ya existe, incrementa su cantidad
                estadisticaExistente.idProductosBuscados[idProductoExistente].cantidad += 1;
            } else {
                // Si no existe, agrega el producto al array
                if (id) { // Verifica que el ID no sea nulo
                    estadisticaExistente.idProductosBuscados.push({ id, cantidad: 1 });
                }
            }
    
            // Preparar la actualización para el documento
            for (const campo in camposActualizados) {
                if (campo !== "fecha" && typeof camposActualizados[campo] === 'number') {
                    actualizacion.$inc[campo] = camposActualizados[campo]; // Incrementa si es un número
                }
            }
    
            // Realiza la actualización
            await CnxMongoDB.db.collection('estadisticas').updateOne(filtro, { 
                $set: { idProductosBuscados: estadisticaExistente.idProductosBuscados },
                $inc: actualizacion.$inc
            });
        } else {
            // Si no existe, inserta con valores iniciales
            const nuevaEstadistica = { 
                ...camposIniciales, 
                ...camposActualizados,
            };
    
            // Solo agrega idProductosBuscados si hay un ID válido
            if (id) {
                nuevaEstadistica.idProductosBuscados = [{ id, cantidad: 1 }];
            } else {
                nuevaEstadistica.idProductosBuscados = []; // O simplemente no incluir este campo
            }
    
            await CnxMongoDB.db.collection('estadisticas').insertOne(nuevaEstadistica);
        }
    }
    
    
    

    // Actualizar una estadística existente
    async actualizarEstadistica(id, estadistica) {
        if (!CnxMongoDB.connection) {
            throw new Error('No hay conexión a la base de datos');
        }
        await CnxMongoDB.db.collection('estadisticas').updateOne(
            { _id: new ObjectId(id) },
            { $set: estadistica }
        );
        const estadisticaActualizada = await this.obtenerEstadisticas(id);
        return estadisticaActualizada;
    }

    // Borrar una estadística por su id
    async borrarEstadistica(id) {
        if (!CnxMongoDB.connection) {
            throw new Error('No hay conexión a la base de datos');
        }
        const estadisticaABorrar = await this.obtenerEstadisticas(id);
        await CnxMongoDB.db.collection('estadisticas').deleteOne({ _id: new ObjectId(id) });
        return estadisticaABorrar;
    }

    // Obtener estadísticas filtradas por tipo de evento
    async obtenerEstadisticasPorTipo(tipoEvento) {
        if (!CnxMongoDB.connection) {
            throw new Error('No hay conexión a la base de datos');
        }
        return await CnxMongoDB.db.collection('estadisticas').find({ tipoEvento }).toArray();
    }
}

export default ModelMongoDBEstadisticas;
