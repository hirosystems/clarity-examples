# Using Map Data Structure in Clarity

Demonstrates how to use and interact with "variables" in Clarity by incrementing a 32-bit unsigned integer and an additional Clarity function to retrieve the incremented value.

## Know your Contract

+ `count-up` function increments the designated "32-bit unsigned integer" for the account holder, and that value is wrapped inside the `counters`, which is declared as a `map` data structure in Clarity
+ `get-count (...)` function retrieves the latest count from the `counters` map for a given account holder

## Test your Contract

+ You can manually test your your contracts in the [Clarinet console](https://docs.hiro.so/clarinet/how-to-guides/how-to-test-contract#load-contracts-in-a-console).
+ You can programmatically test your contracts with [unit tests](https://docs.hiro.so/clarinet/how-to-guides/how-to-test-contract).

