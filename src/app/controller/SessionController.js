import * as Yup from "yup";

import jwt from 'jsonwebtoken'

import authConfig from '../../config/auth.js'
import User from "../models/User.js";

// determinando como front deve enviar dados de logout para api
class SessionController {
  async store(request, response) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    // gerando um erro padrão para quando dados forem incorretos retorna ao fron
    function IsInvalite() {
      return response
        .status(401)
        .json({ error: "Make sure your email or password are correct" });
    }

    // faz a verificação dos dados chegando pelo front,caso esteja incorreto com padrão cai no erro padrão
    const isValid = await schema.isValid(request.body);
    if (!isValid) {
      return IsInvalite();
    }

    // após dados estarem certos acessa o database para verificar se users existe
    const { email, password } = request.body;

    // encontra email valido continua aplicação - errado cai no erro padrão
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      return IsInvalite();
    }

    // encontra senha valida continua aplicação - errado cai no erro padrão
    // lembrando no caso da senha tem q ter await pois prescisa acessar bcrypt que está no controller de user
    const isSamPassword = await user.comparePassword(password);
    if (!isSamPassword) {
      return IsInvalite();
    }

    // caso todas informações estão corretas retorna user para front
    return response.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
