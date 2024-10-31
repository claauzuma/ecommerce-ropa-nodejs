import ModelFactory from "../model/DAO/estadisticasFactory.js";

class ServicioEstadisticas {
    constructor(persistencia) {
        this.model = ModelFactory.get(persistencia);
    }

    guardarEstadistica = async (datos) => {
        console.log("Procedemos a guardar la estadística");
        try {
            const estadisticas = await this.model.guardarEstadistica(datos);
            return {
                status: 'success',
                data: estadisticas,
            };
        } catch (error) {
            console.error('Error al guardar estadística:', error);
            throw new Error('No se pudo guardar la estadística');
        }
    };


    guardarClick = async (datos) => {
        console.log("Procedemos a guardar la estadística");
        try {
            const fecha = datos.fecha;
            const id = datos.id;
            const estadisticas = await this.model.obtenerEstadisticas();
    
            const estadMismaFecha = estadisticas.find(e => e.fecha == fecha);
    
            if (estadMismaFecha) {
                const idExistente = estadMismaFecha.idProductosBuscados.findIndex(objeto => objeto.id == id);
                
                if (idExistente >= 0) {
                    // Incrementar cantidad si ya existe
                    estadMismaFecha.idProductosBuscados[idExistente].cantidad += 1;
                } else {
                    // Agregar nuevo objeto
                    estadMismaFecha.idProductosBuscados.push({ id: id, cantidad: 1 });
                }
    
                // Guardar cambios
                await this.model.guardarEstadistica(estadMismaFecha);
            } else {
                // Si no hay estadística para la fecha, crear una nueva
                const nuevaEstadistica = { fecha, idProductosBuscados: [{ id: id, cantidad: 1 }] };
                await this.model.guardarEstadistica(nuevaEstadistica);
            }
        } catch (error) {
            console.error('Error al guardar estadística:', error);
            throw new Error('No se pudo guardar la estadística');
        }
    };
    

    obtenerEstadisticas = async () => {
        try {
            const estadisticas = await this.model.obtenerEstadisticas();
            return {
                status: 'success',
                data: estadisticas,
            };
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw new Error('No se pudieron obtener las estadísticas');
        }
    };

    obtenerEstadisticasPorTipo = async (tipoEvento) => {
        try {
            const estadisticas = await this.model.obtenerEstadisticas({ tipoEvento });
            return {
                status: 'success',
                data: estadisticas,
            };
        } catch (error) {
            console.error('Error al obtener estadísticas por tipo:', error);
            throw new Error(`No se pudieron obtener las estadísticas para el tipo de evento ${tipoEvento}`);
        }
    };
}

export default ServicioEstadisticas;
