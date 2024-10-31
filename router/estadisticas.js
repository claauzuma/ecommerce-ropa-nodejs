import express from 'express';
import ControladorEstadisticas from '../controlador/estadisticas.js';
import multer from 'multer';
import cloudinary from 'cloudinary';

const upload = multer({ dest: 'uploads' });

class RouterEstadisticas {
    constructor(persistencia) {
        this.router = express.Router();
        this.controladorEstadisticas = new ControladorEstadisticas(persistencia); 
    }

    start() {
        console.log("HOLA Estadisticas");

        // Rutas para el controlador de estadísticas
        this.router.post('/', this.controladorEstadisticas.guardarEstadistica);
        this.router.post('/clickproducto', this.controladorEstadisticas.guardarClick);
        this.router.get('/', this.controladorEstadisticas.obtenerEstadisticas);
        this.router.get('/:tipoEvento', this.controladorEstadisticas.obtenerEstadisticasPorTipo);
        
        return this.router;
    }
}

export default RouterEstadisticas;
