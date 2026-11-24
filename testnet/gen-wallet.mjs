// Generates a throwaway TESTNET-only wallet. Mnemonic goes to a private file, only the address is printed.
import { generateMnemonic, deriveNativeAccount, deriveEvmAccount } from '@qorechain/sdk';
import { writeFileSync } from 'node:fs';
const m = generateMnemonic();
writeFileSync(process.env.HOME + '/.qore/mnemonic', m, { mode: 0o600 });
const n = await deriveNativeAccount(m), e = await deriveEvmAccount(m);
console.log(JSON.stringify({ native: n.address, evm: e.address }));
