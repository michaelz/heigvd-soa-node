var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    //env = process.env.NODE_ENV || 'development';
    env = 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'woa',
    },
    secret: 'asdf',
    port: 3000,
    db: 'mongodb://localhost/woa-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'woa'
    },
    port: 3000,
    db: 'mongodb://localhost/woa-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'woa'
    },
    port: 3000,
    db: 'mongodb://localhost/woa-production'
  }
};

module.exports = config[env];
