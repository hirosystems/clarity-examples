import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v1.5.2/index.ts";

Clarinet.test({
  name: "Testing NFT contract mint.",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const block1 = chain.mineBlock([
      Tx.contractCall(
        "non-fungible-token",
        "mint",
        [types.principal("ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5")],
        deployer.address
      ),
    ]);
    block1.receipts[0].result.expectOk();

    const block2 = chain.mineBlock([
      Tx.contractCall(
        "non-fungible-token",
        "get-last-token-id",
        [],
        deployer.address
      ),
    ]);
    block2.receipts[0].result.expectOk().expectUint(1);
  },
});
