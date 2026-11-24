#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { newKeys, sign, verify, fingerprint, selfCheck } from './lib.mjs';
const [cmd, a, b, c] = process.argv.slice(2);
const usage = 'usage: cli.mjs keygen | sign <secretKeyHex> <message|-> | verify <publicKeyHex> <message|-> <sigHex> | demo  (use - to read the message from stdin)';
const msg = (m) => (m === '-' ? readFileSync(0, 'utf8') : m);
if (cmd === 'keygen') { const k = newKeys(); console.log(JSON.stringify({ ...k, fingerprint: fingerprint(k.publicKey) })); }
else if (cmd === 'sign' && a && b) { try { console.log(sign(a, msg(b))); } catch (e) { console.error('error: ' + e.message); process.exit(2); } }
else if (cmd === 'verify' && a && b && c) { const v = verify(a, msg(b), c); console.log(v ? 'VALID' : 'INVALID'); process.exit(v ? 0 : 1); }
else if (cmd === 'demo') { const r = selfCheck(); console.log(JSON.stringify(r, null, 2)); process.exit(r.pass ? 0 : 1); }
else { console.error(usage); process.exit(2); }
