import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v1.5.2/index.ts";

Clarinet.test({
  name: "Test deployer minting 100 tokens to 2nd party, checking balance.",
  fn(chain: Chain, accounts: Map<string, Account>) {
    // Get the deployer account from settings/devnet.toml
    const deployer = accounts.get("deployer")!;
    // Get the wallet_1 account from settings/devnet.toml
    const wallet1 = accounts.get("wallet_1")!;

    const block1 = chain.mineBlock([
      Tx.contractCall(
        "fungible-token",
        "mint",
        [types.uint(100), types.principal(wallet1.address)],
        deployer.address
      ),
    ]);

    block1.receipts[0].result.expectOk();

    const block2 = chain.mineBlock([
      Tx.contractCall(
        "fungible-token",
        "get-balance",
        [types.principal(wallet1.address)],
        wallet1.address
      ),
    ]);

    block2.receipts[0].result.expectOk().expectUint(100);
  },
});

Clarinet.test({
  name: "Test minting and transferring tokens.",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet1 = accounts.get("wallet_1")!;
    const wallet2 = accounts.get("wallet_2")!;

    const block1 = chain.mineBlock([
      Tx.contractCall(
        "fungible-token",
        "mint",
        [types.uint(100), types.principal(wallet1.address)],
        deployer.address
      ),
    ]);

    block1.receipts[0].result.expectOk();

    const block2 = chain.mineBlock([
      Tx.contractCall(
        "fungible-token",
        "transfer",
        [
          types.uint(42),
          types.principal(wallet1.address),
          types.principal(wallet2.address),
          types.none(),
        ],
        wallet1.address
      ),
      Tx.contractCall(
        "fungible-token",
        "get-balance",
        [types.principal(wallet2.address)],
        wallet1.address
      ),
    ]);

    block2.receipts[0].result.expectOk().expectBool(true);
    block2.receipts[1].result.expectOk().expectUint(42);
  },
});
