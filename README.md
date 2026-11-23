# pqc-sign-check

A small command line tool to sign and verify messages with ML-DSA-87 (FIPS-204), the post-quantum signature scheme QoreChain accounts use. It shows what a post-quantum signature looks like (about 4.6 KB) and that any change to the message or signature makes verification fail.

Built with `@qorechain/pqc` (QoreChain kit, credited) and its dependency `@noble/post-quantum`. License: Apache-2.0.

## Use

    npm install
    node cli.mjs keygen
    node cli.mjs sign <secretKeyHex> "message"
    node cli.mjs verify <publicKeyHex> "message" <sigHex>
    node cli.mjs demo     # sign, verify, then tamper and confirm it fails
    npm test

Status: library and tests done. Testnet address and hybrid-signed transaction are not yet added.
