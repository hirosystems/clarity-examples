import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v1.5.2/index.ts";

Clarinet.test({
  name: "get-count returns u0 for principals that never called count-up before",
  fn(chain: Chain, accounts: Map<string, Account>) {
    // Get the wallet_1 account from settings/devnet.toml
    const wallet1 = accounts.get("wallet_1")!;

    // Call the get-count read-only function.
    // the first parameter is the contract name
    // the second the function name
    // the third the function arguments as an array of clarity values
    // the final parameter is the tx-sender address
    const count = chain.callReadOnlyFn(
      "counter",
      "get-count",
      [types.principal(wallet1.address)],
      wallet1.address
    );

    // Assert that the returned result is a uint with a value of 0 (u0).
    count.result.expectUint(0);
  },
});

Clarinet.test({
  name: "count-up counts up for the tx-sender",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get("wallet_1")!;

    // Mine a block with one transaction.
    const block = chain.mineBlock([
      // Generate a contract call to count-up from the deployer address.
      Tx.contractCall("counter", "count-up", [], wallet1.address),
    ]);

    // Get the first (and only) transaction receipt.
    const receipt = block.receipts[0];

    // Assert that the returned result is a boolean true.
    receipt.result.expectOk().expectBool(true);

    // Get the counter value.
    const count = chain.callReadOnlyFn(
      "counter",
      "get-count",
      [types.principal(wallet1.address)],
      wallet1.address
    );

    // Assert that the returned result is a u1.
    count.result.expectUint(1);
  },
});

Clarinet.test({
  name: "counters are specific to the tx-sender",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get("wallet_1")!;
    const wallet2 = accounts.get("wallet_2")!;

    chain.mineBlock([
      // Wallet 1 calls count-up one time.
      Tx.contractCall("counter", "count-up", [], wallet1.address),
      // Wallet 2 calls count-up two times.
      Tx.contractCall("counter", "count-up", [], wallet2.address),
      Tx.contractCall("counter", "count-up", [], wallet2.address),
    ]);

    // Get and assert the counter value for wallet 1.
    const wallet1Count = chain.callReadOnlyFn(
      "counter",
      "get-count",
      [types.principal(wallet1.address)],
      wallet1.address
    );
    wallet1Count.result.expectUint(1);

    // Get and assert the counter value for wallet 2.
    const wallet2Count = chain.callReadOnlyFn(
      "counter",
      "get-count",
      [types.principal(wallet2.address)],
      wallet2.address
    );
    wallet2Count.result.expectUint(2);
  },
});
