// TODO: assign proper schemas for swagger https://github.com/transmute-industries/vc-http-api/blob/master/vc-http-api.yml
const { randomAsHex } = require('@polkadot/util-crypto');

// Import Dock SDK utils
const { DockAPI } = require('@docknetwork/sdk');
const { issueCredential } = require('@docknetwork/sdk/utils/vc');
const { createNewDockDID } = require('@docknetwork/sdk/utils/did');

const getKeyDoc = require('@docknetwork/sdk/utils/vc/helpers');

// Import helpers
const nodeAddress = require('../../helpers/node-address');



const { createKeyDetail } = require('@docknetwork/sdk/utils/did');
const { getPublicKeyFromKeyringPair } = require('@docknetwork/sdk/utils/misc');


async function registerNewDIDUsingPair(dockAPI, did, pair) {
  const publicKey = getPublicKeyFromKeyringPair(pair);

  // The controller is same as the DID
  const keyDetail = createKeyDetail(publicKey, did);
  const transaction = dockAPI.did.new(did, keyDetail);
  return dockAPI.sendTransaction(transaction);
}

// TODO: load form env
const TestAccountURI = '//Alice';

// TODO: support all options in schema
async function handleIssueCredential(request, reply) {
  const dock = new DockAPI();
  try {
    await dock.init({
      address: nodeAddress,
    });
  } catch (e) {
    console.error('Connecting to node failed', e);
  }

  const { credential, options } = request.body;
    console.log('handleIssueCredential', credential, options);


// The keyring should be initialized before any test begins as this suite is testing revocation
const account = dock.keyring.addFromUri(TestAccountURI);
dock.setAccount(account);

// test create random did/seed
// const issuer1DID = createNewDockDID();
// const issuer1KeySeed = randomAsHex(32);

const issuer1DID = 'did:dock:5E1TUtdePxgdU5nxoRbQS5uq3VwTt1LNZHxiRf2tER5Cptwr'; // this should be passed in credential options.issuer?
const issuer1KeySeed = '0x7dba80e630fc0a27bcd6ffb67ef4f464745c102a0b1800b74f8725f6dc432c21';

// get pair
const pair1 = dock.keyring.addFromUri(issuer1KeySeed, null, 'ed25519');

// create DID with ed25519 key, test
// await registerNewDIDUsingPair(dock, issuer1DID, pair1);

    console.log('using did', issuer1DID)
    console.log('using ed25519 key', issuer1KeySeed)




  const issuerKey = getKeyDoc(issuer1DID, pair1, 'Ed25519VerificationKey2018');


  // issueCredential sets issuer to controller value

  // need to get suite and/or keydoc from options provided, see:
  // https://github.com/transmute-industries/vc.transmute.world/blob/master/src/services/suiteManager.js#L65
  // https://github.com/transmute-industries/vc.transmute.world/blob/master/src/services/agent.js#L32
  // right now sdk only supports getting suite from keydoc which is got from the raw key data

  const issuedCredential = await issueCredential(issuerKey, credential);
  console.log('issuedCredential', issuedCredential)

  reply.send({
    test: 'handleIssueCredential',
    credential,
    options,
    issuedCredential,
    issuer1DID,
    issuer1KeySeed,
  });

  try {
    await dock.disconnect();
  } catch (e) {
    console.error('Disconnect from node failed', e);
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
