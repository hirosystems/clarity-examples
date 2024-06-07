# A bitcoin transaction enabled Non-fungible token

One of the coolest things about Clarity is that because of the architecture of the Stacks chain being tightly coupled with Bitcoin, we have the ability to read Bitcoin data directly from our Clarity contracts.

This allows us to do things like verify transactions directly from our code and implement logic in our smart contract to only allow a certain NFT to be minted if a particular bitcoin transaction has been mined.

Non-fungible tokens or NFTs are digital assets registered on a blockchain with unique identifiers and properties that distinguish them from each other.

This contract example implements a basic NFT collection that is mintable only upon a user's bitcoin transaction. Be sure to change the placeholder name of the collection, its max supply, and its `base-uri` for optional token metadata properties.

The [SIP-009 NFT trait](https://explorer.hiro.so/txid/0x80eb693e5e2a9928094792080b7f6d69d66ea9cc881bc465e8d9c5c621bd4d07?chain=mainnet) used and the external contract call to the `was-tx-mined-compact` method from [`clarity-bitcoin-lib-v5`](https://explorer.hiro.so/txid/0xfe25941d97a1b965b09699b622ec1d701997be62708dbac2e7a8c36a49e3e9bc?chain=mainnet) are for mainnet. However, if you want to use this on testnet, you'll have to use its testnet contract address references. Make sure to change the `project.requirements` property in the `Clarinet.toml` file to reflect the changed NFT trait address.

## SIP-009 Standard Trait Definition for Non-Fungible Tokens

In [Stacks Improvement Proposal 009 (SIP-009)](https://github.com/stacksgov/sips/blob/main/sips/sip-009/sip-009-nft-standard.md), the Stacks community proposed and approved a standard set of functions that every NFT contract is to implement to qualify as a compliant Stacks NFT. This creates uniformity and predictability in contract interactions, as well as enables a handful of built-in Clarity functions accessible only to SIP-009 contracts (such as `nft-transfer?`, etc.)

Those functions are specified in the SIP and must be implemented in each contract. Trait conformance is then asserted with an `impl-trait` declaration at the top of the contract pointing to the relevant trait reference published on the Stacks mainnet.

You can see this [`nft-trait` reference in the Hiro Stacks Explorer](https://explorer.stacks.co/txid/SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait?chain=mainnet).

## Know your contract

The [btc-tx-enabled-nft.clar](/examples/btc-tx-enabled-nft/contracts/btc-tx-enabled-nft.clar) contract includes the following functionality:

- `mint (..)` function dives into how an NFT can only be minted if a specific provided bitcoin transaction has been mined on the Bitcoin blockchain. The `mint` function requires the params of a receipient address, bitcoin block height of bitcoin transaction, the bitcoin transaction hex, the block header, and data from the bitcoin transaction's merkle proof. For more information on how to get this data for a particular bitcoin transaction, refer to the link in the Resources and Inspiration section below.

To add new contracts, follow detailed instructions at [Add new Contract](https://docs.hiro.so/clarinet/how-to-guides/how-to-add-contract).

> **NOTE**: To use this example with Clarinet inside [Hiro Platform](https://platform.hiro.so), you can open the terminal session inside VS code by navigating to File -> View -> Terminal.

## Resources and Inspiration

- This sample smart contract was taken from an excellent primer on building bitcoin logic into your Stacks smart contract. Check out [BitcoinPrimer](https://start.bitcoinprimer.dev/course/bitcoin-primer) to learn more how you can build an application on top of this smart contract.

- For more information on reading bitcoin state from Clarity smart contracts, check out the [clarity-bitcoin](https://github.com/friedger/clarity-bitcoin/blob/main/contracts/clarity-bitcoin-v5.clar) Github repo.
