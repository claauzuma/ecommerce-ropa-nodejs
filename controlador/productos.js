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
            if (!req.body) {
                return res.status(400).json({ message: 'Error: no se recibieron datos del producto.' });
            }
    
            const { descripcion, categoria } = req.body;
            const price = parseFloat(req.body.price);
            const stock = parseInt(req.body.stock);
            const image = req.file; // La imagen subida con multer
    
            console.log("Vemos los valores " + descripcion + categoria + price + stock + image);
    
            // Validar los datos del producto
            const validacion = validar(descripcion, categoria, price, image, stock, 'Y');
    
            if (validacion.length === 0) {
                let imagenUrl = null;
    
                if (image) {
                    const resultadoSubida = await cloudinary.v2.uploader.upload(image.path);
                    imagenUrl = resultadoSubida.secure_url;
                }
    
                const nuevoProducto = {
                    descripcion,
                    categoria,
                    image: imagenUrl,
                    price,
                    stock,
                };
    
                const productoAgregado = await this.servicio.agregarProducto(nuevoProducto);
    
                return res.status(200).json({ status: true, message: 'Producto guardado correctamente.', producto: productoAgregado });
            } else {
                return res.status(400).json({ status: false, errors: validacion });
            }
        } catch (error) {
            console.error('Error al agregar producto:', error);
            res.status(500).json({ error: 'Error al crear el producto' });
        }
    };
    
    modificarProducto = async (req, res) => {
        try {
            console.log("Vamos a modificar el producto");
            const { id } = req.params;
            const productoModificadoData = req.body;
            const image = req.file;
    
            if (productoModificadoData._id) {
                delete productoModificadoData._id;
            }
    
            if (image) {
                const resultadoSubida = await cloudinary.v2.uploader.upload(image.path);
                productoModificadoData.image = resultadoSubida.secure_url;
            }
    
            productoModificadoData.price = parseFloat(productoModificadoData.price);
            productoModificadoData.stock = parseInt(productoModificadoData.stock);
    
            const validacion = validar(
                productoModificadoData.descripcion,
                productoModificadoData.categoria,
                productoModificadoData.price,
                productoModificadoData.image,
                productoModificadoData.stock,
                'N'
            );
    
            if (validacion.length > 0) {
                return res.status(400).json({ status: false, errors: validacion });
            }
    
            const productoModificado = await this.servicio.modificarProducto(id, productoModificadoData);
    
            if (!productoModificado) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
    
            res.json({ status: true, message: 'Producto modificado correctamente.', producto: productoModificado });
        } catch (error) {
            console.error('Error al modificar producto:', error);
            res.status(500).json({ error: 'Error al modificar el producto' });
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

const validar = (descripcion, categoria, price, image, stock, seValida) => {
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

    // Validar stock
    if (stock === undefined || isNaN(stock) || stock < 0) {
        errors.push('El stock no debe estar vacío y debe ser un número positivo');
    }

    // Validar imagen solo si se requiere (seValida = 'Y')
    if (seValida === 'Y') {
        if (!image) {
            errors.push('Selecciona una imagen en formato jpg o png');
        } else if (!['image/jpeg', 'image/png'].includes(image.mimetype)) { // Cambiar a `image.mimetype`
            errors.push('La imagen debe estar en formato jpg o png');
        }
    }

    return errors;
};

export default ControladorProductos;
