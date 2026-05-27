import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const userLog = localStorage.getItem('usuario');
        const token = localStorage.getItem('token');
        
        if (userLog && token) {
            try {
                const parsedUser = JSON.parse(userLog);
                setUsuario(parsedUser);
            } catch (e) {
                console.error("Error al parsear el usuario del localStorage", e);
            }
        }
        
        setCargando(false);
    }, []);

    const login = (userData, token) => {
        setUsuario(userData);
        localStorage.setItem('usuario', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
            {!cargando && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};