import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Almacena la información del usuario decodificada en el objeto de solicitud
    console.log('Token verificado:', req.user); // Log para depuración

    // Verificación adicional para comprobar la estructura del token decodificado
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Token no contiene información de usuario válida' });
    }

    next();
  } catch (error) {
    console.error("Error al verificar token:", error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export default verifyToken;
