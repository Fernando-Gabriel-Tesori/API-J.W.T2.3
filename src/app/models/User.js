import Sequelize, { Model } from "sequelize";
import bcrypt from "bcrypt";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    // antes de mandar dados a serem cadastrados fazendo a criptografia da senha
    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10);
      }
    });

    return this
  }

  // fazendo a comparação da senha com criptografia para poder logar
  async comparePassword(password){
    return await bcrypt.compare(password, this.password_hash)
  }
}

export default User;
