// Import Dock SDK utils
const {UniversalResolver} = require('@docknetwork/sdk/resolver');
const {verifyCredential} = require('@docknetwork/sdk/utils/vc');
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

// TODO: assign proper schemas for swagger https://github.com/transmute-industries/vc-http-api/blob/master/vc-http-api.yml
async function handleVerify(request, reply) {
  // const dock = null;
  const dock = new DockAPI();
  try {
    await dock.init({
      address: nodeAddress
    });
  } catch (e) {
    console.error('Connecting to node failed', e);
  }

  const {verifiableCredential, options} = request.body;
  console.log('verifiableCredential', verifiableCredential)
  console.log('options', options)

  try {
    const verifyResult = await verifyCredential(verifiableCredential, {
      resolver,
      compactProof: true,
      forceRevocationCheck: true,
      schemaApi: { dock },
      revocationApi: { dock }
    });

    console.log('verifyResult', verifyResult)

    if (verifyResult.verified) {
      const checks = [];
      if (verifyResult.results) {
        verifyResult.results.forEach(result => {
          checks.push(getCheckType(result));
        });
      }

      reply.send({
        checks,
      });
    } else if (verifyResult.results) {
      const failedCheckes = [];
      verifyResult.results.forEach(result => {
        console.log('result fail: ', result);

        const checkType = getCheckType(result);
        let checkData = {};

        // Proof check
        if (result.proof) {
          checkData.verificationMethod = result.proof.verificationMethod; // set the var to which on efailed?
        }

        failedCheckes.push({
          check: checkType,
          error: result.verified ? undefined : (result.error.message || result.error),
          ...checkData
        });
      });

      reply
        .code(400)
        .send({
          checks: failedCheckes
        });
    } else {
    // console.log('error', verifyResult.error);
      reply
        .code(400)
        .send({
          checks: options.checks || [],
          error: verifyResult.error.message || verifyResult.error
        });
    }
  } catch (e) {
    console.log('server error', e)
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
  fastify.post('/verifier/credentials', {
    schema: {
      tags: ['v0.0.0'],
      summary: 'Verifies a verifiableCredential and returns a verificationResult in the response body.',
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
          verifiableCredential: {
            type: 'object',
            example: {
              '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://www.w3.org/2018/credentials/examples/v1',
              ],
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
            },
          },
        },
      },
    },
  }, handleVerify);

  next();
};
