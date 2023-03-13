# Lightning Swaps

Submarine swaps are common use cases in a blockchain. 

In Stacks, the [LNSwap](https://www.lnswap.org/) protocol provides submarine swaps between Stacks and Bitcoin, including interoperability with on-chain and [Lightning Network](https://lightning.network/).

## Know your Contract

For more details about this production running protocol in Stacks, please refer to [LNSwap's GitHub](https://github.com/LNSwap/lnstxbridge) and the [learning guide](https://www.lnswap.org/learn/how-lnswap-bitcoin-stacks-swaps-work).

The [stxswap_v10.clar](/examples/lightning-swaps/contracts/stxswap_v10.clar) contract includes the following functionality.

+ `lockStx` locks the STX for a swap in the contract
+ `claimStx` claims the STX locked in a contract
+ `refundStx` refunds the STX locked in a contract

To add new contracts, follow detailed instructions at [Add new Contract](https://docs.hiro.so/clarinet/how-to-guides/how-to-add-contract).

> **NOTE**: To use this example with Clarinet inside [Hiro Platform](https://platform.hiro.so), you can open the terminal session inside VS code by navigating to File -> View -> Terminal.

## Test your Contract

+ You can manually test your your contracts in the [Clarinet console](https://docs.hiro.so/clarinet/how-to-guides/how-to-test-contract#load-contracts-in-a-console).
+ You can programmatically test your contracts with [unit tests](https://docs.hiro.so/clarinet/how-to-guides/how-to-test-contract).

