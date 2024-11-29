
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('Products', 'descripition',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
     );
  },

  async down (queryInterface) {
     await queryInterface.removeColumn('Products', 'descripition');
  }
};
