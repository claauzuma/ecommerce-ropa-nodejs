import ModelFactory from "../model/DAO/usuariosFactory.js";
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

const saltRounds = 10;  // Define el número de rounds para bcrypt

class ServicioUsuarios {
    constructor(persistencia) {
        this.model = ModelFactory.get(persistencia);
    }

    agregarAdmin = async (admin) => {
        try {
            // Verificar si el email ya existe
            const usuarios = await this.model.obtenerUsuarios();
            const usuarioExistente = usuarios.find(u => u.email === admin.email);
    
            if (!usuarioExistente) {
                console.log("El email no está repetido, todo ok");
    
                // Hashear la contraseña antes de guardarla
                const hashedPassword = await bcrypt.hash(admin.password, saltRounds);
                admin.password = hashedPassword; // Asignar la contraseña hasheada al objeto admin
    
                admin.rol = "admin"; // Asegurar que el rol sea admin
    
                // Guardar el admin en la base de datos
                const adminAgregado = await this.model.guardarUsuario(admin);
                return adminAgregado;
            } else {
                console.log("El email ya existe");
                throw new Error("El email ya está en uso");
            }
    
        } catch (error) {
            console.error("Error al agregar admin:", error);
            throw error;
        }
    };

    logearUsuario = async (email, password) => {
        try {
            console.log("Intentamos logear al usuario en la capa de servicios: " + email);
    
            const usuarios = await this.model.obtenerUsuarios();
            const userDb = usuarios.find(u => u.email === email);
            if (!userDb) {
                console.log("Usuario no encontrado");
                return { message: 'Usuario no encontrado' };
            }
            const match = await bcrypt.compare(password, userDb.password);
            if (!match) {
                console.log("Contraseña incorrecta");
                return { message: 'Contraseña incorrecta' };
            }
            console.log("Usuario logueado exitosamente");
            const token = jsonwebtoken.sign({
                email: userDb.email,
                rol: userDb.rol,

            }, 'clave_secreta', { expiresIn: '1h' });
    
            return token;
        } catch (error) {
            console.error("Error al logear al usuario:", error);
            return { message: 'Error en el servidor' };
        }
    };
}

export default ServicioUsuarios;
