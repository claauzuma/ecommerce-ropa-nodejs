import express from 'express';
import ControladorUsuarios from '../controlador/usuarios.js';
import { subirImagen } from '../middleware/storage.js';
import multer from 'multer';
import cloudinary from 'cloudinary';

const upload = multer ({dest: 'uploads'})

class RouterProductos {

    constructor(controladorUsuarios,persistencia) {
        this.router = express.Router();
        this.controladorUsuarios = new ControladorUsuarios(persistencia); 

    }

    start() {
        console.log("HOLA MUNDOOOO")

        this.router.post('/admins', this.controladorUsuarios.agregarAdmin)
        
        this.router.post('/login', this.controladorUsuarios.logearUsuario)

        this.router.post('/logout',(req,res) => {
            res.clearCookie('acces_token')
            .json({messae: "Sesion cerrada exitosamente"})
        })

        return this.router
    }

}

export default RouterProductos;
