import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { API_BASE_URL } from "../config";

Chart.register(...registerables);

const Reportes = () => {
  const [chartData, setChartData] = useState({
    precios: { labels: [], datasets: [] },
    proveedores: { labels: [], datasets: [] },
  });

  const obtenerProductos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/producto/el-producto`);
      const productos = response.data;

      const labels = productos.map((producto) => producto.nombre);
      const preciosCompra = productos.map((producto) => producto.precioCompra);
      const preciosVenta = productos.map((producto) => producto.precioVenta);

      setChartData((prevData) => ({
        ...prevData,
        precios: {
          labels: labels,
          datasets: [
            {
              label: "Precio de Compra",
              data: preciosCompra,
              backgroundColor: "rgba(255, 255, 255, 0.6)",
            },
            {
              label: "Precio de Venta",
              data: preciosVenta,
              backgroundColor: "rgba(252, 192, 16, 0.6)",
            },
          ],
        },
      }));
    } catch (error) {
      console.error("❌ Error al obtener los productos:", error);
    }
  };

  const obtenerProveedoresMasUtilizados = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/producto/el-producto`);
      const productos = response.data;

      const proveedoresCount = productos.reduce((acc, producto) => {
        acc[producto.proveedor] = (acc[producto.proveedor] || 0) + 1;
        return acc;
      }, {});

      const labels = Object.keys(proveedoresCount);
      const cantidades = Object.values(proveedoresCount);

      setChartData((prevData) => ({
        ...prevData,
        proveedores: {
          labels: labels,
          datasets: [
            {
              label: "Cantidad de Productos por Proveedor",
              data: cantidades,
              backgroundColor: "rgba(252, 192, 16, 0.6)",
            },
          ],
        },
      }));
    } catch (error) {
      console.error("❌ Error al obtener los proveedores más utilizados:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerProveedoresMasUtilizados();
  }, []);

  return (
    <div>
      
      <div className="card bg-dark border-dark mb-4">
        <div className="card-header">
          <h3 className="text-center bg-dark p-2 text-warning">Precios de Productos</h3>
        </div>
        <div className="card-body">
          <Bar
            data={chartData.precios}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    
    <div className="card bg-dark border-dark mb-4">
      <div className="card-header">
        <h3 className="text-center bg-dark p-2 text-warning">
          Proveedores Más Utilizados
        </h3>
      </div>
      <div className="card-body">
        {chartData.proveedores.datasets.length > 0 ? (
          <Bar
            data={chartData.proveedores}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        ) : (
          <p className="text-warning">No hay datos para mostrar</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default Reportes;








