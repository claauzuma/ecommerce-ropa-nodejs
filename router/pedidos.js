import express from 'express';
import ControladorPedidos from '../controlador/pedidos.js';
import { subirImagen } from '../middleware/storage.js';
import multer from 'multer';
import cloudinary from 'cloudinary';

const upload = multer ({dest: 'uploads'})

class RouterPedidos {

    constructor(controladorProductos,persistencia) {
        this.router = express.Router();
        this.controladorPedidos = new ControladorPedidos(persistencia); 

    }

    start() {
        console.log("HOLA MUNDOOOO")
 
        this.router.get('/', this.controladorPedidos.obtenerPedidos);
        this.router.get('/:id', this.controladorPedidos.obtenerPedidos);
        this.router.post('/', this.controladorPedidos.agregarPedido);
        this.router.put('/:id', this.controladorPedidos.modificarPedido);
        this.router.delete('/:id', this.controladorPedidos.borrarPedido);

        return this.router
    }

}

export default RouterPedidos;
