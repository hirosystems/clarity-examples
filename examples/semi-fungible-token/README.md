# A semi-fungible token contract

Semi-Fungible Tokens, or SFTs, are digital assets that sit between fungible and non-fungible tokens. Fungible tokens are directly interchangeable, can be received, sent, and divided. Non-fungible tokens each have a unique identifier that distinguishes them from each other. Semi-fungible tokens have both an identifier and an amount.

This is a concept semi-fungible token standard and reference implementation for the Stacks blockchain. This contract was taken from Marvin Janssen's implementation found [here](https://github.com/MarvinJanssen/stx-semi-fungible-token).

Semi-fungible tokens can be very useful in many different settings. Here are some examples:

### Art

Art initiatives can use them to group an entire project into a single contract and mint multiple series or collections in a single go. A single artwork can have multiple editions that can all be expressed by the same identifier. Artists can also use them to easily create a track-record of their work over time. Curation requires tracking a single contract instead of a new one per project.

### Games

Games that have on-chain economies can leverage their flexibility to express their full in-game inventory in a single contract. For example, they may express their in-game currency with one token ID and a commodity with another. In-game item supplies can be managed in a more straightforward way and the game developers can introduce new item classes in a transparent manner.

## SIP-013 Standard Trait Definition for Semi-Fungible Tokens

In [Stacks Improvement Proposal 013 (SIP-013)](https://github.com/stacksgov/sips/blob/main/sips/sip-013/sip-013-semi-fungible-token-standard.md), the Stacks community proposed and approved a standard set of functions and traits that every semi-fungible token (SFT) contract is to implement to qualify as a compliant Stacks SFT. This creates uniformity and predictability in contract interactions.

This SIP outlines the specific traits to be defined in an SFT as well as an optional "send-many" trait, which allows for bulk transfers.

Both of these traits are specified in the SIP and are implemented in each contract using its mainnet trait contracts. Trait conformance is then asserted with an `impl-trait` declaration at the top of the contract pointing to the relevant trait reference published on the Stacks mainnet.

You can see this [`sip013-semi-fungible-token-trait` reference in the Hiro Stacks Explorer](https://explorer.stacks.co/txid/0x7e9d8bac5157ab0366089d00a40a2a83926314ab08807ab3efa87ebc96d9e20a?chain=mainnet).

You can also see the [`sip013-transfer-many-trait` reference in the Hiro Stacks Explorer](https://explorer.stacks.co/txid/0x88457278a61b7e59c8a19704932eebb7b46817e0bbd3235436a1d72c956db19c?chain=mainnet).

## Know your contract

The [semi-fungible-token.clar](/examples/semi-fungible-token/contracts/semi-fungible-token.clar) contract includes the following functionality:

- `mint (..)` function dives into how an SFT can only be minted by the contract owner. The `mint` function requires the params of a `receipient` address, arbitrary `token-id` as an `uint`, and SFT `amount`.

To add new contracts, follow detailed instructions at [Add new Contract](https://docs.hiro.so/clarinet/how-to-guides/how-to-add-contract).

> **NOTE**: To use this example with Clarinet inside [Hiro Platform](https://platform.hiro.so), you can open the terminal session inside VS code by navigating to File -> View -> Terminal.

## Resources and Inspiration

- As mentioned earlier, this sample smart contract was taken Marvin Janssen's reference implementation found [here](https://github.com/MarvinJanssen/stx-semi-fungible-token/blob/main/contracts/semi-fungible-token.clar). His repo also includes an example Wrapped SIP010 SFT contract that can wrap an arbitrary number of SIP010 tokens across different contracts.
