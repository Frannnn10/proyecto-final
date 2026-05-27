require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sql = require('mssql'); 
const multer = require('multer');
const jwt = require('jsonwebtoken'); 
const verificarAutenticacion = require('./authMiddleware.cjs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CONFIGURACIÓN BD ---
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: { encrypt: false, trustServerCertificate: true }
};

const inicializarBaseDatos = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        return pool;
    } catch (err) {
        console.error("❌ Error de BD:", err);
        throw err;
    }
};

// --- RUTAS DE API ---

// 1. Registro de usuarios
app.post('/api/registrar', async (req, res) => {
    try {
        const { nombre, correo, contrasena } = req.body;
        
        // Validación básica de seguridad
        if (!nombre || !correo || !contrasena) {
            return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const pool = await inicializarBaseDatos();
        
        // Aquí insertamos el rol explícitamente. 
        // Esto garantiza que el campo nunca sea NULL.
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('correo', sql.VarChar, correo)
            .input('contrasena', sql.VarChar, hashedPassword)
            .input('rol', sql.VarChar, 'cliente') // ROL POR DEFECTO SEGURO
            .query('INSERT INTO Usuarios (nombre, correo, contrasena, rol) VALUES (@nombre, @correo, @contrasena, @rol)');

        res.status(201).json({ success: true, message: 'Usuario registrado con éxito' });
    } catch (err) {
        console.error("Error al registrar:", err);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

// 2. Login
app.post('/api/login', async (req, res) => {
    const { correo, contrasena } = req.body;
    try {
        const pool = await inicializarBaseDatos();
        const result = await pool.request()
            .input('correo', sql.VarChar, correo)
            .query('SELECT * FROM Usuarios WHERE correo = @correo');

        if (result.recordset.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
        }

        const usuario = result.recordset[0];
        const esValida = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!esValida) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.correo }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        return res.json({ 
            success: true, 
            token: token, 
            user: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// 3. Proyectos (Protegida)
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
            .input('fecha', sql.DateTime, fecha_creacion)
            .query(`INSERT INTO ProyectosRopa (tipo, texto, fuente, color, logoSrc, posiciones, fecha_creacion) 
                    VALUES (@tipo, @texto, @fuente, @color, @logoSrc, @posiciones, @fecha)`);

        res.status(200).json({ success: true, message: '¡Diseño guardado!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error al insertar en la BD' });
    }
});

// --- UNIFICACIÓN FRONTEND ---
app.use(express.static(path.join(__dirname, 'dist')));

app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));