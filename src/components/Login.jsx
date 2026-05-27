import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast'; // IMPORTANTE: Esto es lo que reemplaza al alert
import '../css/auth.css';

function Login() {
  const [datos, setDatos] = useState({ correo: '', contrasena: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {

    const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
});
      const data = await res.json();

      if (data.success) {
        // Pasamos el usuario y el token que viene del servidor
        login(data.user, data.token); 
        toast.success("Bienvenido");
        navigate('/');
      } else {
        toast.error(data.message || "Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error: " + error.message); 
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Iniciar Sesión</h2>
        <p className="auth-text">Ingresa tus datos para continuar</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" onChange={(e) => setDatos({...datos, correo: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" onChange={(e) => setDatos({...datos, contrasena: e.target.value})} required />
          </div>
          <button type="submit" className="btn-auth">Entrar a la Tienda</button>
        </form>
        <p className="toggle-link">¿No tienes cuenta? <Link to="/registro"><span>Regístrate aquí</span></Link></p>
      </div>
    </div>
  );
}
export default Login;