import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import '../componentes/estilos.css';

function Proveedor() {
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [cuit, setCuit] = useState("");

  const [proveedorList, setProveedorList] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchProveedorList = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/proveedor/");
        setProveedorList(response.data);
      } catch (error) {
        console.error("Error al cargar los proveedores:", error);
      }
    };
    fetchProveedorList();
  }, []);

  const handleAddProveedor = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/proveedor/guardar", { nombre, cuit });
      alert("Proveedor guardado con éxito");
      actualizarLista();
      limpiarCampos();
    } catch (error) {
      console.error("Error al guardar el proveedor:", error);
    }
  };

  const handleEditProveedor = async () => {
    try {
      await axios.put(`http://localhost:3001/api/proveedor/modificar-proveedor/${id}`, {
        id,
        nombre,
        cuit,
      });
      alert("Proveedor actualizado con éxito");
      actualizarLista();
      setVisible(false);
      limpiarCampos();
    } catch (error) {
      console.error("Error al actualizar el proveedor:", error);
    }
  };

  const handleEliminarProveedor = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/proveedor/eliminar/${id}`);
      alert("Proveedor eliminado con éxito");
      setProveedorList(proveedorList.filter((proveedor) => proveedor.id !== id));
      setVisible(false);
      limpiarCampos();
    } catch (error) {
      console.error("Error al eliminar el proveedor:", error);
    }
  };

  const actualizarLista = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/proveedor/");
      setProveedorList(response.data);
    } catch (error) {
      console.error("Error al actualizar la lista de proveedores:", error);
    }
  };

  const handleEdit = (proveedor) => {
    setId(proveedor.id);
    setNombre(proveedor.nombre);
    setCuit(proveedor.cuit);
    setVisible(true);
  };

  const limpiarCampos = () => {
    setId("");
    setNombre("");
    setCuit("");
  };

  return (
    <div>
      <div className="card bg-dark border-dark mb-3">
        <div className="card-header">
          <h2 className="text-center bg-dark p-2 text-warning">Datos de los Proveedores</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleAddProveedor}>
            <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
              <label className="label input-group-text bg-dark p-2 text-white">Nombre</label>
              <input
                className="form-control"
                type="text"
                value={nombre}
                placeholder="Ingrese el nombre del Proveedor"
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
              <label className="label input-group-text bg-dark p-2 text-white">CUIT</label>
              <input
                className="form-control"
                type="text"
                value={cuit}
                placeholder="Ingrese el cuit del Proveedor"
                onChange={(e) => setCuit(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-warning float-end" type="submit">
              <b>Agregar</b>
            </button>
          </form>
        </div>
      </div>

      <div className="card text-bg-dark mb-5">
        <h2 className="text-center text-warning">Lista de Proveedores</h2>
        <table className="table table-striped" style={{ minWidth: "50rem" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>CUIT</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {proveedorList.map((proveedor) => (
              <tr key={proveedor.id}>
                <td>{proveedor.id}</td>
                <td>{proveedor.nombre}</td>
                <td>{proveedor.cuit}</td>
                <td>
                  <Button
                    label="Editar"
                    icon="pi pi-pencil"
                    onClick={() => handleEdit(proveedor)}
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
        onHide={() => setVisible(false)}
      >
        <form>
          <div className="input-group mb-3">
            <label className="input-group-text">Nombre</label>
            <input
              type="text"
              className="form-control bg-dark-input"
              value={nombre}
              placeholder="Ingrese el nombre del Proveedor"
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="input-group mb-3">
            <label className="input-group-text">Cuit</label>
            <input
              type="text"
              className="form-control bg-dark-input"
              value={cuit}
              placeholder="Ingrese el cuit del Proveedor"
              onChange={(e) => setCuit(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-between">
            <Button
              label="Actualizar"
              icon="pi pi-check"
              onClick={handleEditProveedor}
              className="btn-actualizar"
            />
            <Button
              label="Eliminar"
              icon="pi pi-trash"
              onClick={handleEliminarProveedor}
              className="btn-eliminar"
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
}

export default Proveedor;
