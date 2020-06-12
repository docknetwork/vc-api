// Import Dock SDK utils
const { MultiResolver, DockResolver } = require('@docknetwork/sdk/resolver');
const { verifyCredential } = require('@docknetwork/sdk/utils/vc');
const { DockAPI } = require('@docknetwork/sdk');

// Import helpers
const nodeAddress = require('../../helpers/node-address');
const getCheckType = require('../../helpers/check-type');
const universalResolver = require('../../helpers/universal-resolver');

async function handleVerifyCredential(request, reply) {
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

  // Get options, credential and create a resolver
  const options = request.body.options || {};
  const { verifiableCredential } = request.body;
  const resolver = new MultiResolver({
    dock: new DockResolver(dock),
  }, universalResolver);

  try {
    // Verify the credential
    const verifyResult = await verifyCredential(verifiableCredential, {
      resolver,
      compactProof: true,
      forceRevocationCheck: true,
      schemaApi: { dock },
      revocationApi: { dock },
    });

    // If verified, populate successful checks
    if (verifyResult.verified) {
      const checks = [];
      if (verifyResult.results) {
        verifyResult.results.forEach((result) => {
          checks.push(getCheckType(result));
        });
      }

      reply.send({
        checks,
      });
    } else if (verifyResult.results) {
      // Verification failed, populate list of failed checks
      const checks = [];
      verifyResult.results.forEach((result) => {
        if (!result.verified) {
          const checkType = getCheckType(result);
          const checkData = {};
          if (result.proof) {
            checkData.verificationMethod = result.proof.verificationMethod;
          }

          checks.push({
            check: checkType,
            error: result.verified ? undefined : (result.error.message || result.error),
            ...checkData,
          });
        }
      });

      reply
        .code(400)
        .send({
          checks,
        });
    } else {
      // Error happened during verification
      reply
        .code(400)
        .send({
          checks: options.checks || [],
          error: verifyResult.error.message || verifyResult.error,
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
  fastify.post('/verifier/credentials', {
    schema: {
      tags: ['v0.0.0'],
      summary: 'Verifies a verifiableCredential and returns a verificationResult in the response body.',
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
  }, handleVerifyCredential);

  next();
};
