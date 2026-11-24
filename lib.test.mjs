import test from 'node:test';
import assert from 'node:assert/strict';
import { newKeys, sign, verify, selfCheck, fingerprint } from './lib.mjs';
test('sign then verify', () => { const k = newKeys(); const s = sign(k.secretKey, 'hi'); assert.equal(verify(k.publicKey, 'hi', s), true); });
test('tampered message fails', () => { const k = newKeys(); const s = sign(k.secretKey, 'hi'); assert.equal(verify(k.publicKey, 'hi!', s), false); });
test('other key fails', () => { const k = newKeys(), o = newKeys(); assert.equal(verify(o.publicKey, 'hi', sign(k.secretKey, 'hi')), false); });
test('malformed input returns false', () => { const k = newKeys(); assert.equal(verify(k.publicKey, 'hi', 'abcd'), false); });
test('selfCheck passes', () => assert.equal(selfCheck().pass, true));
test('malformed hex never verifies', () => {
  const k = newKeys(), s = sign(k.secretKey, 'hi');
  for (const bad of ['', 'zz', 'abc', 'not hex at all', null, undefined]) {
    assert.equal(verify(k.publicKey, 'hi', bad), false);
    assert.equal(verify(bad, 'hi', s), false);
  }
});
test('sign rejects malformed secret key', () => {
  for (const bad of ['', 'xyz', 'abc', '12']) assert.throws(() => sign(bad, 'hi'));
});
test('a flipped byte anywhere in the signature fails', () => {
  const k = newKeys(), s = sign(k.secretKey, 'hi');
  for (const i of [0, 1, 100, s.length / 4, s.length / 2 - 1]) {
    const pos = Math.floor(i) * 2;
    const flipped = s.slice(0, pos) + (s.slice(pos, pos + 2) === 'ff' ? '00' : 'ff') + s.slice(pos + 2);
    assert.equal(verify(k.publicKey, 'hi', flipped), false);
  }
});
test('truncated or extended signature fails', () => {
  const k = newKeys(), s = sign(k.secretKey, 'hi');
  assert.equal(verify(k.publicKey, 'hi', s.slice(0, -2)), false);
  assert.equal(verify(k.publicKey, 'hi', s + '00'), false);
});
test('empty and unicode messages round trip', () => {
  const k = newKeys();
  for (const m of ['', 'héllo ✓ 量子']) assert.equal(verify(k.publicKey, m, sign(k.secretKey, m)), true);
});
test('fingerprint is stable and 32 hex chars', () => {
  const k = newKeys();
  assert.equal(fingerprint(k.publicKey), fingerprint(k.publicKey));
  assert.match(fingerprint(k.publicKey), /^[0-9a-f]{32}$/);
});
