import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Registro from './components/Registro';
import Inicio from './components/Inicio';
import Personalizacion from './components/Personalizacion';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { usuario, cargando } = useAuth();
  
  // Si todavía está leyendo el localStorage, no hacemos nada (o mostramos un spinner)
  if (cargando) return <div>Cargando sesión...</div>; 
  
  // Si terminó de cargar y no hay usuario, redirigimos
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { usuario, cargando } = useAuth();
  
  if (cargando) return <div>Cargando...</div>;
  
  // Corregido: Si hay usuario, normalmente irías a Inicio, no al login
  return usuario ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Inicio />
          </ProtectedRoute>
        } />
        
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        
        <Route 
          path="/personalizacion" 
          element={
            <ProtectedRoute>
              <Personalizacion />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;