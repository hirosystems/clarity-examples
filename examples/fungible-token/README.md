# Fungible token

Fungible tokens are digital assets that can be sent, received, combined, and divided.

This contract implements a basic fungible token that conforms to the SIP-010 FT standard. Be sure to chance the placeholder name of the collection, as well as any other details.

## SIP-010 Standard Trait Definition for Fungible Tokens

In [Stacks Improvement Proposal 010 (SIP-010)](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md), the Stacks community proposed and approved a standard set of functions that every fungible token contract is to implement to qualify as a compliant fungible token on the Stacks chain. This creates uniformity and predictability in contract interactions, as well as enables a handful of built-in Clarity functions accessible only to SIP-010 contracts (such as `ft-transfer?`, etc.)

Those functions are specified in the SIP and must be implemented in each contract. Trait conformance is then asserted with an `impl-trait` declaration at the top of the contract pointing to the relevant trait reference published on the Stacks mainnet.

You can see this [`sip-010-trait` reference in the Hiro Stacks Explorer](https://explorer.stacks.co/txid/SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard?chain=mainnet).

## Test your contract

You can manually test your contract in the Clarinet console. After entering the console with `clarinet console` you can make contract function calls like
`(contract-call? .ft mint u100)`
`(contract-call? .ft get-balance tx-sender)`

You can programmatically test your contracts with [unit tests](https://docs.hiro.so/clarinet/how-to-guides/how-to-test-contract). See the `tests/` folder where you will find a unit test that ensures the `mint` function returns the proper response and that the read-only functions work as expected.

## Links and Resources

- There are lots of ways to create an initial distribution of tokens
  - [Friedgar's SLIME token employs an airdrop model](https://github.com/boomcrypto/clarity-deployed-contracts/blob/main/contracts/SP125J1ADVYWGWB9NQRCVGKYAG73R17ZNMV17XEJ7/slime.clar)
  - The [xBTC protocol deploys a role-based scheme](https://explorer.stacks.co/txid/0xcf6a930ac1bc14416df691e14a8da0d674748714933a56eb13e2e958029c64fa?chain=mainnet) to manage token minting access
  - This [project permits fungible token minting](https://explorer.stacks.co/txid/0x5c9cec6d28627bd73db277297d1a239f758fca087c9e3259b721686abd4801b3?chain=mainnet) only to those who own an NFT
