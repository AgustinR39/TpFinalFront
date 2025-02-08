import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';
import '../componentes/estilos.css';
import { API_BASE_URL } from "../config";

function Pedido() {
  const [id, setId] = useState("");
  const [fecha, setFecha] = useState("");
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [pedidosList, setPedidosList] = useState([]);
  const [productosList, setProductosList] = useState([]);
  const [clientesList, setClientesList] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productos = await axios.get(`${API_BASE_URL}/api/producto/el-producto`);
      setProductosList(productos.data || []);

      const clientes = await axios.get(`${API_BASE_URL}/api/cliente/usuarios`);
      setClientesList(clientes.data || []);

      const pedidos = await axios.get(`${API_BASE_URL}/api/pedido`);
      setPedidosList(pedidos.data || []);
    } catch (error) {
      console.error("❌ Error al cargar los datos:", error);
      alert("Error al cargar la información de pedidos.");
    }
  };

  const handleAgregarProducto = () => {
    const productoSeleccionado = productosList.find((prod) => prod.id === parseInt(producto));
    if (productoSeleccionado && cantidad > 0) {
      setProductosSeleccionados((prevState) => [
        ...prevState,
        {
          productoId: productoSeleccionado.id,
          nombre: productoSeleccionado.nombre,
          cantidad,
          precioVenta: productoSeleccionado.precioVenta
        }
      ]);
      setProducto("");
      setCantidad(1);
    } else {
      alert("Seleccione un producto válido y cantidad mayor a 0.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Array.isArray(productosSeleccionados)) {
      alert("No hay productos seleccionados o hubo un error con los productos.");
      return;
    }

    const saldoTotal = productosSeleccionados.reduce(
      (total, prod) => total + (prod.precioVenta * prod.cantidad),
      0
    );

    const pedidoData = {
      clienteId: cliente,
      fechaCreacion: fecha,
      saldoTotal,
      productos: productosSeleccionados,
    };

    try {
      if (id) {
        await axios.put(`${API_BASE_URL}/api/pedido/${id}`, pedidoData);
        alert("✅ Pedido actualizado con éxito");
      } else {
        await axios.post(`${API_BASE_URL}/api/pedido/guardar`, pedidoData);
        alert("✅ Pedido guardado con éxito");
      }
      fetchData();
      limpiarCampos();
    } catch (error) {
      console.error("❌ Error al guardar o actualizar el pedido:", error);
      alert("Error al procesar el pedido.");
    }
  };

  const limpiarCampos = () => {
    setId("");
    setFecha("");
    setCliente("");
    setProducto("");
    setCantidad(1);
    setProductosSeleccionados([]);
  };

  const handleEdit = (pedido) => {
    setId(pedido.id);
    setFecha(pedido.fechaCreacion);
    setCliente(pedido.clienteId);
    setProductosSeleccionados(pedido.productos || []);
    setVisible(true);
  };

  const handleDelete = async (pedidoId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/pedido/${pedidoId}`);
      alert("✅ Pedido eliminado con éxito");
      fetchData();
    } catch (error) {
      console.error("❌ Error al eliminar el pedido:", error);
      alert("Error al eliminar el pedido");
    }
  };

  return (
    <div>
      <div className="card bg-dark border-dark mb-3">
        <div className="card-header">
          <h2 className="text-center bg-dark p-2 text-warning">Datos del Pedido</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
              <span className="label input-group-text">Cliente</span>
              <select
                className="form-control bg-dark p-2 text-white"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                {Array.isArray(clientesList) && clientesList.length > 0 ? 
                  clientesList.map((cli) => (
                    <option key={cli.id} value={cli.id}>
                      {cli.nombre}
                    </option>
                  )) : <option>No hay clientes disponibles</option>}
              </select>
            </div>

            <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
              <span className="label input-group-text bg-dark p-2 text-white">Fecha</span>
              <input
                type="date"
                className="form-control"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>

            <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
              <span className="label input-group-text">Producto</span>
              <select
                className="form-control bg-dark p-2 text-white"
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                {Array.isArray(productosList) && productosList.length > 0 ? 
                  productosList.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nombre} - {prod.precioVenta}€
                    </option>
                  )) : <option>No hay productos disponibles</option>}
              </select>
            </div>

            <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
              <span className="label input-group-text bg-dark p-2 text-white">Cantidad</span>
              <input
                type="number"
                className="form-control"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                min="1"
                required
              />
            </div>

            <button className="btn btn-warning float-end m-2" type="button" onClick={handleAgregarProducto}>
              <b>Agregar Producto</b>
            </button>

            <button className="btn btn-warning float-end m-2" type="submit">
              <b>{id ? "Actualizar Pedido" : "Crear Pedido"}</b>
            </button>
          </form>

          <h3 className="text-warning">Productos seleccionados</h3>
          <table>
            <thead>
              <tr className="text-white">
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {Array.isArray(productosSeleccionados) && productosSeleccionados.length > 0 ? (
                productosSeleccionados.map((prod, index) => (
                  <tr key={index}>
                    <td>{prod.nombre}</td>
                    <td>{prod.cantidad}</td>
                    <td>{prod.precioVenta}€</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No hay productos seleccionados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card text-bg-dark mb-5">
        <h2 className="text-center text-warning">Pedidos Registrados</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(pedidosList) && pedidosList.length > 0 ? (
              pedidosList.map((pedido) => (
                <tr key={pedido.id}>
                  <td>{pedido.id}</td>
                  <td>{pedido.cliente}</td>
                  <td>{new Date(pedido.fechaCreacion).toLocaleDateString()}</td>
                  <td>{pedido.producto} - {pedido.cantidad} x {pedido.saldoTotal}€</td>
                  <td>{pedido.saldoTotal}€</td>
                  <td>
                    <Button
                      label="Editar"
                      icon="pi pi-pencil"
                      onClick={() => handleEdit(pedido)}
                      className="btn btn-dark m-2"
                    />
                    <Button
                      label="Eliminar"
                      icon="pi pi-trash"
                      onClick={() => handleDelete(pedido.id)}  
                      className="btn btn-warning m-2"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay pedidos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        className="dialog bg-dark mb-3 p-m-4"
        header="Editar Pedido"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => setVisible(false)} 
      >
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <label className="input-group-text">Cliente</label>
            <select
              className="form-control bg-dark-input"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              required
            >
              <option value="">Seleccione...</option>
              {Array.isArray(clientesList) && clientesList.length > 0 ? 
                clientesList.map((cli) => (
                  <option key={cli.id} value={cli.id}>
                    {cli.nombre}
                  </option>
                )) : <option>No hay clientes disponibles</option>}
            </select>
          </div>

          <div className="input-group mb-3">
            <label className="input-group-text">Fecha</label>
            <input
              type="date"
              className="form-control bg-dark-input"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          <div className="input-group mb-3">
            <label className="input-group-text">Producto</label>
            <select
              className="form-control bg-dark-input"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              required
            >
              <option value="">Seleccione...</option>
              {Array.isArray(productosList) && productosList.length > 0 ? 
                productosList.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.nombre} - {prod.precioVenta}€
                  </option>
                )) : <option>No hay productos disponibles</option>}
            </select>
          </div>

          <div className="input-group mb-3">
            <label className="input-group-text">Cantidad</label>
            <input
              type="number"
              className="form-control bg-dark-input"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              min="1"
              required
            />
          </div>

          <button className="btn btn-warning float-end" type="button" onClick={handleAgregarProducto}>
            <b>Agregar Producto</b>
          </button>

          <button className="btn btn-warning float-end m-2" type="submit">
            <b>Actualizar Pedido</b>
          </button>
        </form>
      </Dialog>
    </div>
  );
}

export default Pedido;

