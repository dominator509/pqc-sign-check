import test from 'node:test';
import assert from 'node:assert/strict';
import { newKeys, sign, verify, selfCheck } from './lib.mjs';
test('sign then verify', () => { const k = newKeys(); const s = sign(k.secretKey, 'hi'); assert.equal(verify(k.publicKey, 'hi', s), true); });
test('tampered message fails', () => { const k = newKeys(); const s = sign(k.secretKey, 'hi'); assert.equal(verify(k.publicKey, 'hi!', s), false); });
test('other key fails', () => { const k = newKeys(), o = newKeys(); assert.equal(verify(o.publicKey, 'hi', sign(k.secretKey, 'hi')), false); });
test('malformed input returns false', () => { const k = newKeys(); assert.equal(verify(k.publicKey, 'hi', 'abcd'), false); });
test('selfCheck passes', () => assert.equal(selfCheck().pass, true));
