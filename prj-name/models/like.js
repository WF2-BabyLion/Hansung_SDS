const Sequelize = require('sequelize');

module.exports = class Likes extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
        UserId:{
          type: Sequelize.STRING(15),
           allowNull: true,
        },
        PostId:{
          type: Sequelize.STRING(15),
          allowNull: true,
        }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Likes',
      tableName: 'likes',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
  }
};
