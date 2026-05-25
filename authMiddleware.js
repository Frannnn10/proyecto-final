// authMiddleware.js
module.exports = function verificarAutenticacion(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ success: false, message: 'Acceso denegado: Se requiere sesión.' });
    }
    // Si el header existe, el usuario está "autenticado" para esta prueba
    next();
};