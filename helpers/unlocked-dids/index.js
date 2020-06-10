// hardcoded DIDs for testing
// TODO: load from file
module.exports = [{
  '@context': [
    'https://w3id.org/did/v0.11',
  ],
  id: 'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd',
  publicKey: [
    {
      id: 'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd',
      type: 'Ed25519VerificationKey2018',
      controller: 'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd',
      publicKeyBase58: '5yKdnU7ToTjAoRNDzfuzVTfWBH38qyhE1b9xh4v8JaWF',
      privateKeyBase58: '28xXA4NyCQinSJpaZdSuNBM4kR2GqYb8NPqAtZoGCpcRYWBcDXtzVAzpZ9BAfgV334R2FC383fiHaWWWAacRaYGs',
    },
  ],
  authentication: [
    'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd',
  ],
  assertionMethod: [
    'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd',
  ],
  capabilityDelegation: [
    'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd',
  ],
  capabilityInvocation: [
    'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd',
  ],
  keyAgreement: [
    {
      id: 'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#zC68u6qt8EEiaCuuZKWLQ3hAkrQ6K1BMKuWSerjLCvyCKc',
      type: 'X25519KeyAgreementKey2019',
      controller: 'did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd',
      publicKeyBase58: '6eBPUhK2ryHmoras6qq5Y15Z9pW3ceiQcZMptFQXrxDQ',
    },
  ],
}, {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    'https://docs.element-did.com/contexts/sidetree/sidetree-v0.1.jsonld',
  ],
  publicKey: [
    {
      id: 'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#636uaQJN8FKYI8vD-xIWEPDCsJzBxZfLxho3vzHT7Oc',
      usage: 'signing',
      publicKeyJwk: {
        crv: 'secp256k1',
        y: 'gnUxO29W9_Wglh1aPhQSTaJkv4hJZtfYVEnLP130cLc',
        kid: '636uaQJN8FKYI8vD-xIWEPDCsJzBxZfLxho3vzHT7Oc',
        x: 'qL-z32z8dJycwHgX1th6QTcF9xuveMBrI3Udi4zDQbw',
        kty: 'EC',
      },
      privateKeyJwk: {
        kty: 'EC',
        crv: 'secp256k1',
        d: 'nw77p9FkUk7iwHABaI5aAD4zVwdXbZhM4Dhewwx0eL8',
        x: 'qL-z32z8dJycwHgX1th6QTcF9xuveMBrI3Udi4zDQbw',
        y: 'gnUxO29W9_Wglh1aPhQSTaJkv4hJZtfYVEnLP130cLc',
        kid: '636uaQJN8FKYI8vD-xIWEPDCsJzBxZfLxho3vzHT7Oc',
      },
      type: 'EcdsaSecp256k1VerificationKey2019',
      controller: 'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg',
    },
    {
      publicKeyHex: '03a8bfb3df6cfc749c9cc07817d6d87a413705f71baf78c06b23751d8b8cc341bc',
      privateKeyHex: '9f0efba7d164524ee2c07001688e5a003e335707576d984ce0385ec30c7478bf',
      type: 'EcdsaSecp256k1VerificationKey2019',
      id: 'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#primary',
      usage: 'signing',
      controller: 'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg',
    },
    {
      publicKeyHex: '031c7290fca628a3f88e0f959f8a7f61cca3c43423aab722c231b5259d46c5111c',
      privateKeyHex: 'd08519c4eb2b2e4939a7d2cc162518c2504ca5c3bb2f535aeade7dfb36046127',
      type: 'EcdsaSecp256k1VerificationKey2019',
      id: 'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#recovery',
      usage: 'recovery',
      controller: 'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg',
    },
    {
      type: 'Ed25519VerificationKey2018',
      publicKeyBase58: 'kw41Mbj9jVnNDrrQPMEK6iZzG5cjSjkxmr9u2V6igxL',
      privateKeyBase58: 'CGBNshpXSvtfLLmqzCciiAFrU31VBfDxMDQZqBcKUwYgmSsuozbroEGZTCZWsns95UKUXFdbxrPicaLWAyZPF2U',
      id: 'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#xqc3gS1gz1vch7R3RvNebWMjLvBOY-n_14feCYRPsUo',
      usage: 'signing',
      controller: 'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg',
    },
  ],
  capabilityInvocation: [
    'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#636uaQJN8FKYI8vD-xIWEPDCsJzBxZfLxho3vzHT7Oc',
    'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#primary',
    'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#recovery',
    'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#xqc3gS1gz1vch7R3RvNebWMjLvBOY-n_14feCYRPsUo',
  ],
  authentication: [
    'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#636uaQJN8FKYI8vD-xIWEPDCsJzBxZfLxho3vzHT7Oc',
    'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#primary',
    'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#recovery',
    'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#xqc3gS1gz1vch7R3RvNebWMjLvBOY-n_14feCYRPsUo',
  ],
  capabilityDelegation: [
    'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#636uaQJN8FKYI8vD-xIWEPDCsJzBxZfLxho3vzHT7Oc',
    'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#primary',
    'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#recovery',
    'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#xqc3gS1gz1vch7R3RvNebWMjLvBOY-n_14feCYRPsUo',
  ],
  keyAgreement: [
    {
      type: 'X25519KeyAgreementKey2019',
      publicKeyBase58: 'B84BJgNaP8RbkpatC6Q4KhbQbqsM6Y5rpdL24mYCdv4n',
      privateKeyBase58: '4pPYPDt3AUzDHtkiF6sCzXmBfXxjj3FcVWm14JzWVZFz',
      id: 'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#keyAgreement',
      usage: 'signing',
      controller: 'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg',
    },
  ],
  assertionMethod: [
    'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#636uaQJN8FKYI8vD-xIWEPDCsJzBxZfLxho3vzHT7Oc',
    'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#primary',
    'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#recovery',
    'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg#xqc3gS1gz1vch7R3RvNebWMjLvBOY-n_14feCYRPsUo',
  ],
  id: 'did:elem:ropsten:EiBJJPdo-ONF0jxqt8mZYEj9Z7FbdC87m2xvN0_HAbcoEg',
}, {
  '@context': [
    'https://w3id.org/did/v0.11',
    'https://w3id.org/veres-one/v1',
  ],
  id: 'did:v1:test:nym:z6MkhdmzFu659ZJ4XKj31vtEDmjvsi5yDZG5L7Caz63oP39k',
  authentication: [
    {
      id: 'did:v1:test:nym:z6MkhdmzFu659ZJ4XKj31vtEDmjvsi5yDZG5L7Caz63oP39k#z6MkecaLyHuYWkayBDLw5ihndj3T1m6zKTGqau3A51G7RBf3',
      type: 'Ed25519VerificationKey2018',
      controller: 'did:v1:test:nym:z6MkhdmzFu659ZJ4XKj31vtEDmjvsi5yDZG5L7Caz63oP39k',
      publicKeyBase58: 'AKJP3f7BD6W4iWEQ9jwndVTCBq8ua2Utt8EEjJ6Vxsf',
      privateKeyBase58: '2DVPjoWwWRKEGpU2bJY3ZKdghgUFT8EdcJDKyxWPpSAHXNGGdZhRgHVQxebLxA8amn4AFn7P1oRcREStLVHV1zQD',
    },
  ],
  capabilityInvocation: [
    {
      id: 'did:v1:test:nym:z6MkhdmzFu659ZJ4XKj31vtEDmjvsi5yDZG5L7Caz63oP39k#z6MkhdmzFu659ZJ4XKj31vtEDmjvsi5yDZG5L7Caz63oP39k',
      type: 'Ed25519VerificationKey2018',
      controller: 'did:v1:test:nym:z6MkhdmzFu659ZJ4XKj31vtEDmjvsi5yDZG5L7Caz63oP39k',
      publicKeyBase58: '4BWwfeqdp1obQptLLMvPNgBw48p7og1ie6Hf9p5nTpNN',
      privateKeyBase58: '24Nd9U42cvr8u1DMjheHch2cmBcJvHymazFQprLFczhw6KM6AP66w76mvW7wQatcw7Z63zPrA23jSdC5htpTSc9p',
    },
  ],
  capabilityDelegation: [
    {
      id: 'did:v1:test:nym:z6MkhdmzFu659ZJ4XKj31vtEDmjvsi5yDZG5L7Caz63oP39k#z6Mkw94ByR26zMSkNdCUi6FNRsWnc2DFEeDXyBGJ5KTzSWyi',
      type: 'Ed25519VerificationKey2018',
      controller: 'did:v1:test:nym:z6MkhdmzFu659ZJ4XKj31vtEDmjvsi5yDZG5L7Caz63oP39k',
      publicKeyBase58: 'Hgo9PAmfeoxHG8Mn2XHXamxnnSwPpkyBHAMNF3VyXJCL',
      privateKeyBase58: '463Qjkrt89yPPhxnee5CQc1qfYWKBGZe7f9WfhizgV4ow9f6q42wnX7ntqmMNS2yDDdcnR67G1i9hKwYuZishdvL',
    },
  ],
  assertionMethod: [
    {
      id: 'did:v1:test:nym:z6MkhdmzFu659ZJ4XKj31vtEDmjvsi5yDZG5L7Caz63oP39k#z6MkiukuAuQAE8ozxvmahnQGzApvtW7KT5XXKfojjwbdEomY',
      type: 'Ed25519VerificationKey2018',
      controller: 'did:v1:test:nym:z6MkhdmzFu659ZJ4XKj31vtEDmjvsi5yDZG5L7Caz63oP39k',
      publicKeyBase58: '5TVraf9itbKXrRvt2DSS95Gw4vqU3CHAdetoufdcKazA',
      privateKeyBase58: 'rJ7NgdjV3L4VDn81pJzfjkeufcFJ2oxGr5QrwF8g1SiVahw8Qm6Kqmyo52QhfDFjkjXuu4aWFLTMoTV8WirevqC',
    },
  ],
}];
