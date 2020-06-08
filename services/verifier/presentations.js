// TODO: assign proper schemas for swagger https://github.com/transmute-industries/vc-http-api/blob/master/vc-http-api.yml

// Import Dock SDK utils
const {UniversalResolver} = require('@docknetwork/sdk/resolver');
const {verifyPresentation} = require('@docknetwork/sdk/utils/vc');
const {DockAPI} = require('@docknetwork/sdk');

// Use universal resolver
const universalResolverUrl = 'https://uniresolver.io';
const resolver = new UniversalResolver(universalResolverUrl);

// Hardcoded testnet node address for now, but provide config options in .env later
const nodeAddress = 'wss://testnet-node.dock.io:9950';
// const nodeAddress = 'ws://localhost:9944';

function getCheckType(result) {
  if (result.proof) {
    return 'proof';
  }

  return 'unknown';
}

async function handleVerifyPresentation(request, reply) {
  // const dock = null;
  const dock = new DockAPI();
  try {
    await dock.init({
      address: nodeAddress
    });
  } catch (e) {
    console.error('Connecting to node failed', e);
  }

  const options = request.body.options || {};
  const {verifiablePresentation} = request.body;
  const {challenge, domain} = options;

  console.log('verifiablePresentation', JSON.stringify(verifiablePresentation, null, 2))
  console.log('options', options)

  try {
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

    console.log('result', result);

    if (result.verified) {
      const checks = [];
      if (presentationResult && presentationResult.length) {
        presentationResult.forEach(result => {
          checks.push(getCheckType(result));
        });
      } else {
        credentialResults.forEach(result => {
          checks.push(getCheckType(result));
        });
      }

      reply.send({
        checks,
      });
    } else {
      const failedChecks = [];
      // TODO: build list of failed checks from presentation result and credential result?
      // if (result.credentialResults.verified) {
      //
      // }

      reply
        .code(400)
        .send({
          checks: failedChecks,
          error: result.error
        });
    }

  } catch (e) {
    console.error('server error', e)
    reply
      .code(400)
      .send({
        checks: options.checks || [],
        error: e.message || e
      });
  }

  try {
    await dock.disconnect();
  } catch (e) {
    console.error('Disconnect from node failed', e);
  }
}

module.exports = function (fastify, opts, next) {
  fastify.post('/verifier/presentations', {
    schema: {
      tags: ['v0.0.0'],
      summary: 'Verify a given presentation.',
      // TODO: set proper response schemas
      // response: {
      //   200: {
      //     description: '	The verification was successful.',
      //     type: 'object',
      //     example: {
      //       "checks": [
      //         "proof"
      //       ],
      //     },
      //     properties: {
      //       checks: { type: 'array' },
      //     }
      //   },
      //   400: {
      //     description: 'The verification failed.',
      //     type: 'object',
      //   },
      //   500: {
      //     description: 'Error!',
      //     type: 'object',
      //   }
      // },
      body: {
        type: 'object',
        properties: {
          verifiablePresentation: {
            tyoe: 'object',
            example: {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://www.w3.org/2018/credentials/examples/v1"
              ],
              "id": "urn:uuid:2011a95e-ed4a-420f-a2f8-252701e71853",
              "type": [
                "VerifiablePresentation"
              ],
              "verifiableCredential": [
                {
                  "id": "http://example.edu/credentials/3732",
                  "type": [
                    "VerifiableCredential",
                    "UniversityDegreeCredential"
                  ],
                  "issuer": "did:example:c6f1c276e12ec21ebfeb1f712eb",
                  "issuanceDate": "2020-03-11",
                  "credentialSubject": {
                    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
                    "degree": {
                      "type": "BachelorDegree",
                      "name": "Bachelor of Science and Arts"
                    }
                  },
                  "proof": [
                    {
                      "type": "Ed25519Signature2018",
                      "created": "2020-03-11T23:09:06.803Z",
                      "jws": "eyJhbGciOiJFZERTQSIsImI2..hS5SPmWTFocjcDg",
                      "proofPurpose": "assertionMethod",
                      "verificationMethod": "did:example:c6f1c276e12ec21ebfeb1f712eb#jf893k"
                    }
                  ]
                }
              ],
              "proof": [
                {
                  "type": "Ed25519Signature2018",
                  "created": "2020-03-11T23:09:06.984Z",
                  "domain": "example.com",
                  "challenge": "e8944a04-6ded-48e4-ae85-99133f7323fb",
                  "jws": "ey8fdjJ732kKdjw..5SPmWSjcDgTFoch",
                  "proofPurpose": "assertionMethod",
                  "verificationMethod": "did:example:c21ebfeb1f712ebc6f1c276e12e#je83Ks"
                }
              ]
            }
          },
          options: {
            type: 'object',
            properties: {
              checks: { type: 'array' },
            },
            example: {
              checks: ['proof'],
            },
          },
        },
      },
    },
  }, handleVerifyPresentation);

  next();
};
