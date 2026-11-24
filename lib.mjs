import { mldsa, shake256 } from '@qorechain/pqc';
const hex = (u) => Buffer.from(u).toString('hex');
const isHex = (s) => typeof s === 'string' && s.length > 0 && s.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(s);
const unhex = (s) => {
  if (!isHex(s)) throw new Error('invalid hex input');
  return new Uint8Array(Buffer.from(s, 'hex'));
};
const enc = (s) => new TextEncoder().encode(s);

export function newKeys() {
  const { publicKey, secretKey } = mldsa.keygen();
  return { publicKey: hex(publicKey), secretKey: hex(secretKey) };
}
export function sign(secretKeyHex, message) {
  return hex(mldsa.sign(unhex(secretKeyHex), enc(message)));
}
// Returns false (never throws) for malformed hex, wrong lengths or a bad signature.
export function verify(publicKeyHex, message, sigHex) {
  try {
    return mldsa.verify(unhex(publicKeyHex), enc(message), unhex(sigHex)) === true;
  } catch {
    return false;
  }
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
  // Flip one byte at the start, middle and end of the signature; every variant must fail.
  const flipAt = (i) => sig.slice(0, i * 2) + (sig.slice(i * 2, i * 2 + 2) === '00' ? '01' : '00') + sig.slice(i * 2 + 2);
  const n = sig.length / 2;
  const badSig = [0, Math.floor(n / 2), n - 1].some((i) => verify(k.publicKey, message, flipAt(i)));
  return { ok, tampered, badSig, pass: ok && !tampered && !badSig, fingerprint: fingerprint(k.publicKey), sigBytes: sig.length / 2 };
}
