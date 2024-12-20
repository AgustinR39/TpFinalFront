import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import '../componentes/estilos.css';

function Pedido() {
  const [id, setId] = useState("");
  const [fecha, setFecha] = useState("");
  const [cliente, setCliente] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [pedidosList, setPedidosList] = useState([]);
  const [productosList, setProductosList] = useState([]);
  const [clientesList, setClientesList] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productos = await axios.get("http://localhost:3001/api/producto/el-producto");
        setProductosList(productos.data || []);

        const clientes = await axios.get("http://localhost:3001/api/cliente/usuarios");
        setClientesList(clientes.data || []);

        const pedidos = await axios.get("http://localhost:3001/api/pedido");
        setPedidosList(pedidos.data || []);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productoSeleccionado = productosList.find((prod) => prod.id === parseInt(producto));
    const totalProducto = productoSeleccionado.precioVenta * cantidad;

    const pedidoData = {
      clienteId: cliente,
      saldoTotal: totalProducto,
      fechaCreacion: fecha,
      productoId: productoSeleccionado.id,
      cantidad,
    };

    try {
      if (id) {
        await axios.put(`http://localhost:3001/api/pedido/${id}`, pedidoData);
        alert("Pedido actualizado con éxito");
      } else {
        await axios.post("http://localhost:3001/api/pedido/guardar", pedidoData);
        alert("Pedido guardado con éxito");
      }
      fetchPedidosList();
      limpiarCampos();
    } catch (error) {
      console.error("Error al guardar o actualizar el pedido", error);
    }
  };

  const limpiarCampos = () => {
    setId("");
    setFecha("");
    setCliente("");
    setProducto("");
    setCantidad(1);
    setVisible(false);
  };

  const handleEdit = (pedido) => {
    setId(pedido.id);
    setFecha(pedido.fechaCreacion);
    setCliente(pedido.clienteId);
    setProducto(pedido.productoId);
    setCantidad(pedido.cantidad);
    setVisible(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/pedido/${id}`);
      alert("Pedido eliminado con éxito");
      fetchPedidosList();
      limpiarCampos();
    } catch (error) {
      console.error("Error al eliminar el pedido", error);
    }
  };

  const fetchPedidosList = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/pedido");
      setPedidosList(response.data || []);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
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
                {clientesList.map((cli) => (
                  <option key={cli.id} value={cli.id}>
                    {cli.nombre}
                  </option>
                ))}
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
                {productosList.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.nombre} - {prod.precioVenta}€
                  </option>
                ))}
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

            <button className="btn btn-warning float-end" type="submit">
              <b>{id ? "Actualizar" : "Agregar"}</b>
            </button>
          </form>
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
            {pedidosList.map((pedido) => (
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        className="dialog bg-dark mb-3 p-m-4"
        header="Editar"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={limpiarCampos}
      >
        <form>
          <div className="input-group mb-3">
            <label className="input-group-text">Cliente</label>
            <select
              className="form-control bg-dark-input"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              required
            >
              <option value="">Seleccione...</option>
              {clientesList.map((cli) => (
                <option key={cli.id} value={cli.id}>
                  {cli.nombre}
                </option>
              ))}
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
              {productosList.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.nombre} - {prod.precioVenta}€
                </option>
              ))}
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

          <div className="d-flex justify-content-between">
            <Button
              label="Actualizar"
              icon="pi pi-check"
              onClick={handleSubmit}
              className="btn-actualizar"
            />
            <Button
              label="Eliminar"
              icon="pi pi-trash"
              onClick={handleDelete}
              className="btn-eliminar" 
            />
          </div>
        </form>
      </Dialog>

    </div>
  );
}

export default Pedido;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Dialog } from "primereact/dialog";
// import { Button } from "primereact/button";
// import '../componentes/estilos.css';

// function Pedido() {
//   const [id, setId] = useState("");
//   const [fecha, setFecha] = useState("");
//   const [cliente, setCliente] = useState("");
//   const [producto, setProducto] = useState("");
//   const [cantidad, setCantidad] = useState(1);
//   const [proveedor, setProveedor] = useState("");
//   const [pedidosList, setPedidosList] = useState([]);
//   const [productosList, setProductosList] = useState([]);
//   const [clientesList, setClientesList] = useState([]);
//   const [proveedoresList, setProveedoresList] = useState([]);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const productos = await axios.get("https://tp-production-3bfb.up.railway.app/api/producto/el-producto");
//         setProductosList(productos.data || []);

//         const clientes = await axios.get("https://tp-production-3bfb.up.railway.app/api/cliente/usuarios");
//         setClientesList(clientes.data || []);

//         const proveedores = await axios.get("https://tp-production-3bfb.up.railway.app/api/proveedor/");
//         setProveedoresList(proveedores.data || []);

//         const pedidos = await axios.get("https://tp-production-3bfb.up.railway.app/api/pedido");
//         setPedidosList(pedidos.data || []);
//       } catch (error) {
//         console.error("Error al cargar los datos:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const productoSeleccionado = productosList.find((prod) => prod.id === parseInt(producto));
//     const totalProducto = productoSeleccionado.precioVenta * cantidad;

//     const pedidoData = {
//       clienteId: cliente,
//       proveedorId: proveedor,
//       saldoTotal: totalProducto,
//       fechaCreacion: fecha,
//       productoId: productoSeleccionado.id,
//       cantidad,
//     };

//     try {
//       if (id) {
//         await axios.put("https://tp-production-3bfb.up.railway.app/api/pedido/${id}", pedidoData);
//         alert("Pedido actualizado con éxito");
//       } else {
//         await axios.post("https://tp-production-3bfb.up.railway.app/api/pedido/guardar", pedidoData);
//         alert("Pedido guardado con éxito");
//       }
//       fetchPedidosList();
//       limpiarCampos();
//     } catch (error) {
//       console.error("Error al guardar o actualizar el pedido", error);
//     }
//   };

//   const limpiarCampos = () => {
//     setId("");
//     setFecha("");
//     setCliente("");
//     setProducto("");
//     setCantidad(1);
//     setProveedor("");
//     setVisible(false);
//   };

//   const handleEdit = (pedido) => {
//     setId(pedido.id);
//     setFecha(pedido.fechaCreacion);
//     setCliente(pedido.clienteId);
//     setProducto(pedido.productoId);
//     setCantidad(pedido.cantidad);
//     setProveedor(pedido.proveedorId);
//     setVisible(true);
//   };

//   const handleDelete = async () => {
//     try {
//       await axios.delete("https://tp-production-3bfb.up.railway.app/api/pedido/${id}");
//       alert("Pedido eliminado con éxito");
//       fetchPedidosList();
//       limpiarCampos();
//     } catch (error) {
//       console.error("Error al eliminar el pedido", error);
//     }
//   };

//   const fetchPedidosList = async () => {
//     try {
//       const response = await axios.get("https://tp-production-3bfb.up.railway.app/api/pedido");
//       setPedidosList(response.data || []);
//     } catch (error) {
//       console.error("Error al cargar pedidos:", error);
//     }
//   };

//   return (
//     <div>
//       <div className="card bg-dark border-dark mb-3">
//         <div className="card-header">
//           <h2 className="text-center bg-dark p-2 text-warning">Datos del Pedido</h2>
//         </div>
//         <div className="card-body">
//           <form onSubmit={handleSubmit}>
//             <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
//               <span className="label input-group-text">Cliente</span>
//               <select
//                 className="form-control bg-dark p-2 text-white"
//                 value={cliente}
//                 onChange={(e) => setCliente(e.target.value)}
//                 required
//               >
//                 <option value="">Seleccione...</option>
//                 {clientesList.map((cli) => (
//                   <option key={cli.id} value={cli.id}>
//                     {cli.nombre}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
//               <span className="label input-group-text">Fecha</span>
//               <input
//                 type="date"
//                 className="form-control"
//                 value={fecha}
//                 onChange={(e) => setFecha(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
//               <span className="label input-group-text">Producto</span>
//               <select
//                 className="form-control bg-dark p-2 text-white"
//                 value={producto}
//                 onChange={(e) => setProducto(e.target.value)}
//                 required
//               >
//                 <option value="">Seleccione...</option>
//                 {productosList.map((prod) => (
//                   <option key={prod.id} value={prod.id}>
//                     {prod.nombre} - {prod.precioVenta}€
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
//               <span className="label input-group-text">Proveedor</span>
//               <select
//                 className="form-control bg-dark p-2 text-white"
//                 value={proveedor}
//                 onChange={(e) => setProveedor(e.target.value)}
//                 required
//               >
//                 <option value="">Seleccione...</option>
//                 {proveedoresList.map((prov) => (
//                   <option key={prov.id} value={prov.id}>
//                     {prov.nombre}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
//               <span className="label input-group-text">Cantidad</span>
//               <input
//                 type="number"
//                 className="form-control"
//                 value={cantidad}
//                 onChange={(e) => setCantidad(e.target.value)}
//                 min="1"
//                 required
//               />
//             </div>

//             <button className="btn btn-warning float-end" type="submit">
//               <b>{id ? "Actualizar" : "Agregar"}</b>
//             </button>
//           </form>
//         </div>
//       </div>

//       <div className="card text-bg-dark mb-5">
//         <h2 className="text-center text-warning">Pedidos Registrados</h2>
//         <table className="table table-striped">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Cliente</th>
//               <th>Fecha</th>
//               <th>Producto</th>
//               <th>Proveedor</th>
//               <th>Total</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {pedidosList.map((pedido) => (
//               <tr key={pedido.id}>
//                 <td>{pedido.id}</td>
//                 <td>{pedido.cliente}</td>
//                 <td>{new Date(pedido.fechaCreacion).toLocaleDateString()}</td>
//                 <td>{pedido.producto} - {pedido.cantidad} x {pedido.saldoTotal}€</td>
//                 <td>{pedido.proveedor}</td>
//                 <td>{pedido.saldoTotal}€</td>
//                 <td>
//                   <Button
//                     label="Editar"
//                     icon="pi pi-pencil"
//                     onClick={() => handleEdit(pedido)}
//                     className="btn btn-dark m-2"
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Dialog
//         className="dialog bg-dark mb-3 p-m-4"
//         header="Editar"
//         visible={visible}
//         style={{ width: "50vw" }}
//         onHide={limpiarCampos}
//       >
//         <form>
//           <div className="input-group mb-3">
//             <label className="input-group-text">Cliente</label>
//             <select
//               className="form-control bg-dark-input"
//               value={cliente}
//               onChange={(e) => setCliente(e.target.value)}
//               required
//             >
//               <option value="">Seleccione...</option>
//               {clientesList.map((cli) => (
//                 <option key={cli.id} value={cli.id}>
//                   {cli.nombre}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="input-group mb-3">
//             <label className="input-group-text">Fecha</label>
//             <input
//               type="date"
//               className="form-control bg-dark-input"
//               value={fecha}
//               onChange={(e) => setFecha(e.target.value)}
//               required
//             />
//           </div>

//           <div className="input-group mb-3">
//             <label className="input-group-text">Producto</label>
//             <select
//               className="form-control bg-dark-input"
//               value={producto}
//               onChange={(e) => setProducto(e.target.value)}
//               required
//             >
//               <option value="">Seleccione...</option>
//               {productosList.map((prod) => (
//                 <option key={prod.id} value={prod.id}>
//                   {prod.nombre} - {prod.precioVenta}€
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="input-group mb-3">
//             <label className="input-group-text">Proveedor</label>
//             <select
//               className="form-control bg-dark-input"
//               value={proveedor}
//               onChange={(e) => setProveedor(e.target.value)}
//               required
//             >
//               <option value="">Seleccione...</option>
//               {proveedoresList.map((prov) => (
//                 <option key={prov.id} value={prov.id}>
//                   {prov.nombre}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="input-group mb-3">
//             <label className="input-group-text">Cantidad</label>
//             <input
//               type="number"
//               className="form-control bg-dark-input"
//               value={cantidad}
//               onChange={(e) => setCantidad(e.target.value)}
//               min="1"
//               required
//             />
//           </div>

//           <div className="d-flex justify-content-between">
//             <Button
//               label="Actualizar"
//               icon="pi pi-check"
//               onClick={handleSubmit}
//               className="btn-actualizar"
//             />
//             <Button
//               label="Eliminar"
//               icon="pi pi-trash"
//               onClick={handleDelete}
//               className="btn-eliminar" 
//             />
//           </div>
//         </form>
//       </Dialog>

//     </div>
//   );
// }

// export default Pedido;