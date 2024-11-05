import multer from "multer";

// Configuración del almacenamiento de archivos
const guardar = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads'); // Ruta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    if (file) {
      console.log("Filtramos una imagen con MULTER: " + file.originalname);
      console.log('Tipo de archivo recibido:', file.mimetype); // Ver el tipo de archivo

      const ext = file.originalname.split('.').pop(); // Obtén la extensión del archivo
      cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + ext); // Nombra el archivo con timestamp y un número aleatorio
    } else {
      cb(new Error("El archivo no es válido")); // Manejo de errores si el archivo es nulo
    }
  }
});

const filtro = (req, file, cb) => {
  console.log('Tipo de archivo recibido:', file.mimetype);
  if (file && (file.mimetype === 'image/png' || 
                file.mimetype === 'image/jpeg' || 
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/pjpeg' ||
                file.mimetype === 'video/mp4' ||
                file.mimetype === 'video/x-msvideo' || // avi
                file.mimetype === 'video/x-matroska')) { // mkv
      cb(null, true);
  } else {
      cb(new Error("Tipo de archivo no permitido"), false);
  }
};



// Exporta el middleware de multer
const upload = multer({ 
  storage: guardar, 
  fileFilter: filtro, 
  limits: { fileSize: 50 * 1024 * 1024 } // Limitar el tamaño del archivo a 50 MB
});

export const subirImagen = upload.array('images', 10); // Aquí se llama a array directamente sobre la instancia de multer
