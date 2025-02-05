import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const LogOut = () => {
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Código dentro del useEffect
    const token = localStorage.getItem("firebaseToken");

    if (token) {
      navigate("/protected/");
    }
  }, []);

  const logout = async () => {
    await signOut(auth);

    localStorage.removeItem("firebaseToken");
    navigate("/");
  };

  return (
    <button className="btn btn-dark" onClick={logout}>
      Log Out
    </button>
  );
};