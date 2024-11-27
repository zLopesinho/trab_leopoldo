const jwt = require("jsonwebtoken");

const SECRET_KEY = "andre";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = payload;
    next();
  } catch (error) {
    console.error("Erro na verificação do token:", error);
    return res.status(403).json({ message: "Token inválido ou expirado." });
  }
};

module.exports = authenticateToken;
