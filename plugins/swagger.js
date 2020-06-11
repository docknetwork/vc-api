const fp = require('fastify-plugin');
const swagger = require('fastify-swagger');

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope
module.exports = fp((fastify, opts, next) => {
  fastify.register(swagger, {
    routePrefix: '/api/docs',
    swagger: {
      info: {
        title: 'Dock VC HTTP API',
        description: 'Dock\'s implementation of the [w3c verifier api](https://github.com/w3c-ccg/vc-verifier-http-api) and the [w3c issuer api](https://github.com/w3c-ccg/vc-issuer-http-api), a HTTP API for the Verifiable Credentials Data Model.',
        version: '0.0.0',
        license: {
          name: 'W3C verifier API',
          url: 'https://github.com/w3c-ccg/vc-verifier-http-api',
        },
        contact: {
          name: 'GitHub Source Code',
          url: 'https://github.com/docknetwork/dock-vc-api',
        },
      },
      basePath: '',
    },
    exposeRoute: true,
  });

  next();
});
