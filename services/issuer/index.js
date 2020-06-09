const issueCredential = require('./issue-credential');

module.exports = function (fastify, opts, next) {
  issueCredential(fastify, opts, next);
};
