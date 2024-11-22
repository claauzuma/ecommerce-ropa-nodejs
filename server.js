import express from 'express';
import CnxMongoDB from './model/DBMongo.js';
import RouterProductos from './router/productos.js'; 
import RouterPedidos from './router/pedidos.js'; 
import RouterEstadisticas from './router/estadisticas.js'
import RouterUsuarios from './router/usuarios.js'
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Server {
  constructor(port, persistencia) {
    this.port = port;
    this.persistencia = persistencia;
    this.app = express();
    this.server = null;
  }


  async start() {
    this.app.use(express.json());

    const corsOptions = {
      origin: [
        'https://ecommerce-ropa-01-eztc.vercel.app', // Frontend en Vercel
        'https://localhost:5173'  // Frontend en local (si estás desarrollando localmente)
      ],
      methods: 'GET, POST, PUT, DELETE, OPTIONS',  // Métodos permitidos
      allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
      credentials: true  // Permitir cookies o autenticación
    };
    
    // Habilitar CORS con la configuración personalizada
    this.app.use(cors(corsOptions));
    
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', 'https://ecommerce-ropa-01-eztc.vercel.app');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      
      // Agrega esta condición para manejar el preflight request de CORS
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }
      next();
    });
   
    this.app.use(morgan('dev'));
    this.app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
    this.app.use(express.static('public'));

    this.app.get('/', (req, res) => {
      res.json({ message: 'Hola mundo' });
    });

    this.app.use('/api/estadisticas', new RouterEstadisticas(this.persistencia).start());
    this.app.use('/api/pedidos', new RouterPedidos(this.persistencia).start());
    this.app.use('/api/productos', new RouterProductos(this.persistencia).start());
    this.app.use('/api/usuarios', new RouterUsuarios(this.persistencia).start());
    

    // Manejo de rutas no encontradas
    this.app.use((req, res) => {
      res.status(404).json({ status: false, errors: "not found" });
    });

    // Conectar a MongoDB si se especifica
    if (this.persistencia === 'MONGODB') {
      await CnxMongoDB.conectar();
    }

    // Iniciar servidor
    this.server = this.app.listen(this.port, () => {
      console.log(`Servidor express escuchando en http://localhost:${this.port}`);
    });
    this.server.on('error', error => {
      console.log(`Error en servidor: ${error.message}`);
    });

    return this.app;
  }

  async stop() {
    if (this.server) {
      this.server.close(() => {
        console.log('Servidor cerrado');
      });
      if (this.persistencia === 'MONGODB') {
        await CnxMongoDB.desconectar();
      }
      this.server = null;
    }
  }
}

export default Server;
