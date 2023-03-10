# Non-fungible token

Non-fungible tokens or NFTs are digital assets registered on a blockchain with unique identifiers and properties that distinguish them from each other.

This contract example implements a basic NFT collection that conforms to the SIP-009 NFT standard. Be sure to change the placeholder name of the collection and its max supply.

## SIP-009 Standard Trait Definition for Non-Fungible Tokens

In [Stacks Improvement Proposal 009 (SIP-009)](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md), the Stacks community proposed and approved a standard set of functions that every NFT contract is to implement to qualify as a compliant Stacks NFT. This creates uniformity and predictability in contract interactions, as well as enables a handful of built-in Clarity functions accessible only to SIP-009 contracts (such as `nft-transfer?`, etc.)

Those functions are specified in the SIP and must be implemented in each contract. Trait conformance is then asserted with an `impl-trait` declaration at the top of the contract pointing to the relevant trait reference published on the Stacks mainnet.

You can see this [`nft-trait` reference in the Hiro Stacks Explorer](https://explorer.stacks.co/txid/SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait?chain=mainnet).

## Test your contract

You can manually test your contract in the Clarinet console. After entering the console with `clarinet console` you can make contract function calls like
`(contract-call? .nft claim)`
`(contract-call? .nft get-last-token-id)`

You can programmatically test your contracts with [unit tests](https://docs.hiro.so/clarinet/how-to-guides/how-to-test-contract). See the `tests/` folder where you will find a unit test that ensures the `claim` function returns the proper response and that the read-only functions work as expected.

## Resources and Inspiration

- One of the most successful NFT collections in Stacks is [Megapont Ape Club](https://gamma.io/collections/megapont-ape-club). You can view [the source code of their NFT contract](https://explorer.stacks.co/txid/SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.megapont-ape-club-nft?chain=mainnet)
- The Crash Punks project had an upgrade from v1 to v2, which this [NFT contract implements](https://explorer.stacks.co/txid/SP3QSAJQ4EA8WXEDSRRKMZZ29NH91VZ6C5X88FGZQ.crashpunks-v2?chain=mainnet)
- An ambitious use case for NFTs is Mechanism.io's BNSx project, where pre-SIP-009 era BNS names can be wrapped into a SIP-009 NFT. You can learn more about the [BNSx project](https://github.com/mechanismHQ/bns-x) and look at the [source code here.](https://github.com/mechanismHQ/bns-x/blob/main/contracts/contracts/core/name-registry.clar)
