const jwt = require('jsonwebtoken');

module.exports = function verificarAutenticacion(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    // 1. Verificamos que exista el header y siga el formato "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ success: false, message: 'Acceso denegado: Token no proporcionado o formato inválido.' });
    }

    const token = authHeader.split(' ')[1];
    
    // 2. Seguridad: Verificamos que la clave secreta exista
    if (!process.env.JWT_SECRET) {
        console.error("❌ ERROR: JWT_SECRET no está definido en el archivo .env");
        return res.status(500).json({ success: false, message: 'Error de configuración del servidor.' });
    }
    
    try {
        // 3. Verificación real del token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Inyectamos los datos del usuario en la petición para usarlos después
        req.usuario = payload; 
        next();
    } catch (err) {
        // 5. Manejo de errores (token expirado, firma falsa, etc.)
        return res.status(401).json({ success: false, message: 'Token inválido o expirado.' });
    }
};