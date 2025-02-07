import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { API_BASE_URL } from "../config/config";

// const API_BASE_URL = "http://localhost:3001/api";

function CatalogoProducto() {
  
  const [catalogoList, setCatalogoList] = useState([]);
  const navigate = useNavigate(); 

  const fetchProductos = async () => {

    try {
      const response = await axios.get(`${API_BASE_URL}/producto/el-producto`);
      console.log(response.data);
      setCatalogoList(response.data);
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  
  const irAPedido = () => {
    navigate("/pedido"); 
  };

  return (
    <div className="container">
      <div className="row d-flex justify-content-center align-items-center">
        {catalogoList.map((item) => (
          <div key={item.id} className="col-4">
            <Card
              title={item.nombreComercial}
              subTitle={`US$${item.precioVenta}`}
              footer={
                <>
                  <Button
                    label="Pedir"
                    className="btn btn-warning m-2"
                    icon="pi pi-check"
                    onClick={irAPedido} 
                  />
                </>
              }
              header={
                <img
                  src={`http://localhost:3001/uploads/${item.fotoProducto}`}
                  alt={item.nombre}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              }
              className="w-100 mt-4 shadow-8 surface-card text-center border-round-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatalogoProducto;






