const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');
const Likes =  require('./like.js');
const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;
db.Likes = Likes;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);
Likes.init(sequelize);
User.associate(db);
Post.associate(db);
Hashtag.associate(db);
Likes.associate(db)

module.exports = db;
