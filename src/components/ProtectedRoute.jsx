import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProtectedRoute = ({ children }) => {
  const { usuario, cargando } = useAuth();

  // Si aún está cargando, no redirijas todavía
  if (cargando) return <div>Cargando...</div>;

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};