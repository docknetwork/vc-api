const fp = require('fastify-plugin');
const cors = require('fastify-cors');

module.exports = fp((fastify, opts, next) => {
  fastify.register(cors);
  next();
});
