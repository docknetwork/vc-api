// Import Dock SDK utils
const { MultiResolver, DockResolver } = require('@docknetwork/sdk/resolver');
const { verifyCredential } = require('@docknetwork/sdk/utils/vc');
const { DockAPI } = require('@docknetwork/sdk');

// Import helpers
const nodeAddress = require('../../helpers/node-address');
const getCheckType = require('../../helpers/check-type');
const universalResolver = require('../../helpers/universal-resolver');

async function handleVerifyCredential(request, reply) {
  const dock = new DockAPI();
  try {
    await dock.init({
      address: nodeAddress,
    });
  } catch (e) {
    console.error('Connecting to node failed', e);
  }

  const options = request.body.options || {};
  const { verifiableCredential } = request.body;
  const resolver = new MultiResolver({
    dock: new DockResolver(dock),
  }, universalResolver);

  try {
    const verifyResult = await verifyCredential(verifiableCredential, {
      resolver,
      compactProof: true,
      forceRevocationCheck: true,
      schemaApi: { dock },
      revocationApi: { dock },
    });

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
      const failedChecks = [];
      verifyResult.results.forEach((result) => {
        if (!result.verified) {
          const checkType = getCheckType(result);
          const checkData = {};

          // Proof check
          if (result.proof) {
            checkData.verificationMethod = result.proof.verificationMethod;
          }

          failedChecks.push({
            check: checkType,
            error: result.verified ? undefined : (result.error.message || result.error),
            ...checkData,
          });
        }
      });

      reply
        .code(400)
        .send({
          checks: failedChecks,
        });
    } else {
      reply
        .code(400)
        .send({
          checks: options.checks || [],
          error: verifyResult.error.message || verifyResult.error,
        });
    }
  } catch (e) {
    reply
      .code(400)
      .send({
        checks: options.checks || [],
        error: e.message || e,
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
