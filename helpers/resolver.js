const {UniversalResolver} = require('@docknetwork/sdk/resolver');

// Use universal resolver
const universalResolverUrl = 'https://uniresolver.io';
const resolver = new UniversalResolver(universalResolverUrl);

module.exports = resolver;
