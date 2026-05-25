require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sql = require('mssql'); 
const multer = require('multer');
const verificarAutenticacion = require('./authMiddleware'); // Middleware importado

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ... (Configuración de multer y dbConfig igual que antes) ...

// RUTA PROTEGIDA CON EL MIDDLEWARE
app.post('/api/proyectos', verificarAutenticacion, async (req, res) => {
    try {
        const { tipo, texto, fuente, color, logoSrc, posiciones, fecha_creacion } = req.body;
        const pool = await inicializarBaseDatos();
        
        await pool.request()
            .input('tipo', sql.VarChar, tipo)
            .input('texto', sql.NVarChar, texto)
            .input('fuente', sql.VarChar, fuente)
            .input('color', sql.VarChar, color)
            .input('logoSrc', sql.VarChar, logoSrc)
            .input('posiciones', sql.Text, posiciones) 
            .input('fecha', sql.DateTime, fecha_creacion) // <-- Esta es la clave
            .query(`INSERT INTO ProyectosRopa (tipo, texto, fuente, color, logoSrc, posiciones, fecha_creacion) 
                    VALUES (@tipo, @texto, @fuente, @color, @logoSrc, @posiciones, @fecha)`);

        res.status(200).json({ success: true, message: '¡Diseño guardado!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error al insertar en la BD' });
    }
});

// ... (Resto de tus rutas: /api/upload, /api/registrar, /api/login) ...

app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));