import multer from "multer";

// Configuración de Multer para manejar archivos
const guardar = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads'); // Ruta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    if (file) {
      console.log("Filtramos una imagen con MULTER: " + file.originalname);
      const ext = file.originalname.split('.').pop(); // Obtén la extensión del archivo
      cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + ext);
    } else {
      cb(new Error("El archivo no es válido"));
    }
  }
});

const filtro = (req, file, cb) => {
  if (file && (file.mimetype === 'image/png' || 
                file.mimetype === 'image/jpeg' || 
                file.mimetype === 'image/jpg' ||
                file.mimetype === 'image/pjpeg')) {
      cb(null, true);
  } else {
      cb(new Error("Tipo de archivo no permitido"), false);
  }
};

const upload = multer({
  storage: guardar, 
  fileFilter: filtro, 
  limits: { fileSize: 50 * 1024 * 1024 }
});

// Middleware para filtrar archivos y URLs
export const subirImagen = (req, res, next) => {
  // Verificamos que req.body.images exista y sea un array
  const images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];

  const imagesFiles = [];
  const imageUrls = [];

  // Recorrer cada imagen en el array y separarlas en archivos o URLs
  images.forEach(image => {
    if (typeof image === 'string') {
      // Si es una cadena de texto, es una URL, la agregamos a imageUrls
      imageUrls.push(image);
    } else {
      // Si es un archivo, lo agregamos a imagesFiles
      imagesFiles.push(image);
    }
  });

  // Reemplazamos req.body.images con los archivos
  req.body.images = imagesFiles;

  // Si hay archivos, se procesan con Multer
  if (imagesFiles.length > 0) {
    return upload.array('images', 10)(req, res, () => {
      // Después de procesar los archivos, continuamos con el siguiente middleware
      req.body.originalImages = imageUrls; // Pasamos las URLs como una propiedad adicional
      next();
    });
  } else {
    // Si no hay archivos, pasamos directamente a la siguiente función
    req.body.originalImages = imageUrls; // Solo URLs, las agregamos al cuerpo de la solicitud
    next();
  }
};