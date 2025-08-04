const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  console.log('🔐 Middleware userAuth - URL:', req.url);
  console.log('🔐 Headers recibidos:', req.headers);
  
  const authHeader = req.headers['authorization'];
  console.log('🔐 Authorization header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('🔐 Token extraído:', token ? token.substring(0, 20) + '...' : 'NINGUNO');

  if (!token) {
    console.log('❌ No hay token - enviando 401');
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('✅ Token válido, usuario:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('❌ Token inválido:', error.message);
    return res.status(403).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

module.exports = { authenticateUser };
