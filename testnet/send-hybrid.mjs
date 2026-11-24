// Sends a small hybrid (classical + ML-DSA-87) signed transfer on the QoreChain TESTNET.
// Mnemonic is read from a private file path (QORE_MNEMONIC_FILE) and is never printed.
import { readFileSync } from 'node:fs';
import {
  createClient, deriveNativeAccount, directSignerFromPrivateKey,
  derivePqcCanonical, ensurePqcRegistered, toBase,
} from '@qorechain/sdk';

const file = process.env.QORE_MNEMONIC_FILE;
if (!file) { console.error('set QORE_MNEMONIC_FILE'); process.exit(2); }
const mnemonic = readFileSync(file, 'utf8').trim();
const client = createClient(); // public testnet, chain id qorechain-diana
const account = await deriveNativeAccount(mnemonic);
const pqcKeypair = derivePqcCanonical(account.address, mnemonic);
const signer = await directSignerFromPrivateKey(account.privateKey, 'qor');
const tx = await client.connectTx(signer, { pqcKeypair });
await ensurePqcRegistered(tx, { pqcKeypair, rest: client.network.endpoints.rest });
const to = process.env.QORE_TO || account.address; // default: self-transfer
const result = await tx.bankSend(to, [{ denom: 'uqor', amount: toBase('1') }]);
console.log(JSON.stringify({ from: account.address, to, hash: result.transactionHash }));
