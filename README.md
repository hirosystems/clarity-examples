# Welcome to Clarity Examples

The Clarity Examples repository includes a collection of reusable [Clarity](https://clarity-lang.org/) smart contracts. These examples can help developers rapidly kickstart their journey onto the Stacks blockchain.

Furthermore, [Hiro Platform](https://platform.hiro.so/) allows developers to discover these smart contracts, clone, extend, and deploy the customized contracts—in a few clicks—all from the browser.

> **NOTE**: The examples provided in this repository are for educational purposes and have not been security audited.

## Available Examples

| Clarity Example             | Description                                     |
| --------------------------- | -------------------------------------------------------- |
|[hello-world](/examples/hello-world/)                  | A beginner smart contract with examples of commonly used Clarity expressions and data structures                                     |
|[blank-project](/examples/blank-project)               | A blank project conforms to [Clarinet-compliant](https://docs.hiro.so/clarinet/how-to-guides/how-to-create-new-project) project structure |
|[counter](/examples/counter/)                     | Demonstrates how to use and interact with "variables" in Clarity by incrementing a 32-bit unsigned integer                  |
|[clarity-bitcoin](/examples/clarity-bitcoin/)          | Demonstrates how to parse Bitcoin transactions and block headers, and to verify Bitcoin transactions                                 |
|[fungible-token](/examples/fungible-token/)            | Demonstrates a basic fungible token that conforms to the SIP-010 FT standard       |
|[non-fungible-token](/examples/non-fungible-token/)    | Demonstrates a basic NFT collection that conforms to the SIP-009 NFT standard      |
|[nft-marketplace](/examples/nft-marketplace/)          | Demonstrates a minimalistic NFT marketplace that allows users to list NFT for sale |
|[lightning-swaps](/examples/lightning-swaps/)          | Demonstrates LNSwap's submarine swaps between Stacks and Bitcoin                   |
|[ordyswap](/examples/ordyswap/)                        | Demonstrates trustless atomic swaps between Ordinals and Stacks                    |

## Logistics

All examples include a README and some have pointers to real-world projects in the Stacks blockchain.

Each example also includes unit tests under the `/tests` directory to help guide developers to familiarize themselves with testing concepts.

Additionally, each example can run in Clarinet as-is. In a terminal of choice and with [Clarinet](https://docs.hiro.so/clarinet/getting-started) installed, developers can go to the respective example folder, run `clarinet check`, `clarinet integrate`, and explore other [Clarinet features](https://docs.hiro.so/clarinet/introduction).

Alternatively, you can skip setting up your development environment on your laptop and instead go to https://platform.hiro.so to let Hiro Platform do all the heavy lifting of setting it up on your behalf. You can select the example of choice, explore the code, customize it, or deploy it to Stacks blockchain in a few clicks. 

With Hiro Platform, we want to encourage developers to focus on shipping their business models to Stacks blockchain, ship often and happily, and not get caught up with unboxing and infrastructure overhead.
