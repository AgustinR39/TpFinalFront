import { Link } from "react-router-dom";
import  '../componentes/estilos.css';


function Navbar() {
  return (
    <div>
      <nav className="d-flex justify-content-center align-item-center ">
        <Link className="navbar Link me-3" to="/producto">
          PRODUCTO
        </Link>
        <Link className="navbar Link me-3" to="/proveedor">
          PROVEEDOR
        </Link>
        <Link className="navbar Link me-3" to="/cliente">
          CLIENTE
        </Link>
        <Link className="navbar Link me-3" to="/catalogo">
          CATÁLOGO
        </Link>
        <Link className="navbar Link me-3" to="/pedido">
          PEDIDO
        </Link>
        <Link className="navbar Link me-3" to="/reportes">
          REPORTES
        </Link>
      </nav>
    </div>
  );
}

export default Navbar;