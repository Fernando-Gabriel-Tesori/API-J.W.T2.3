import Sequelize, { Model } from "sequelize";

class Products extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        price: Sequelize.INTEGER,
        offer: Sequelize.BOOLEAN,
        descripition: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `https://innovative-illumination-production-0226.up.railway.app/products-file/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // fazendo associanção de models entre tabelas
  // pegando chave estrangeira que esta vindo da tabela categorias
  // dizendo que novo nome do campo será category_id
  static associate(models) {
    this.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });
  }
}

export default Products;
