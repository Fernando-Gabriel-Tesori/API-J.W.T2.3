import * as Yup from "yup";


import Category from "../models/Category.js";
import User from "../models/User.js";

class CategoryController {
  async store(request, response) {
    // determinando como front deve enviar dados de logout para api
    const schema = Yup.object({
      name: Yup.string().required(),
    });
    // na validação foi colocado abortEarly para não intenrromper e mostra todos os erros
    try {
      schema.validateSync(request.body);
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    // fazendo validação se usuario é admin para poder alterar categorias
    // indo ate model que está salvo user,busca pelo id indo do request se tem esse user la
    // se propierade admin for correta segue fluxo
    const { admin: isAdmin } = await User.findByPk(request.userId);
    if (!isAdmin) {
      return response.status(401).json();
    }

    const { filename: path } = request.file;

    const { name } = request.body;

    // fazendo validação caso já exista uma category com mesmo nome
    const cccategoryExists = await Category.findOne({
      where: {
        name,
      },
    });
    if (cccategoryExists) {
      return response.status(400).json({ error: "user alreandy exists" });
    }

    const category = await Category.create({
      name,
      path,
    });

    return response.status(201).json(category);
  }

  async index(request, response) {
    const category = await Category.findAll();

    return response.json(category);
  }

  async update(request, response) {
    // determinando como front deve enviar dados de logout para api
    const schema = Yup.object({
      name: Yup.string(),
    });
    // na validação foi colocado abortEarly para não intenrromper e mostra todos os erros
    try {
      schema.validateSync(request.body);
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    // fazendo validação se usuario é admin para poder alterar categorias
    // indo ate model que está salvo user,busca pelo id indo do request se tem esse user la
    // se propierade admin for correta segue fluxo
    const { admin: isAdmin } = await User.findByPk(request.userId);
    if (!isAdmin) {
      return response.status(401).json();
    }

    // fazendo validação se id mandado consta no database antes de seguir
    const { id } = request.params;
    const findProduct = await Category.findByPk(id);
    if (!findProduct) {
      return response.status(401).json({ error: "Make sure id is correct?" });
    }

    // fazendo verificação se user está atualizando path tbm
    // caso path não existir na atualização não muda valor da variavel
    let path;
    if (request.file) {
      path = request.file.filename;
    }

    
    const {name} = request.body


    if (name) {
      // fazendo validação caso já exista uma category com mesmo nome
    const categoryExists = await Category.findOne({
      where: {
        name,
      },
    });
    if (categoryExists && categoryExists.id !== +id) {
      return response.status(400).json({ error: "user alreandy exists" });
    }
    }
    
    

    await Category.update(
      {
        name,
        path,
      },
      {
        where: {
          id,
        },
      }
    );

    return response.status(201).json();
  }
}

export default new CategoryController();
