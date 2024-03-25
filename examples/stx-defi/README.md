# Decenntralized Finance (DeFi) Loans using STX

A DeFi loan utilizes smart contracts to enforce compliance with loan conditions, such as the application of interest rates and the automated distribution of yields on deposited assets.

> **NOTE**: Normally, DeFi loans permit the borrowing of liquidated assets by using cryptocurrency as collateral. However, to simplify and effectively teach the use-case in a straightforward way, this particular DeFi loan example showcases both deposits and lending using the same STX asset.

## Know your Contract

The [stx-defi.clar](/examples/stx-defi/contracts/stx-defi.clar) contract includes the following public functions.

+ `deposit` function for users to deposit STX into the contract
+ `borrow` function for users to borrow STX based on their deposits
+ `repay` function for users to repay their STX loans
+ `get-amount-owed` function to get the total amount owed by the user
+ `claim-yield` function for users to claim their yield based on the pool reserve and their deposits

> **NOTE**: To use this example with Clarinet inside [Hiro Platform](https://platform.hiro.so), you can open the terminal session inside VS code by navigating to File -> View -> Terminal.

## Test your contract

You can manually test your contract in the Clarinet console. After entering the console with `clarinet console` you can make contract function calls to verify the protocol functionality:

`(contract-call? .stx-defi deposit u1000)`

`(contract-call? .stx-defi borrow u7)`

`(contract-call? .stx-defi get-amount-owed)`

Alternatively, you can run the unit tests included in the `tests/` folder. From the terminal session, navigate to `/clarity-example/stx-defi` folder, and run the following command:

```
/clarity-examples/examples/stx-defi
╰─$ npm test

> stx-defi-tests@1.0.0 test
> vitest run

...
...
...

 ✓ tests/stx-defi.test.ts (4) 365ms
   ✓ stx-defi tests (4) 364ms
     ✓ verifies deposit
     ✓ borrows 10 and verifies the amount owed to be 10
     ✓ verifies repayment is successful
     ✓ verifies no yields to claim yet

 Test Files  1 passed (1)
      Tests  4 passed (4)
```
