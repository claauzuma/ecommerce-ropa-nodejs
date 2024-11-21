import Servicio from '../servicio/pedidos.js';

class ControladorPedidos {
    constructor(persistencia) {
        this.servicio = new Servicio(persistencia);
    }

    // Obtener pedidos (todos o por ID)
    obtenerPedidos = async (req, res) => {
        try {
            console.log("BUENO VAMOS A OBTENER TODOS LOS PEDIDOSSSS")
            const { id } = req.params;
            const pedidos = await this.servicio.obtenerPedidos(id);
            res.json(pedidos);
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
            res.status(500).json({ error: 'Error al obtener pedidos' });
        }
    };

    // Agregar un pedido
    agregarPedido = async (req, res) => {
        try {
            if (!req.body) {
                return res.status(400).json({ message: 'Error: no se recibieron datos del pedido.' });
            }
            console.log("Vamos a agregar un pedido")
            console.log("Datos recibidos:", req.body);  // Agrega esta línea

            const { cliente, productos, total, estado, fechaCreacion, horaCreacion} = req.body;
 

            // Validar los datos del pedido
            const validacion = validar(cliente, productos, total, estado);
            if (validacion.length === 0) {
                const nuevoPedido = {
                    cliente,
                    productos,
                    total,
                    estado,
                    fechaCreacion,
                    horaCreacion,
                    
           
                    
                };

                const pedidoAgregado = await this.servicio.agregarPedido(nuevoPedido);

                return res.status(200).json({ status: true, message: 'Pedido guardado correctamente.', pedido: pedidoAgregado });
            } else {
                return res.status(400).json({ status: false, errors: validacion });
            }
        } catch (error) {
            console.error('Error al agregar pedido:', error);
            res.status(500).json({ error: 'Error al crear el pedido' });
        }
    };

    // Modificar un pedido
    modificarPedido = async (req, res) => {
        console.log("Vamos a modificar el pedido")
        try {
            const { id } = req.params;
            const pedidoModificadoData = req.body;

            if (pedidoModificadoData._id) {
                delete pedidoModificadoData._id;
            }

            // Validar los datos del pedido
            const validacion = validar(
                pedidoModificadoData.cliente,
                pedidoModificadoData.productos,
                pedidoModificadoData.total,
                pedidoModificadoData.estado
            );

            if (validacion.length > 0) {
                return res.status(400).json({ status: false, errors: validacion });
            }

            const pedidoModificado = await this.servicio.modificarPedido(id, pedidoModificadoData);

            if (!pedidoModificado) {
                return res.status(404).json({ message: 'Pedido no encontrado' });
            }

            res.json({ status: true, message: 'Pedido modificado correctamente.', pedido: pedidoModificado });
        } catch (error) {
            console.error('Error al modificar pedido:', error);
            res.status(500).json({ error: 'Error al modificar el pedido' });
        }
    };

    // Borrar un pedido
    borrarPedido = async (req, res) => {
        try {
            const { id } = req.params;
            const pedidoBorrado = await this.servicio.borrarPedido(id);
            if (!pedidoBorrado) {
                return res.status(404).json({ message: 'Pedido no encontrado' });
            }
            res.json(pedidoBorrado);
        } catch (error) {
            console.error('Error al borrar pedido:', error);
            res.status(500).json({ error: 'Error al borrar el pedido' });
        }
    };
}

// Validación básica de pedidos
const validar = (cliente, productos, total, estado) => {
    let errors = [];

    return errors;
};

export default ControladorPedidos;
