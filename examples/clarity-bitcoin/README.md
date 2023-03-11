# Interact with Bitcoin using Clarity

This example demonstrates how to use Clarity to parse Bitcoin transactions and block headers and verify that transactions were sent on the blockchain.

## Know your Contract

+ `parse-tx (..)` function dives into how to parse a Bitcoin transaction and the expected return type for your use in your business logic
+ `verify-block-header (...)` function unpacks the nuances of verifying a block header for a given block height
+ `was-tx-mined?` function determines whether or not a Bitcoin transaction was mined in a previous Bitcoin block

## Test your Contract

+ You can manually test your your contracts in the [Clarinet console](https://docs.hiro.so/clarinet/how-to-guides/how-to-test-contract#load-contracts-in-a-console).
+ You can programmatically test your contracts with [unit tests](https://docs.hiro.so/clarinet/how-to-guides/how-to-test-contract).
