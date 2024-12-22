import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import '../componentes/estilos.css';

function Producto() {
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [nombreComercial, setNombreComercial] = useState("");
  const [seleccion, setSeleccion] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [fotoProducto, setFotoProducto] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [productoInfoList, setProductoInfoList] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/proveedor/");
        setProveedores(response.data || []); 
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      }
    };

    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/producto/el-producto");
        setProductoInfoList(response.data || []);
      } catch (error) {
        console.error("Error al cargar productos", error);
      }
    };

    fetchProveedores();
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/producto/el-producto");
      setProductoInfoList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error al cargar productos", error);
    }
  };

  const tallesMap = {
    XS: 1,
    S: 2,
    M: 3,
    L: 4,
    XL: 5,
  };

  const tallesInvertidoMap = {
    1: "XS",
    2: "S",
    3: "M",
    4: "L",
    5: "XL",
  };

  const handleImageChange = (e) => {
    setFotoProducto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const talleSeleccionado = tallesMap[seleccion];

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("nombreComercial", nombreComercial);
    formData.append("seleccion", talleSeleccionado);
    formData.append("precioVenta", precioVenta);
    formData.append("proveedor", proveedor);
    formData.append("precioCompra", precioCompra);
    if (fotoProducto) formData.append("fotoProducto", fotoProducto);

    try {
      if (id) {
        await axios.put(`http://localhost:3001/api/producto/modificar-producto/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Producto actualizado con éxito");
      } else {
        await axios.post("http://localhost:3001/api/producto/guardar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Producto guardado con éxito");
      }
      setProductoInfoList([]);
      await fetchProductos();
      limpiarCampos();
    } catch (error) {
      console.error("Error al guardar o actualizar el producto", error);
    }
  };

  const handleEdit = (producto) => {
    setId(producto.id);
    setNombre(producto.nombre);
    setNombreComercial(producto.nombreComercial);
    setSeleccion(tallesInvertidoMap[producto.seleccion]);
    setPrecioVenta(producto.precioVenta);
    setProveedor(producto.proveedor);
    setPrecioCompra(producto.precioCompra);
    setFotoProducto(producto.fotoProducto);
    setVisible(true);
  };

  const handleEliminarProducto = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/producto/eliminar/${id}`);
      alert("Producto eliminado con éxito");
      setProductoInfoList(productoInfoList.filter((producto) => producto.id !== id));
      setVisible(false);
      await fetchProductos();
      limpiarCampos();
    } catch (error) {
      console.error("Error al eliminar el producto", error);
    }
  };

  const limpiarCampos = () => {
    setId("");
    setNombre("");
    setNombreComercial("");
    setSeleccion("");
    setPrecioVenta("");
    setProveedor("");
    setPrecioCompra("");
    setFotoProducto(null);
    setVisible(false);
    fetchProductos();
  };

  return (
    <div>
      <div className="card bg-dark border-dark mb-3">
        <div className="card-header">
          <h2 className="text-center bg-dark p-2 text-warning">Datos de los productos</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
              <label className="label input-group-text bg-dark p-2 text-white bg-opacity-75">Nombre</label>
              <input
                className="form-control"
                type="text"
                placeholder="Ingrese nombre del producto"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
              <label className="label input-group-text bg-dark p-2 text-white bg-opacity-75">Nombre Comercial</label>
              <input
                className="form-control"
                type="text"
                placeholder="Ingrese nombre comercial"
                value={nombreComercial}
                onChange={(e) => setNombreComercial(e.target.value)}
                required
              />
            </div>
            <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
              <label className="input-group-text">Talle</label>
              <select
                className="form-control bg-dark p-2 text-white"
                value={seleccion}
                onChange={(e) => setSeleccion(e.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                {Object.keys(tallesMap).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
              <label className="label input-group-text bg-dark p-2 text-white bg-opacity-75">Precio Venta</label>
              <input
                className="form-control"
                type="number"
                placeholder="Ingrese precio de venta"
                value={precioVenta}
                onChange={(e) => setPrecioVenta(e.target.value)}
                required
              />
            </div>
            <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
              <label className="input-group-text">Proveedor</label>
              <select
                className="form-control bg-dark p-2 text-white"
                value={proveedor}
                onChange={(e) => setProveedor(e.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                {proveedores && proveedores.length > 0 ? (
                  proveedores.map((prov) => (
                    <option key={prov.id} value={prov.id}>
                      {prov.nombre}
                    </option>
                  ))
                ) : (
                  <option>No hay proveedores disponibles</option>
                )}
              </select>
            </div>
            <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
              <label className="label input-group-text bg-dark p-2 text-white bg-opacity-75">Precio Compra</label>
              <input
                className="form-control"
                type="number"
                placeholder="Ingrese precio de compra"
                value={precioCompra}
                onChange={(e) => setPrecioCompra(e.target.value)}
                required
              />
            </div>
            <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
              <label className="label input-group-text bg-dark p-2 text-white bg-opacity-75">Imagen</label>
              <input
                className="form-control"
                type="file"
                onChange={handleImageChange}
              />
            </div>
            <button className="btn btn-warning float-end" type="submit">
              <b>{id ? "Actualizar" : "Agregar"}</b>
            </button>
          </form>
        </div>
      </div>

      <div className="card text-bg-dark mb-5">
        <h2 className="text-center text-warning">Lista de Productos</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Nombre Comercial</th>
              <th>Talle</th>
              <th>Precio Venta</th>
              <th>Proveedor</th>
              <th>Precio Compra</th>
              <th>Imagen</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {productoInfoList && productoInfoList.length > 0 ? (
              productoInfoList.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.nombreComercial}</td>
                  <td>{tallesInvertidoMap[producto.seleccion]}</td>
                  <td>{producto.precioVenta}</td>
                  <td>{producto.proveedor}</td>
                  <td>{producto.precioCompra}</td>
                  <td>
                    {producto.fotoProducto && (
                      <img
                        src={producto.fotoProducto}
                        alt={`Producto ${producto.id}`}
                        width="100"
                        height="100"
                      />
                    )}
                  </td>
                  <td>
                    <Button
                      label="Editar"
                      icon="pi pi-pencil"
                      onClick={() => handleEdit(producto)}
                      className="btn btn-dark m-2"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9">No hay productos disponibles</td></tr>
            )}
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
            <label className="input-group-text">Nombre</label>
            <input
              type="text"
              className="form-control bg-dark-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="input-group mb-3">
            <label className="input-group-text">Nombre Comercial</label>
            <input
              type="text"
              className="form-control bg-dark-input"
              value={nombreComercial}
              onChange={(e) => setNombreComercial(e.target.value)}
              required
            />
          </div>
          <div className="input-group mb-3">
            <label className="input-group-text">Talle</label>
            <select
              className="form-control bg-dark-input"
              value={seleccion}
              onChange={(e) => setSeleccion(e.target.value)}
              required
            >
              <option value="">Seleccione...</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>
          <div className="input-group mb-3">
            <label className="input-group-text">Precio Venta</label>
            <input
              type="number"
              className="form-control bg-dark-input"
              value={precioVenta}
              onChange={(e) => setPrecioVenta(e.target.value)}
              required
            />
          </div>
          <div className="input-group mb-3">
            <label className="input-group-text">Proveedor</label>
            <select
              className="form-control bg-dark-input"
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              required
            >
              <option value="">Seleccione...</option>
              {proveedores && proveedores.length > 0 ? (
                proveedores.map((prov) => (
                  <option key={prov.id} value={prov.id}>
                    {prov.nombre}
                  </option>
                ))
              ) : (
                <option>No hay proveedores disponibles</option>
              )}
            </select>
          </div>
          <div className="input-group mb-3">
            <label className="input-group-text">Precio Compra</label>
            <input
              type="number"
              className="form-control bg-dark-input"
              value={precioCompra}
              onChange={(e) => setPrecioCompra(e.target.value)}
              required
            />
          </div>
          <div className="input-group mb-3">
            <label className="input-group-text">Imagen</label>
            <input
              type="file"
              className="form-control bg-dark-input"
              onChange={handleImageChange}
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
              onClick={handleEliminarProducto}
              className="btn-eliminar" 
            />
           </div>
        </form>
      </Dialog>
    </div>
  );
}

export default Producto;



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Dialog } from "primereact/dialog";
// import { Button } from "primereact/button";
// import '../componentes/estilos.css';

// function Producto() {
//   const [id, setId] = useState("");
//   const [nombre, setNombre] = useState("");
//   const [nombreComercial, setNombreComercial] = useState("");
//   const [seleccion, setSeleccion] = useState("");
//   const [precioVenta, setPrecioVenta] = useState("");
//   const [proveedor, setProveedor] = useState("");
//   const [precioCompra, setPrecioCompra] = useState("");
//   const [fotoProducto, setFotoProducto] = useState(null);
//   const [proveedores, setProveedores] = useState([]);
//   const [productoInfoList, setProductoInfoList] = useState([]);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const fetchProveedores = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/api/proveedor/");
//         setProveedores(response.data);
//       } catch (error) {
//         console.error("Error al cargar proveedores:", error);
//       }
//     };

//     const fetchProductos = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/api/producto/el-producto");
//         setProductoInfoList(response.data);
//       } catch (error) {
//         console.error("Error al cargar productos", error);
//       }
//     };

//     fetchProveedores();
//     fetchProductos();
//   }, []);

//   const tallesMap = {
//     XS: 1,
//     S: 2,
//     M: 3,
//     L: 4,
//     XL: 5,
//   };

//   const tallesInvertidoMap = {
//     1: "XS",
//     2: "S",
//     3: "M",
//     4: "L",
//     5: "XL",
//   };

//   const handleImageChange = (e) => {
//     setFotoProducto(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const talleSeleccionado = tallesMap[seleccion];

//     const formData = new FormData();
//     formData.append("nombre", nombre);
//     formData.append("nombreComercial", nombreComercial);
//     formData.append("seleccion", talleSeleccionado);
//     formData.append("precioVenta", precioVenta);
//     formData.append("proveedor", proveedor);
//     formData.append("precioCompra", precioCompra);
//     if (fotoProducto) formData.append("fotoProducto", fotoProducto);

//     try {
//       if (id) {
//         await axios.put(`http://localhost:3001/api/producto/modificar-producto/${id}`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("Producto actualizado con éxito");
//       } else {
//         await axios.post("http://localhost:3001/api/producto/guardar", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("Producto guardado con éxito");
//       }
//       setProductoInfoList();
//       limpiarCampos();
//     } catch (error) {
//       console.error("Error al guardar o actualizar el producto", error);
//     }
//   };

//   const handleEdit = (producto) => {
//     setId(producto.id);
//     setNombre(producto.nombre);
//     setNombreComercial(producto.nombreComercial);
//     setSeleccion(tallesInvertidoMap[producto.seleccion]);
//     setPrecioVenta(producto.precioVenta);
//     setProveedor(producto.proveedor);
//     setPrecioCompra(producto.precioCompra);
//     setFotoProducto(producto.fotoProducto);
//     setVisible(true);
//   };

//   const handleEliminarProducto = async () => {
//     try {
//       await axios.delete(`http://localhost:3001/api/producto/eliminar/${id}`);
//       alert("Producto eliminado con éxito");
//       setProductoInfoList(productoInfoList.filter((producto) => producto.id !== id));
//       setVisible(false);
//       limpiarCampos();
//     } catch (error) {
//       console.error("Error al eliminar el producto", error);
//     }
//   };

//   const limpiarCampos = () => {
//     setId("");
//     setNombre("");
//     setNombreComercial("");
//     setSeleccion("");
//     setPrecioVenta("");
//     setProveedor("");
//     setPrecioCompra("");
//     setFotoProducto(null);
//     setVisible(false);
//   };

//   return (
//     <div>
//       <div className="card bg-dark border-dark mb-3">
//         <div className="card-header">
//           <h2 className="text-center bg-dark p-2 text-warning">Datos de los productos</h2>
//         </div>
//         <div className="card-body">
//           <form onSubmit={handleSubmit}>
//             <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
//               <label className="label input-group-text bg-dark p-2 text-white bg-opacity-75">Nombre</label>
//               <input
//                 className="form-control"
//                 type="text"
//                 placeholder="Ingrese nombre del producto"
//                 value={nombre}
//                 onChange={(e) => setNombre(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
//               <label className="label input-group-text bg-dark p-2 text-white bg-opacity-75">Nombre Comercial</label>
//               <input
//                 className="form-control"
//                 type="text"
//                 placeholder="Ingrese nombre comercial"
//                 value={nombreComercial}
//                 onChange={(e) => setNombreComercial(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
//               <label className="input-group-text">Talle</label>
//               <select
//                 className="form-control bg-dark p-2 text-white"
//                 value={seleccion}
//                 onChange={(e) => setSeleccion(e.target.value)}
//                 required
//               >
//                 <option value="">Seleccione...</option>
//                 {Object.keys(tallesMap).map((key) => (
//                   <option key={key} value={key}>
//                     {key}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
//               <label className="label input-group-text bg-dark p-2 text-white bg-opacity-75">Precio Venta</label>
//               <input
//                 className="form-control"
//                 type="number"
//                 placeholder="Ingrese precio de venta"
//                 value={precioVenta}
//                 onChange={(e) => setPrecioVenta(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
//               <label className="input-group-text">Proveedor</label>
//               <select
//                 className="form-control bg-dark p-2 text-white"
//                 value={proveedor}
//                 onChange={(e) => setProveedor(e.target.value)}
//                 required
//               >
//                 <option value="">Seleccione...</option>
//                 {proveedores.map((prov) => (
//                   <option key={prov.id} value={prov.id}>
//                     {prov.nombre}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
//               <label className="label input-group-text bg-dark p-2 text-white bg-opacity-75">Precio Compra</label>
//               <input
//                 className="form-control"
//                 type="number"
//                 placeholder="Ingrese precio de compra"
//                 value={precioCompra}
//                 onChange={(e) => setPrecioCompra(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
//               <label className="label input-group-text bg-dark p-2 text-white bg-opacity-75">Imagen</label>
//               <input
//                 className="form-control"
//                 type="file"
//                 onChange={handleImageChange}
//               />
//             </div>
//             <button className="btn btn-warning float-end" type="submit">
//               <b>{id ? "Actualizar" : "Agregar"}</b>
//             </button>
//           </form>
//         </div>
//       </div>

//       <div className="card text-bg-dark mb-5">
//         <h2 className="text-center text-warning">Lista de Productos</h2>
//         <table className="table table-striped">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Nombre</th>
//               <th>Nombre Comercial</th>
//               <th>Talle</th>
//               <th>Precio Venta</th>
//               <th>Proveedor</th>
//               <th>Precio Compra</th>
//               <th>Imagen</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {productoInfoList.map((producto) => (
//               <tr key={producto.id}>
//                 <td>{producto.id}</td>
//                 <td>{producto.nombre}</td>
//                 <td>{producto.nombreComercial}</td>
//                 <td>{tallesInvertidoMap[producto.seleccion]}</td>
//                 <td>{producto.precioVenta}</td>
//                 <td>{producto.proveedor}</td>
//                 <td>{producto.precioCompra}</td>
//                 <td>
//                   {producto.fotoProducto && (
//                     <img
//                       src={producto.fotoProducto}
//                       alt={`Producto ${producto.id}`}
//                       width="100"
//                       height="100"
//                     />
//                   )}
//                 </td>
//                 <td>
//                   <Button
//                     label="Editar"
//                     icon="pi pi-pencil"
//                     onClick={() => handleEdit(producto)}
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
//             <label className="input-group-text">Nombre</label>
//             <input
//               type="text"
//               className="form-control bg-dark-input"
//               value={nombre}
//               onChange={(e) => setNombre(e.target.value)}
//               required
//             />
//           </div>
//           <div className="input-group mb-3">
//             <label className="input-group-text">Nombre Comercial</label>
//             <input
//               type="text"
//               className="form-control bg-dark-input"
//               value={nombreComercial}
//               onChange={(e) => setNombreComercial(e.target.value)}
//               required
//             />
//           </div>
//           <div className="input-group mb-3">
//             <label className="input-group-text">Talle</label>
//             <select
//               className="form-control bg-dark-input"
//               value={seleccion}
//               onChange={(e) => setSeleccion(e.target.value)}
//               required
//             >
//               <option value="">Seleccione...</option>
//               <option value="XS">XS</option>
//               <option value="S">S</option>
//               <option value="M">M</option>
//               <option value="L">L</option>
//               <option value="XL">XL</option>
//             </select>
//           </div>
//           <div className="input-group mb-3">
//             <label className="input-group-text">Precio Venta</label>
//             <input
//               type="number"
//               className="form-control bg-dark-input"
//               value={precioVenta}
//               onChange={(e) => setPrecioVenta(e.target.value)}
//               required
//             />
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
//               {proveedores.map((prov) => (
//                 <option key={prov.id} value={prov.id}>
//                   {prov.nombre}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="input-group mb-3">
//             <label className="input-group-text">Precio Compra</label>
//             <input
//               type="number"
//               className="form-control bg-dark-input"
//               value={precioCompra}
//               onChange={(e) => setPrecioCompra(e.target.value)}
//               required
//             />
//           </div>
//           <div className="input-group mb-3">
//             <label className="input-group-text">Imagen</label>
//             <input
//               type="file"
//               className="form-control bg-dark-input"
//               onChange={handleImageChange}
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
//               onClick={handleEliminarProducto}
//               className="btn-eliminar" 
//             />
//           </div>
//         </form>
//       </Dialog>
//     </div>
//   );  
// }

// export default Producto;
