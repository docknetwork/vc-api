// TODO: assign proper schemas for swagger https://github.com/transmute-industries/vc-http-api/blob/master/vc-http-api.yml

// Import Dock SDK utils
const { DockAPI } = require('@docknetwork/sdk');
const { issueCredential } = require('@docknetwork/sdk/utils/vc');

// Import helpers
const b58 = require('bs58');
const { Ed25519KeyPair } = require('crypto-ld');
const createPair = require('@polkadot/keyring/pair/index').default;
const unlockedDIDs = require('../../helpers/unlocked-dids');

// TOOD: move these methods into sdk
async function getUnlockedVerificationMethod(verificationMethod) {
  let unlockedVerificationMethod;
  Object.values(unlockedDIDs).forEach((didDocument) => {
    const bucket = didDocument.publicKey || didDocument.assertionMethod;
    bucket.forEach((publicKey) => {
      if (publicKey.id === verificationMethod) {
        unlockedVerificationMethod = publicKey;
      }
    });
  });

  // TODO: use SDK resolver to get did doc
  // if (!unlockedVerificationMethod) {
  //   const baseUrl = 'https://uniresolver.io/1.0/identifiers/';
  //   const result = await getJson(baseUrl + verificationMethod);
  //   const { didDocument } = result;
  //   const bucket = didDocument.publicKey || didDocument.assertionMethod;
  //   bucket.forEach(publicKey => {
  //     if (publicKey.id === verificationMethod) {
  //       unlockedVerificationMethod = publicKey;
  //     }
  //   });
  // }

  if (!unlockedVerificationMethod) {
    throw new Error(`Can't find verification method for ${verificationMethod}`);
  }

  return unlockedVerificationMethod;
}

async function getKeyFromVerificationMethod(verificationMethod) {
  if (!verificationMethod) {
    throw new Error('No verificationMethod given');
  }
  switch (verificationMethod.type) {
    case 'Ed25519VerificationKey2018':
      return new Ed25519KeyPair({
        ...verificationMethod,
      });
    default:
      throw new Error(`No Key for: ${verificationMethod.type}`);
  }
};

const getKeyDocFromOptions = async (options) => {
  const vmFromProof = options.verificationMethod || options.assertionMethod;
  const verificationMethod = await getUnlockedVerificationMethod(vmFromProof);
  const key = await getKeyFromVerificationMethod(verificationMethod);
  if (options.issuanceDate) {
    key.date = options.issuanceDate;
  }
  return key;
};

async function handleIssueCredential(request, reply) {
  const { credential } = request.body;
  try {
    const dock = new DockAPI();
    await dock.initKeyring();

    const defaultOptions = {
      issuanceDate: '2019-12-11T03:50:55Z', // TODO: current date in this format
      proofPurpose: 'assertionMethod',
      issuer: 'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd',
      verificationMethod:
          'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd',
    };

    const options = Object.assign(defaultOptions, request.body.options || {});
    if (options.proofPurpose !== 'assertionMethod' && options.proofPurpose !== 'authentication') {
      throw new Error(`${options.proofPurpose} is not a supported proof purpose, must be 'assertionMethod' or 'authentication'`);
    }

    // hack around static interp api
    if (options.assertionMethod) {
      // eslint-disable-next-line
      options.verificationMethod = options.assertionMethod;
    }

    // create and set keypair
    const keyDoc = await getKeyDocFromOptions(options);
    const publicKey = new Uint8Array(b58.decode(keyDoc.publicKeyBase58));
    const secretKey = new Uint8Array(b58.decode(keyDoc.privateKeyBase58));

    // TODO: make sdk method to help with this
    // like dock.createAccountFromKey(keyDoc);
    const pair = createPair({ toSS58: dock.keyring.encodeAddress, type: 'ed25519' }, { publicKey, secretKey });
    keyDoc.keypair = dock.keyring.addPair(pair);

    if (options.issuer && keyDoc.controller !== options.issuer) {
      throw new Error(`Supplied issuer ${options.issuer} did not match key controller (${keyDoc.controller})`);
    }

    const issuedCredential = await issueCredential(keyDoc, credential);

    reply
      .code(201)
      .send(issuedCredential);
  } catch (e) {
    reply
      .code(400)
      .send({ message: e.message });
  }
}

module.exports = function (fastify, opts, next) {
  fastify.post('/credentials/issueCredential', {
    schema: {
      tags: ['v0.0.0'],
      summary: 'Issues a credential and returns it in the response body.',
      body: {
        type: 'object',
        properties: {
          credential: {
            type: 'object',
            example: {
              '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://www.w3.org/2018/credentials/examples/v1',
              ],
              id: 'http://example.gov/credentials/3732',
              type: ['VerifiableCredential', 'UniversityDegreeCredential'],
              issuer:
                  'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd',
              issuanceDate: '2020-03-10T04:24:12.164Z',
              credentialSubject: {
                id:
                    'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd',
                degree: {
                  type: 'BachelorDegree',
                  name: 'Bachelor of Science and Arts',
                },
              },
            },
          },
          options: {
            type: 'object',
            properties: {
              issuer: { oneOf: [{ type: 'string' }, { type: 'object' }] },
              issuanceDate: { type: 'string' },
              assertionMethod: { type: 'string' },
            },
            example: {
              issuanceDate: '2019-12-11T03:50:55Z',
              assertionMethod:
                  'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd',
            },
          },
        },
      },
    },
  }, handleIssueCredential);

  next();
};
