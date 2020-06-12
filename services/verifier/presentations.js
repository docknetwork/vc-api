// Import Dock SDK utils
const { MultiResolver, DockResolver } = require('@docknetwork/sdk/resolver');
const { verifyPresentation } = require('@docknetwork/sdk/utils/vc');
const { DockAPI } = require('@docknetwork/sdk');

// Import helpers
const nodeAddress = require('../../helpers/node-address');
const getCheckType = require('../../helpers/check-type');
const universalResolver = require('../../helpers/universal-resolver');

async function handleVerifyPresentation(request, reply) {
  // Create an instance of the Dock API
  const dock = new DockAPI();
  try {
    // Try connect to the node
    // not required for all verifications but is for some
    await dock.init({
      address: nodeAddress,
    });
  } catch (e) {
    console.error('Connecting to node failed', e);
  }

  // Get options, presentation and create a resolver
  const options = request.body.options || {};
  const { verifiablePresentation } = request.body;
  const { challenge, domain } = options;
  const resolver = new MultiResolver({
    dock: new DockResolver(dock),
  }, universalResolver);

  try {
    // Verify the presentation
    const result = await verifyPresentation(verifiablePresentation, {
      challenge,
      domain,
      resolver,
      compactProof: true,
      forceRevocationCheck: true,
      revocationApi: { dock },
      schemaApi: { dock },
    });

    const credentialResults = result.credentialResults.results;
    const presentationResult = result.presentationResult.results;

    // If verified, populate successful checks
    if (result.verified) {
      const checks = [];
      const results = (presentationResult && presentationResult.length) ? presentationResult : credentialResults;
      results.forEach((result) => {
        checks.push(getCheckType(result));
      });

      reply.send({
        checks,
      });
    } else {
      // Verification failed, populate list of failed checks
      const checks = [];
      const results = (presentationResult && presentationResult.length) ? presentationResult : credentialResults;
      results.forEach((result) => {
        if (!result.verified) {
          checks.push(getCheckType(result));
        }
      });

      reply
        .code(400)
        .send({
          checks,
          error: result.error,
        });
    }
  } catch (e) {
    // Catch any input/sdk errors
    reply
      .code(400)
      .send({
        checks: options.checks || [],
        error: e.message || e,
      });
  }

  // Disconnect from the node
  await dock.disconnect();
}

// Expose route info
module.exports = function (fastify, opts, next) {
  fastify.post('/verifier/presentations', {
    schema: {
      tags: ['v0.0.0'],
      summary: 'Verify a given presentation.',
      body: {
        type: 'object',
        properties: {
          verifiablePresentation: {
            tyoe: 'object',
            example: {
              '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://www.w3.org/2018/credentials/examples/v1',
              ],
              id: 'urn:uuid:2011a95e-ed4a-420f-a2f8-252701e71853',
              type: [
                'VerifiablePresentation',
              ],
              verifiableCredential: [
                {
                  id: 'http://example.edu/credentials/3732',
                  type: [
                    'VerifiableCredential',
                    'UniversityDegreeCredential',
                  ],
                  issuer: 'did:example:c6f1c276e12ec21ebfeb1f712eb',
                  issuanceDate: '2020-03-11',
                  credentialSubject: {
                    id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
                    degree: {
                      type: 'BachelorDegree',
                      name: 'Bachelor of Science and Arts',
                    },
                  },
                  proof: [
                    {
                      type: 'Ed25519Signature2018',
                      created: '2020-03-11T23:09:06.803Z',
                      jws: 'eyJhbGciOiJFZERTQSIsImI2..hS5SPmWTFocjcDg',
                      proofPurpose: 'assertionMethod',
                      verificationMethod: 'did:example:c6f1c276e12ec21ebfeb1f712eb#jf893k',
                    },
                  ],
                },
              ],
              proof: [
                {
                  type: 'Ed25519Signature2018',
                  created: '2020-03-11T23:09:06.984Z',
                  domain: 'example.com',
                  challenge: 'e8944a04-6ded-48e4-ae85-99133f7323fb',
                  jws: 'ey8fdjJ732kKdjw..5SPmWSjcDgTFoch',
                  proofPurpose: 'assertionMethod',
                  verificationMethod: 'did:example:c21ebfeb1f712ebc6f1c276e12e#je83Ks',
                },
              ],
            },
          },
          options: {
            type: 'object',
            properties: {
              checks: { type: 'array' },
              domain: { type: 'string' },
              challenge: { type: 'string' },
              proofPurpose: { type: 'string' },
              verificationMethod: { type: 'string' },
            },
            example: {
              checks: ['proof'],
              domain: 'issuer.example.com',
              challenge: '99612b24-63d9-11ea-b99f-4f66f3e4f81a',
              proofPurpose: 'authentication',
              verificationMethod:
                  'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd',
            },
          },
        },
      },
    },
  }, handleVerifyPresentation);

  next();
};
