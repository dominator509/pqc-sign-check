// Generates a throwaway TESTNET-only wallet. Mnemonic goes to a private file, only the address is printed.
import { generateMnemonic, deriveNativeAccount, deriveEvmAccount } from '@qorechain/sdk';
import { writeFileSync, mkdirSync, existsSync, chmodSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const dir = join(homedir(), '.qore');
const file = join(dir, 'mnemonic');
if (existsSync(file)) { console.error('refusing to overwrite ' + file + ' (move it first)'); process.exit(2); }
mkdirSync(dir, { recursive: true, mode: 0o700 });
chmodSync(dir, 0o700);
const m = generateMnemonic();
writeFileSync(file, m, { mode: 0o600, flag: 'wx' });
chmodSync(file, 0o600);
const n = await deriveNativeAccount(m), e = await deriveEvmAccount(m);
console.log(JSON.stringify({ native: n.address, evm: e.address }));
