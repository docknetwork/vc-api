const credentials = require('./credentials');
const presentations = require('./presentations');

module.exports = function (fastify, opts, next) {
  credentials(fastify, opts, next);
  presentations(fastify, opts, next);
};
