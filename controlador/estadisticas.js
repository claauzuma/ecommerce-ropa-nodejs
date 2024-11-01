import ServicioEstadisticas from '../servicio/estadisticas.js';

class ControladorEstadisticas {
    constructor() {
        this.servicio = new ServicioEstadisticas();
    }

    // Guardar una nueva estadística
    guardarEstadistica = async (req, res) => {
        try {
            if(!req.body) {
                return res.status(400).json({ message: 'Error: no se recibieron datos de la estadística.' });
            }
            console.log("Pasamos por aca primero CONTROLADOR")
            console.log(req.body)
            const datos = req.body;
            console.log("Imprimimos los datos " + datos.fecha)
            const estadisticaGuardada = await this.servicio.guardarEstadistica(datos);
            res.status(201).json(estadisticaGuardada);
        } catch (error) {
            console.error('Error al guardar estadística:', error);
            res.status(500).json({ message: 'Error al guardar la estadística' });
        }
    };

    guardarClick = async (req, res) => {
        try {
            if(!req.body) {
                return res.status(400).json({ message: 'Error: no se recibieron datos de la estadística.' });
            }
            console.log("Pasamos por aca primero CONTROLADOR CLICKKK")
            console.log(req.body)
            const datos = req.body;

            console.log("Imprimimos los datos " + datos.fecha)
            const idGuardado = await this.servicio.guardarClick(datos);
            res.status(201).json(idGuardado);
        } catch (error) {
            console.error('Error al guardar estadística:', error);
            res.status(500).json({ message: 'Error al guardar la estadística' });
        }
    };

    // Obtener todas las estadísticas
    obtenerEstadisticas = async (req, res) => {
        try {
            const { mes, dia, anio } = req.query; // Extraer mes, dia y anio de los parámetros de consulta
            console.log("(Controlador) EL MES SELECCIONADO ES " + mes);
            console.log("(Controlador) EL DÍA SELECCIONADO ES " + dia);
            console.log("(Controlador) EL AÑO SELECCIONADO ES " + anio);
    
            // Llamar al servicio y pasar los parámetros obtenidos
            const estadisticas = await this.servicio.obtenerEstadisticas(mes, dia, anio);
    
            res.json(estadisticas);
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json({ message: 'Error al obtener las estadísticas' });
        }
    };
    

    // Obtener estadísticas por tipo
    obtenerEstadisticasPorTipo = async (req, res) => {
        try {
            const { tipoEvento } = req.params;
            const estadisticas = await this.servicio.obtenerEstadisticasPorTipo(tipoEvento);
            res.json(estadisticas);
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json({ message: 'Error al obtener las estadísticas' });
        }
    };
}

export default ControladorEstadisticas;
