// TODO: assign proper schemas for swagger https://github.com/transmute-industries/vc-http-api/blob/master/vc-http-api.yml
const { randomAsHex } = require('@polkadot/util-crypto');

// Import Dock SDK utils
const { DockAPI } = require('@docknetwork/sdk');
const { issueCredential } = require('@docknetwork/sdk/utils/vc');
const { createNewDockDID } = require('@docknetwork/sdk/utils/did');

const getKeyDoc = require('@docknetwork/sdk/utils/vc/helpers');

// Import helpers
const nodeAddress = require('../../helpers/node-address');

const createPair = require('@polkadot/keyring/pair/index').default;

const b58 = require('bs58');

const { createKeyDetail } = require('@docknetwork/sdk/utils/did');


// hardcoded DIDs for testing
const unlockedDIDs = [{
    "@context": [
        "https://w3id.org/did/v0.11"
    ],
    "id": "did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd",
    "publicKey": [
        {
            "id": "did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd",
            "type": "Ed25519VerificationKey2018",
            "controller": "did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd",
            "publicKeyBase58": "5yKdnU7ToTjAoRNDzfuzVTfWBH38qyhE1b9xh4v8JaWF",
            "privateKeyBase58": "28xXA4NyCQinSJpaZdSuNBM4kR2GqYb8NPqAtZoGCpcRYWBcDXtzVAzpZ9BAfgV334R2FC383fiHaWWWAacRaYGs"
        }
    ],
    "authentication": [
        "did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd"
    ],
    "assertionMethod": [
        "did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd"
    ],
    "capabilityDelegation": [
        "did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd"
    ],
    "capabilityInvocation": [
        "did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd"
    ],
    "keyAgreement": [
        {
            "id": "did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#zC68u6qt8EEiaCuuZKWLQ3hAkrQ6K1BMKuWSerjLCvyCKc",
            "type": "X25519KeyAgreementKey2019",
            "controller": "did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd",
            "publicKeyBase58": "6eBPUhK2ryHmoras6qq5Y15Z9pW3ceiQcZMptFQXrxDQ"
        }
    ]
}];







// TOOD: move these methods into sdk
const getUnlockedVerificationMethod = async verificationMethod => {
  let unlockedVerificationMethod;
  Object.values(unlockedDIDs).forEach(didDocument => {
    const bucket = didDocument.publicKey || didDocument.assertionMethod;
    bucket.forEach(publicKey => {
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
};

const { Ed25519KeyPair } = require('crypto-ld');

const getKeyFromVerificationMethod = async verificationMethod => {
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

const getKeyDocFromOptions = async options => {
  const vmFromProof = options.verificationMethod || options.assertionMethod;
  const verificationMethod = await getUnlockedVerificationMethod(vmFromProof);
  const key = await getKeyFromVerificationMethod(verificationMethod);
  if (options.issuanceDate) {
    key.date = options.issuanceDate;
  }
  return key;
};

// TODO: support all options in schema
async function handleIssueCredential(request, reply) {
  const { credential } = request.body;

  console.log('credential', JSON.stringify(credential, null, 2))
  console.log('options', JSON.stringify(request.body.options, null, 2))

  try {
    const dock = new DockAPI();
    await dock.initKeyring();

    // defualt options if none provided, rquired by test
    const options = Object.assign({
      issuanceDate: '2019-12-11T03:50:55Z',
      proofPurpose: 'assertionMethod',
      verificationMethod:
          'did:web:vc.transmute.world#z6MksHh7qHWvybLg5QTPPdG2DgEjjduBDArV9EF9mRiRzMBN',
    }, request.body.options || {});

    // TODO: check if options.issuer is even used, doesnt sem to be needed when passing methods?

    // hack around static interp api
    if (options.assertionMethod) {
      // eslint-disable-next-line
      options.verificationMethod = options.assertionMethod;
    }

    if (!options.proofPurpose) {
      options.proofPurpose = 'assertionMethod';
    }

    const keyDoc = await getKeyDocFromOptions(options);

    // create and set keypair
    const publicKey = new Uint8Array(b58.decode(keyDoc.publicKeyBase58));
    const secretKey = new Uint8Array(b58.decode(keyDoc.privateKeyBase58));
    const encoded = undefined;
    const meta = null;

    const pair = createPair({ toSS58: dock.keyring.encodeAddress, type: 'ed25519' }, { publicKey, secretKey }, meta, encoded);
    keyDoc.keypair = dock.keyring.addPair(pair);

    const issuedCredential = await issueCredential(keyDoc, credential);

    reply
      .code(201)
      .send(issuedCredential);
  } catch (e) {
    console.error(e);
    reply
      .code(400)
      .send({ message: e.message });
  }
}

const routeMetadata = {
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
};

module.exports = function (fastify, opts, next) {
  fastify.post('/credentials/issueCredential', {
    schema: {
      tags: ['v0.0.0'],
      summary: 'Issues a credential and returns it in the response body.',
      body: routeMetadata,
    },
  }, handleIssueCredential);

  fastify.post('/issue/credentials', {
    schema: {
      tags: ['v0.1.0'],
      summary: 'Issues a credential and returns it in the response body.',
      body: routeMetadata,
    },
  }, handleIssueCredential);


  next();
};
