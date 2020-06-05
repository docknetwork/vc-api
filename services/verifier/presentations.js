module.exports = function (fastify, opts, next) {
  fastify.post('/verifier/presentations', {
    schema: {
      tags: ['v0.0.0'],
      summary: 'Verification Result',
      body: {
        type: 'object',
        properties: {
          verifiablePresentation: {
            type: 'object',
            example: {
              verifiablePresentation: {
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
  }, async (request, reply) => {
    reply.send('this is an example');
  });

  next();
};
