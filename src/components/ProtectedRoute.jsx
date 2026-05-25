import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { usuario } = useAuth();
  
  // Si no hay usuario, redirige al login
  if (!usuario) {
    return <Navigate to="/login" />;
  }
  
  // Si hay usuario, muestra el contenido (el editor)
  return children;
};