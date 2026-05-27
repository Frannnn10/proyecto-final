import toast from 'react-hot-toast'; // <--- Importa esto arriba
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/auth.css';

function Registro() {
  const [datos, setDatos] = useState({ nombre: '', correo: '', contrasena: '' });
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {

    // Asegúrate que apunte a /api/registrar y NO a /api/login
    const res = await fetch('/api/registrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos) // Asegúrate que 'datos' tenga nombre, correo y contrasena
});
      const data = await res.json();

      if (data.success) {
      toast.success("¡Cuenta creada con éxito!"); // <--- Pop-up de éxito
      navigate('/login');
    } else {
      toast.error(data.message || "Error al registrarse"); // <--- Pop-up de error
    }
    
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Crear Cuenta</h2>
        <p className="auth-text">Regístrate para comenzar a diseñar</p>
        <form onSubmit={handleRegistro}>
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" placeholder="Tu nombre" onChange={(e) => setDatos({...datos, nombre: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input type="email" placeholder="ejemplo@correo.com" onChange={(e) => setDatos({...datos, correo: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" placeholder="********" onChange={(e) => setDatos({...datos, contrasena: e.target.value})} required />
          </div>
          <button type="submit" className="btn-auth">Registrarse</button>
        </form>
        <p className="toggle-link">¿Ya tienes cuenta? <Link to="/login"><span>Inicia sesión</span></Link></p>
      </div>
    </div>
  );
}

export default Registro;