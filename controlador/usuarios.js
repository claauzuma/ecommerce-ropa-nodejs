import Servicio from '../servicio/usuarios.js';
import jwt from 'jsonwebtoken'; // <--- AÑADIR ESTO

class ControladorUsuarios {
    constructor(persistencia) {
        this.servicio = new Servicio(persistencia);
    }

    agregarAdmin = async (req, res) => {
        try {
            if (req.body) {
                const admin = req.body;
                const adminAgregado = await this.servicio.agregarAdmin(admin);
                res.json(adminAgregado);
            } else {
                res.status(404).json({ message: 'Falta el body' });
            }
        } catch (error) {
            console.error("Error al agregar admin:", error);
            res.status(500).json({ message: 'Error al agregar admin' });
        }
    }

    logearUsuario = async (req, res) => {
        try {
            console.log("Intentamos logear al usuario");
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email y contraseña son requeridos' });
            }

            console.log(email, password);
            const token = await this.servicio.logearUsuario(email, password);

            if (token) {
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 1000 // 1 hora
                });
                return res.json({ token });
            } else {
                return res.status(401).json({ message: 'Credenciales incorrectas' });
            }
        } catch (error) {
            console.error("Error al logear al usuario:", error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    };

    logOut = (req, res) => {
        try {
            // Eliminar la cookie que contiene el token
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Asegurarte de que la cookie solo se elimina en HTTPS en producción
                sameSite: 'strict', // O 'lax', dependiendo de tu configuración
                path: '/' // Asegúrate de que la cookie sea eliminada en todas las rutas
            });
    
            // Enviar respuesta de logout exitoso
            return res.status(200).json({ message: 'Logout exitoso' });
    
        } catch (error) {
            console.error("Error al hacer logout:", error);
            return res.status(500).json({ message: 'Error al hacer logout' });
        }
    };
    
}

export default ControladorUsuarios;
