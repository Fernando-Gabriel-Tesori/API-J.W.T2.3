import * as Yup from "yup";

import Product from "../models/Products.js";
import Category from "../models/Category.js";
import User from "../models/User.js";

class ProductController {
  async store(request, response) {
    // determinando como front deve enviar dados de logout para api
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
      descripition: Yup.string().required(),
    });
    // na validação foi colocado abortEarly para não intenrromper e mostra todos os erros
    try {
      schema.validateSync(request.body, { abortEarly: false });
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
    const { name, price, category_id, offer, descripition } = request.body;

    const product = await Product.create({
      name,
      price,
      category_id,
      path,
      offer,
      descripition
    });

    return response.status(201).json(product);
  }

  async index(request, response) {
    const products = await Product.findAll({
      // criando esse campo para que no find all vá ate a model product onde está sendo relacionado tabelas
      // indo la trás somentes atributos aolicitados id/name
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    return response.json(products);
  }

  async update(request, response) {
    // determinando como front deve enviar dados de logout para api
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
      descripition: Yup.string(),
    });
    // na validação foi colocado abortEarly para não intenrromper e mostra todos os erros
    try {
      schema.validateSync(request.body, { abortEarly: false });
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
    const findProduct = await Product.findByPk(id);
    if (!findProduct) {
      return response.status(401).json({ error: "Makesure id is correct?" });
    }

    // fazendo verificação se user está atualizando path tbm
    // caso path não existir na atualização não muda valor da variavel
    let path;
    if (request.file) {
      path = request.file.filename;
    }

    // após todas informaços baterem chama database para salvar
    // como segundo parametro informando onde vai ser feito update
    const { name, price, category_id, offer, descripition } = request.body;

    await Product.update(
      {
        name,
        price,
        category_id,
        path,
        offer,
        descripition
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

export default new ProductController();
