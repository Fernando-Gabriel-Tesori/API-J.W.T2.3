import * as Yup from "yup";

import Products from "../models/Products.js";
import Category from "../models/Category.js";
import Order from "../schemas/Order.js";
import User from "../models/User.js";


class OrderController {
  async store(request, response) {
    // determinando como front deve enviar dados de logout para api
    const schema = Yup.object().shape({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          })
        ),
    });
    // na validação foi colocado abortEarly para não intenrromper e mostra todos os erros
    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    // buscando item de produto enviado pelo front vindo apenas id e quantity
    const { products } = request.body;

    // buscando apenas a posição id das requisicoes enviadas
    const productsId = products.map((product) => product.id);

    // encontrando denro do database um produto com msm id enviado pelo front
    const findProducts = await Products.findAll({
      where: {
        id: productsId,
      },
      // após encontrar retorna a category tratada para retorna para front
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name"],
        },
      ],
    });

    // formatando o produto a ser retornado para front
    const FormatedProducts = findProducts.map((prod) => {
      // comparando id do item enviado pelo front e comparando com id do banco - apos acrescentar quantity
      const prodIndex = request.body.products.findIndex(
        (item) => item.id === prod.id
      );

      const newProd = {
        id: prod.id,
        name: prod.name,
        category: prod.category.name,
        price: prod.price,
        url: prod.url,
        quantity: products[prodIndex].quantity,
      };

      return newProd;
    });

    const order = {
      user: {
        id: request.userId,
        name: request.userName,
      },
      products: FormatedProducts,
      status: "pedido realizado",
    };

    const createOrder = await Order.create(order);
    return response.status(201).json({ createOrder });
  }

  async index(request, response) {
    const orders = await Order.find();

    return response.json(orders);
  }

  // metodo para alterar order,no caso para mudar status do pedido
  async update(request, response) {
    const schema = Yup.object().shape({
      status: Yup.string().required(),
    });

    // fazendo validação que front está mandando dados para sr atualizado no formato que back espera
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

    // buscando id da order a ser alterada e status que vai ser atualizado
    const { id } = request.params;
    const { status } = request.body;

    // fazendo nova validação que id mandado pelo front existe no database
    try {
      await Order.updateOne({ _id: id }, { status });
    } catch (err) {
      return response.status(401).json({ error: err.message });
    }

    return response.status(200).json({ messagen: "status atualizado" });
  }
}

export default new OrderController();
