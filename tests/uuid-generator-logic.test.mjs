import assert from 'node:assert/strict';
import { clampUuidQuantity, createUuidV4, formatUuidList, generateUuids, isUuidV4 } from '../scripts/logic/uuid-generator.js';

assert.equal(clampUuidQuantity('0'), 1);
assert.equal(clampUuidQuantity('2.9'), 2);
assert.equal(clampUuidQuantity('1001'), 1000);
assert.equal(clampUuidQuantity('not-a-number'), 1);

let offset = 0;
const deterministicCrypto = {
  getRandomValues(bytes) {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = (offset + index) & 255;
    }
    offset += bytes.length;
    return bytes;
  }
};

const uuid = createUuidV4(deterministicCrypto);
assert.equal(isUuidV4(uuid), true);
assert.equal(uuid[14], '4');
assert.equal(['8', '9', 'a', 'b'].includes(uuid[19]), true);

const uuids = generateUuids(3, deterministicCrypto);
assert.equal(uuids.length, 3);
assert.equal(uuids.every(isUuidV4), true);
assert.equal(formatUuidList(uuids).split(String.fromCharCode(10)).length, 3);

assert.throws(() => createUuidV4({}), /Secure random generation is unavailable/);

console.log('UUID Generator logic tests passed.');
