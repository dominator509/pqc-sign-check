import { mldsa, shake256 } from '@qorechain/pqc';
const hex = (u) => Buffer.from(u).toString('hex');
const unhex = (s) => new Uint8Array(Buffer.from(s, 'hex'));
const enc = (s) => new TextEncoder().encode(s);

export function newKeys() {
  const { publicKey, secretKey } = mldsa.keygen();
  return { publicKey: hex(publicKey), secretKey: hex(secretKey) };
}
export function sign(secretKeyHex, message) {
  return hex(mldsa.sign(unhex(secretKeyHex), enc(message)));
}
export function verify(publicKeyHex, message, sigHex) {
  return mldsa.verify(unhex(publicKeyHex), enc(message), unhex(sigHex));
}
export function fingerprint(publicKeyHex) {
  return hex(shake256(unhex(publicKeyHex), 16));
}
// Signs a message, then checks that the signature passes and that a one-character change fails.
export function selfCheck(message = 'hello post-quantum world') {
  const k = newKeys();
  const sig = sign(k.secretKey, message);
  const ok = verify(k.publicKey, message, sig);
  const tampered = verify(k.publicKey, message + '!', sig);
  const badSig = verify(k.publicKey, message, sig.slice(0, -2) + (sig.endsWith('00') ? '01' : '00'));
  return { ok, tampered, badSig, pass: ok && !tampered && !badSig, fingerprint: fingerprint(k.publicKey), sigBytes: sig.length / 2 };
}
