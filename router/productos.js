import express from 'express';
import ControladorProductos from '../controlador/productos.js';
import { subirImagen } from '../middleware/storage.js';
import multer from 'multer';
import cloudinary from 'cloudinary';

const upload = multer ({dest: 'uploads'})

class RouterProductos {

    constructor(controladorProductos,persistencia) {
        this.router = express.Router();
        this.controladorProductos = new ControladorProductos(persistencia); 

    }

    start() {
        console.log("HOLA MUNDOOOO")
 
        this.router.get('/', this.controladorProductos.obtenerProductos);
        this.router.get('/:id', this.controladorProductos.obtenerProductos);
        this.router.post('/', subirImagen, this.controladorProductos.agregarProducto); // Aquí solo se llama a subirImagen, ya no .array()
       // this.router.put('/:id', subirImagen.single('image'), this.controladorProductos.modificarProducto);
        this.router.delete('/:id', this.controladorProductos.borrarProducto);

        return this.router
    }

}

export default RouterProductos;
