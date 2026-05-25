import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Registro from './components/Registro';
import Inicio from './components/Inicio';
import Personalizacion from './components/Personalizacion';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { usuario } = useAuth();
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// NUEVO: Componente para manejar la redirección de la raíz
const PublicRoute = ({ children }) => {
  const { usuario } = useAuth();
  // Si NO hay usuario, lo manda al login. Si SÍ hay, le muestra el Inicio.
  return usuario ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Usamos PublicRoute para proteger el acceso a la Landing Page */}
        <Route path="/" element={
          <PublicRoute>
            <Inicio />
          </PublicRoute>
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