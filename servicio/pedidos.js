import ModelFactory from "../model/DAO/pedidosFactory.js";

class ServicioPedidos {
    constructor(persistencia) {
        this.model = ModelFactory.get(persistencia);
    }

    // Obtener pedidos (por ID o todos)
    obtenerPedidos = async id => {
        console.log("PEDIDOS DEL SERVICIO")
        const pedidos = await this.model.obtenerPedidos(id);
        return pedidos;
    };

    // Agregar un nuevo pedido
    agregarPedido = async pedido => {
        const pedidoAgregado = await this.model.guardarPedido(pedido);
        return pedidoAgregado;
    };

    // Modificar un pedido por ID
    modificarPedido = async (id, pedido) => {
        const pedidoModificado = await this.model.actualizarPedido(id, pedido);
        return pedidoModificado;
    };

    // Borrar un pedido por ID
    borrarPedido = async idPedido => {
        const pedidoBorrado = await this.model.borrarPedido(idPedido);
        return pedidoBorrado;
    };
}

export default ServicioPedidos;
