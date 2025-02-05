import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import '../componentes/estilos.css';

function Cliente() {
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [cuit, setCuit] = useState("");
  // const [loading, setLoading] = useState(false);
  const [clienteList, setClienteList] = useState([]);
  const [visible, setVisible] = useState(false);
  // const [editMode, setEditMode] = useState(false);
  // const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/cliente/usuarios");
        setClienteList(response.data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };
    fetchClientes();
  }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const clientData = {
  //     id: id,
  //     nombre: nombre,
  //     cuit: cuit,
  //   };

  //   if (editMode) {
  //     const updatedList = clienteList.map((item, index) =>
  //       index === editingIndex ? clientData : item
  //     );
  //     setClienteList(updatedList);
  //     setEditMode(false);
  //     setEditingIndex(null);
  //   } else {
  //     try {
  //       const response = await axios.post("http://localhost:3001/api/cliente/guardar", { nombre, cuit });
  //       alert("Cliente guardado con éxito");
  //       actualizarLista();
  //       limpiarCampos();
  //     } catch (error) {
  //       console.error("Error al guardar el cliente:", error);
  //     }
  //   }
  // };

  const handleAddCliente = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/cliente/guardar", { nombre, cuit });
      alert("Cliente guardado con éxito");
      actualizarLista();
      limpiarCampos();
    } catch (error) {
      console.error("Error al guardar el cliente:", error);
    }
  };

  const handleEditCliente = async () => {
    try {
      await axios.put(`http://localhost:3001/api/cliente/modificar-cliente/${id}`, {
        id,
        nombre,
        cuit,
      });
      alert("Cliente actualizado con éxito");
      actualizarLista();
      setVisible(false);
      limpiarCampos();
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
    }
  };

  const handleEliminarCliente = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/cliente/eliminar/${id}`);
      alert("Cliente eliminado con éxito");
      setClienteList(clienteList.filter((cliente) => cliente.id !== id));
      setVisible(false);
      limpiarCampos();
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  const actualizarLista = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/cliente/usuarios");
      setClienteList(response.data);
    } catch (error) {
      console.error("Error al actualizar la lista de clientes:", error);
    }
  };

  const handleEdit = (cliente) => {
    setId(cliente.id);
    setNombre(cliente.nombre);
    setCuit(cliente.cuit);
    setVisible(true);
    // setEditMode(true);
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
          <h2 className="text-center bg-dark p-2 text-warning">Datos de los Clientes</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleAddCliente}>
            <div className="input-group mb-3 bg-dark p-2 text-white bg-opacity-75">
              <label className="label input-group-text bg-dark p-2 text-white">Nombre</label>
              <input
                className="form-control"
                type="text"
                value={nombre}
                placeholder="Ingrese el nombre del Cliente"
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
                placeholder="Ingrese el cuit del Cliente"
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
        <h2 className="text-center text-warning">Lista de Clientes</h2>
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
            {clienteList.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.cuit}</td>
                <td>
                  <Button
                    label="Editar"
                    icon="pi pi-pencil"
                    onClick={() => handleEdit(cliente)}
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
              placeholder="Ingrese el nombre del Cliente"
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
              placeholder="Ingrese el cuit del Cliente"
              onChange={(e) => setCuit(e.target.value)}
              required
            />
          </div>
          <div className="d-flex justify-content-between">
            <Button
              label="Actualizar"
              icon="pi pi-check"
              onClick={handleEditCliente}
              className="btn-actualizar"
            />
            <Button
              label="Eliminar"
              icon="pi pi-trash"
              onClick={handleEliminarCliente}
              className="btn-eliminar" 
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
}

export default Cliente;

