import jwt from "jsonwebtoken";
import authConfig from "../../config/auth.js";

// fazendo pré definição de onde middllewares irá receber token
function authMiddllewares(request, response, next) {
  const authToken = request.headers.authorization;

  // fazendo verificação caso token não foi enviado
  if (!authToken) {
    return response.status(401).json({ error: "Token invalid" });
  }

  // fazendo separação dentro de um por espaco dentro de um array pra pegar apenas a posição auth
  const validToken = authToken.split(" ").at(1);

  // verifica a poição auth se é valido com .secret dentro do token antes de deixar aplicação seguir com token invalido
  try {
    jwt.verify(validToken, authConfig.secret, (err, decoded) => {
      if (err) {
        throw new Error();
      }

      request.userId = decoded.id;
      request.userName = decoded.name
    });
  } catch (err) {
    return response.status(401).json({ error: err });
  }

  return next();
}

export default authMiddllewares;
