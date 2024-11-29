import { v4 } from "uuid";
import * as Yup from "yup";

import User from "../models/User.js";

class UserController {
  async store(request, response) {
    // fazendo verificação com yup para que antes de ser chamado datasabe
    // para fazer novo cadastro yup verifica shema caso encontra um erro deve intenrromper
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().required().email(),
      password: Yup.string().required().min(6),
      admin: Yup.boolean(),
    });
    // na validação foi colocado abortEarly para não intenrromper e mostra todos os erros
    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    // após validação de dados com yup prossegue aplicação para salvar no banco de dados

    const { name, email, password, admin } = request.body;

    // após os dados mandados estarem de acordo com necessário
    // fazer verificação dentro do database se já tem esse user

    const userExists = await User.findOne({
      where: {
        email,
      },
    });
    if (userExists) {
      return response.status(400).json({ error: "user alreandy exists" });
    }

    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admin,
    });

    return response.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin
    });
  }
}

export default new UserController();
