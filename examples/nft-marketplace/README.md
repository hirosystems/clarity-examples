# A Minimalistic NFT Marketplace

Demonstartes a minimalistic NFT marketplace that allows users to list NFTs for sale.

## Know your Contract

The [nft-marketplace.clar](/examples/nft-marketplace/contracts/nft-marketplace.clar) contract includes the following functionality.

+ `list-asset` lists an asset along with its contract
+ `transfer-nft` transfers an NFT asset from a sender to a given recipient
+ `transfer-ft` transfers fungible tokens from a sender to a given recipient
+ `get-listing` function retrieves a listing by its ID
+ `cancel-listing` cancels a listing using an asset contract

To add new contracts, follow detailed instructions at [Add new Contract](https://docs.hiro.so/clarinet/how-to-guides/how-to-add-contract).

> **NOTE**: To use this example with Clarinet inside [Hiro Platform](https://platform.hiro.so), you can open the terminal session inside VS code by navigating to File -> View -> Terminal.

## Test your Contract

+ You can manually test your your contracts in the [Clarinet console](https://docs.hiro.so/clarinet/how-to-guides/how-to-test-contract#load-contracts-in-a-console).
+ You can programmatically test your contracts with [unit tests](https://docs.hiro.so/clarinet/how-to-guides/how-to-test-contract).
