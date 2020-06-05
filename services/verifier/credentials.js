module.exports = function (fastify, opts, next) {
  fastify.get('/verifier/credentials', {
    schema: {
      tags: ['v0.0.0'],
      summary: 'Verification Result',
      body: {
        type: 'object',
        properties: {
          verifiableCredential: {
            type: 'object',
            example: {
              verifiableCredential: {
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
              options: {
                checks: [
                  'proof',
                ],
              },
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
  }, async (request, reply) => {
    reply.send('this is an example');
  });

  next();
};
