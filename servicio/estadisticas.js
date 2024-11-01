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
    
    obtenerEstadisticas = async (mes, dia, año) => {
        try {
            const estadisticasTotales = await this.model.obtenerEstadisticas();
            let estadisticas;
    
            // Filtrar solo si se proporciona al menos un parámetro
            if (mes || dia || año) {
                let estadisticasFiltradas = estadisticasTotales.filter(est => {
                    const fechaEstadistica = new Date(est.fecha);
                    const mesEstadistica = fechaEstadistica.getMonth() + 1; // Obtener el mes (1-12)
                    const diaEstadistica = fechaEstadistica.getDate(); // Obtener el día (1-31)
                    const añoEstadistica = fechaEstadistica.getFullYear(); // Obtener el año
    
                    console.log("Mes del objeto en array " + mesEstadistica);
                    console.log("Dia del objeto en array " + diaEstadistica);
                    console.log("Año del objeto en array " + añoEstadistica);
                    console.log("Mes que le paso por parametro " + mes);
                    console.log("Dia que le paso por parametro " + dia);
                    console.log("Año que le paso por parametro " + año);
                    
                    // Comprobar coincidencias solo para los parámetros proporcionados
                    const mesCoincide = mes ? (mesEstadistica === Number(mes)) : true;
                    const diaCoincide = dia ? (diaEstadistica === Number(dia)) : true;
                    const añoCoincide = año ? (añoEstadistica === Number(año)) : true;
    
                    return mesCoincide && diaCoincide && añoCoincide;
                });
    
                // Inicializar el objeto para acumular las estadísticas
                let estadisticaAcumulada = { 
                    visitas: 0, 
                    visitasProductos: 0, 
                    anadidosAlCarrito: 0, 
                    visitasCarrito: 0, 
                    prepedidos: 0,
                    pedidosRealizados: 0, 
                    cantVentas: 0, 
                    totalVendido: 0, 
                    visitasInstagram: 0, 
                    visitasWhatsapp: 0 
                };
    
                // Acumular estadísticas si hay datos filtrados
                estadisticasFiltradas.forEach(est => {
                    estadisticaAcumulada.visitas += est.visitas || 0;
                    estadisticaAcumulada.visitasProductos += est.visitasProductos || 0;
                    estadisticaAcumulada.anadidosAlCarrito += est.anadidosAlCarrito || 0;
                    estadisticaAcumulada.visitasCarrito += est.visitasCarrito || 0;
                    estadisticaAcumulada.prepedidos += est.prepedidos || 0;
                    estadisticaAcumulada.pedidosRealizados += est.pedidosRealizados || 0;
                    estadisticaAcumulada.cantVentas += est.cantVentas || 0;
                    estadisticaAcumulada.totalVendido += est.totalVendido || 0;
                    estadisticaAcumulada.visitasInstagram += est.visitasInstagram || 0;
                    estadisticaAcumulada.visitasWhatsapp += est.visitasWhatsapp || 0;
                });
    
                // Si hay estadísticas filtradas, devolver el resultado acumulado, de lo contrario, un array vacío
                estadisticas = estadisticasFiltradas.length > 0 ? estadisticaAcumulada : [];
            } else {
                console.log("No se pasó ningún parámetro, así que mostramos todas");
                estadisticas = estadisticasTotales;
            }
    
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
