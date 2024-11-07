import Servicio from '../servicio/productos.js';
import fs from 'fs';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

class ControladorProductos {
    constructor(persistencia) {
        this.servicio = new Servicio(persistencia);

        cloudinary.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    // Obtener productos (todos o por ID)
    obtenerProductos = async (req, res) => {
        try {
            const { id } = req.params;
            const productos = await this.servicio.obtenerProductos(id);
            res.json(productos);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({ error: 'Error al obtener productos' });
        }
    };



    agregarProducto = async (req, res) => {
        try {
            console.log("Vamos a intentar agregar el producto");
    
            if (!req.body || !req.files) {
                return res.status(400).json({ message: 'Error: no se recibieron datos del producto o imágenes.' });
            }
    
            const { descripcion, categoria, tallesInputs, nombre } = req.body;
            const price = parseFloat(req.body.price); // Asegurarse de que price es un número
            const images = req.files; // Array de imágenes subidas con multer
            console.log("A ver las imagenes che")
            console.log(images)
    
            console.log("Vemos los valores " + nombre + descripcion + categoria + price + tallesInputs + images);
    
            // Validar los datos del producto
            const validacion = validar(nombre + descripcion, categoria, price, images, tallesInputs, 'Y');
            
            // Si la validación es correcta (sin errores)
            if (validacion.length === 0) {
                let imagenesUrls = []; // Asegúrate de inicializar la variable aquí
    
                if (images && images.length > 0) {
                    for (const image of images) {
                        try {
                            let resultadoSubida;
                            if (image.mimetype.startsWith('video/')) {
                                // Manejar subida de video
                                const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB
                                if (image.size > MAX_VIDEO_SIZE) {
                                    return res.status(400).json({ message: 'El video es demasiado grande. El tamaño máximo permitido es de 50 MB.' });
                                }
                                resultadoSubida = await cloudinary.v2.uploader.upload(image.path, { resource_type: "video" });
                            } else {
                                // Manejar subida de imagen
                                resultadoSubida = await cloudinary.v2.uploader.upload(image.path);
                            }
                            imagenesUrls.push(resultadoSubida.secure_url);
                        } catch (uploadError) {
                            console.error('Error al subir archivo:', uploadError);
                            return res.status(500).json({ message: 'Error al subir uno de los archivos.' });
                        }
                    }
                }
    
                // Crear el nuevo producto con las imágenes subidas
                const nuevoProducto = {
                    nombre,
                    descripcion,
                    categoria,
                    images: imagenesUrls, // Guarda el array de URLs de imágenes
                    talles: JSON.parse(tallesInputs), // Asegúrate de convertir a objeto
                    price
                };
                console.log(nuevoProducto);
    
                // Agregar el producto a la base de datos
                const productoAgregado = await this.servicio.agregarProducto(nuevoProducto);
    
                return res.status(200).json({ status: true, message: 'Producto guardado correctamente.', producto: productoAgregado });
            } else {
                return res.status(400).json({ status: false, errors: validacion });
            }
        } catch (error) {
            console.error('Error al agregar producto:', error);
            return res.status(500).json({ error: 'Error al crear el producto' });
        }
    };
    
    
    modificarProducto = async (req, res) => {
        try {
            console.log("Intentando modificar el producto");
    
            // Verificación de que recibimos datos
            if (!req.body || !req.files) {
                return res.status(400).json({ message: 'Error: no se recibieron datos del producto o imágenes.' });
            }
    
            const { descripcion, categoria, tallesInputs, nombre } = req.body;
            const { id } = req.params;
            const price = parseFloat(req.body.price); // Asegúrate de que price es un número
            const newImages = req.files; // Nuevas imágenes subidas con multer
    
            // Validación de los datos
            const validacion = validar(nombre + descripcion, categoria, price, 'Y');
            
            if (validacion.length === 0) {
                let imagenesUrls = [];  // Aquí se almacenarán las URLs de las imágenes
    
                // Si ya tienes imágenes previas en la base de datos, las deberías obtener de algún lugar
                // Ejemplo: const imagenesExistentes = productoAnterior.images || [];
    
                // Manejar las nuevas imágenes: 
                if (newImages && newImages.length > 0) {
                    for (const image of newImages) {
                        try {
                            let resultadoSubida;
                            if (image.mimetype.startsWith('video/')) {
                                const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50 MB
                                if (image.size > MAX_VIDEO_SIZE) {
                                    return res.status(400).json({ message: 'El video es demasiado grande. El tamaño máximo permitido es de 50 MB.' });
                                }
                                resultadoSubida = await cloudinary.v2.uploader.upload(image.path, { resource_type: "video" });
                            } else {
                                console.log("VAMOS A SUBIR LA IMAGENN DE MULTER A CLOUDINARY" , newImages)
                                resultadoSubida = await cloudinary.v2.uploader.upload(image.path);
                                console.log("El url es " + resultadoSubida.secure_url);  // Esto debería imprimir correctamente la URL.

                                
                            }
                            console.log("Pusheamos la url al array..............................")
                            imagenesUrls.push(resultadoSubida.secure_url); // Añadimos la URL de la imagen al array
                            
                        } catch (uploadError) {
                            console.error('Error al subir archivo:', uploadError);
                            return res.status(500).json({ message: 'Error al subir uno de los archivos.' });
                        }
                    }
                }

                console.log("LAS URL QUE HAY POR EL MOMENTO SON " , imagenesUrls)


            console.log("Tipo de req.body.images: " + typeof req.body.images);
            console.log("Contenido de req.body.images: ", req.body.images);
    
                // Aquí manejamos las URLs que ya fueron pasadas como cadenas de texto
if (req.body.images) {
    // Si req.body.images es un string, lo convertimos en un array
    if (typeof req.body.images === 'string') {
        req.body.images = [req.body.images]; // Convertimos la URL en un array
    }
    
    // Ahora verificamos si es un array y procesamos las imágenes
    if (Array.isArray(req.body.images)) {
        console.log("AL MENOS UNA URL HAY");
        req.body.images.forEach(image => {
            if (typeof image === 'string') {
                console.log("UNA URL ES: " + image);
                imagenesUrls.push(image);
            }
        });
    }
}

                console.log("VAMOS A IMPRIMIR TODAS LAS IMAGENES URLSSSSS" , imagenesUrls)
    
                // Crear el objeto del producto con los datos actualizados
                const productoModificado = {
                    nombre,
                    descripcion,
                    categoria,
                    images: imagenesUrls, // Array actualizado de URLs de imágenes
                    talles: JSON.parse(tallesInputs), // Convertir talles a objeto
                    price
                };
                console.log("Producto modificado:", productoModificado);
    
                // Actualizar el producto en la base de datos
                const productoActualizado = await this.servicio.modificarProducto(id, productoModificado);
    
                return res.status(200).json({ status: true, message: 'Producto modificado correctamente.', producto: productoActualizado });
            } else {
                return res.status(400).json({ status: false, errors: validacion });
            }
        } catch (error) {
            console.error('Error al modificar producto:', error);
            return res.status(500).json({ error: 'Error al modificar el producto' });
        }
    };
    
    
    

    borrarProducto = async (req, res) => {
        try {
            const { id } = req.params;
            const productoBorrado = await this.servicio.borrarProducto(id);
            if (!productoBorrado) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.json(productoBorrado);
        } catch (error) {
            console.error('Error al borrar producto:', error);
            res.status(500).json({ error: 'Error al borrar el producto' });
        }
    };
}

const eliminarImagenSiError = (imagen) => {
    if (imagen) {
        try {
            const path = './public/uploads/' + imagen.filename;
            fs.unlinkSync(path);
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
        }
    }
};

const validar = (descripcion, categoria, price, images, seValida) => {
    let errors = [];

    // Validar descripción
    if (descripcion === undefined || descripcion.trim() === '') {
        errors.push('La descripción no debe estar vacía');
    }

    // Validar categoría
    if (categoria === undefined || categoria.trim() === '') {
        errors.push('La categoría no debe estar vacía');
    }

    // Validar precio
    if (price === undefined || isNaN(price) || price <= 0) {
        errors.push('El precio debe ser un número positivo');
    }

    // Validar imágenes solo si se requiere (seValida = 'Y')
    if (seValida === 'Y') {
        if (!images || images.length === 0) {
            errors.push('Selecciona al menos una imagen o video en formato jpg, png o mp4');
        } else {
            // Validar cada imagen o video
            images.forEach(image => {
                if (!['image/jpeg', 'image/png', 'video/mp4'].includes(image.mimetype)) {
                    errors.push('Las imágenes deben estar en formato jpg o png, y los videos en formato mp4');
                }
            });
        }
    }

    return errors;
};



export default ControladorProductos;
