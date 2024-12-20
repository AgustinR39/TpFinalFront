import React, { useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./componentes/Navbar";
import Proveedor from "./componentes/Proveedor";
import Producto from "./componentes/Producto";
import Pedido from "./componentes/Pedido";
import Cliente from "./componentes/Cliente";
import Catalogo from "./componentes/Catalogo";
import Reportes from "./componentes/Reportes";
import { Auth } from "./componentes/Auth";



//logo
import logoClick from "./IMG/click.png"; 

function App() {
  return (
    // <div className="miApp">
    //   <div className="container">
    //     <h2 className="d-flex justify-content-center align-item-center pt-3">
    //       Welcome to my page{" "}
    //     </h2>
    <div className='background-app'>
    <div className='container'>
      <div className="logo-container">
        <img src={logoClick} alt="Logo" className="app-logo" />
      </div> 
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth></Auth>}></Route>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <Navbar />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/producto"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Producto></Producto>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/proveedor"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Proveedor></Proveedor>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/cliente"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Cliente></Cliente>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/catalogo"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Catalogo></Catalogo>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/pedido"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Pedido></Pedido>
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/reportes"
              element={
                <ProtectedRoute>
                  <Navbar />
                  <Reportes></Reportes>
                </ProtectedRoute>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
      </div>
      <div className="container-fluid pie-index">
     <footer className="footer">
     <h5>Trabajo Práctico Final: <b>Grupo 2</b>.-</h5>
     <p><i>Integrantes:</i> Artilles, Lautaro;  Cabral, Rodrigo;  Lamarre, Patrice;  Ronchi, Agustín;  Sánchez Rizzotti, Amanda;  Volante, Franco.</p>
     </footer>
    </div>
    </div>
  );
}


const ProtectedRoute = ({ redirectPath = "/", children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("fireBaseToken");

    if (!token) {
      navigate(redirectPath);
    }
  }, []);

  return children;
};

export default App;







//  [navigate, redirectPath]);  // 'navigate' añadido a las dependencias
