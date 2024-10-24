import multer from "multer";

// Configuración del almacenamiento de archivos
const guardar = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads'); // Ruta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    // Verifica que file no sea null y tiene que existir
    if (file) {
      const ext = file.originalname.split('.').pop(); // Obtén la extensión del archivo
      cb(null, Date.now() + '.' + ext); // Nombra el archivo con el timestamp y la extensión
    } else {
      cb(new Error("El archivo no es válido")); // Manejo de errores si el archivo es nulo
    }
  }
});

// Filtro para validar tipos de archivo
const filtro = (req, file, cb) => {
  // Verifica que el archivo tenga un tipo de mimetype permitido
  if (file && (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg')) {
    cb(null, true); // Archivo permitido
  } else {
    cb(new Error("Tipo de archivo no permitido"), false); // Manejo de errores si el tipo de archivo no es permitido
  }
};

// Exporta el middleware de subida de imágenes
export const subirImagen = multer({ storage: guardar, fileFilter: filtro });
