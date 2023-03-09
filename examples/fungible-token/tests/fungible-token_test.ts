import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v1.0.5/index.ts";
import { assertEquals } from "https://deno.land/std@0.90.0/testing/asserts.ts";

Clarinet.test({
  name: "Test deployer minting 100 tokens to 2nd party, checking balance.",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer");
    let wallet_1 = accounts.get("wallet_1");
    let block = chain.mineBlock([
      Tx.contractCall(
        "fungible-token",
        "mint",
        [
          types.uint(100),
          types.principal("ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5"),
        ],
        deployer.address
      ),
    ]);
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    block.receipts[0].result.expectOk();

    block = chain.mineBlock([
      Tx.contractCall(
        "fungible-token",
        "get-balance",
        [types.principal("ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5")],
        wallet_1.address
      ),
    ]);
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 3);
    block.receipts[0].result.expectOk().expectUint(100);
  },
});

Clarinet.test({
  name: "Test minting and transferring tokens.",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer");
    let wallet_1 = accounts.get("wallet_1");
    let block = chain.mineBlock([
      Tx.contractCall(
        "fungible-token",
        "mint",
        [
          types.uint(100),
          types.principal("ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5"),
        ],
        deployer.address
      ),
    ]);
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    block.receipts[0].result.expectOk();

    block = chain.mineBlock([
      Tx.contractCall(
        "fungible-token",
        "transfer",
        [
          types.uint(42),
          types.principal("ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5"),
          types.principal("ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"),
          types.none(),
        ],
        wallet_1.address
      ),
      Tx.contractCall(
        "fungible-token",
        "get-balance",
        [types.principal("ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG")],
        wallet_1.address
      ),
    ]);
    assertEquals(block.receipts.length, 2);
    assertEquals(block.height, 3);
    block.receipts[0].result.expectOk().expectTrue;
    block.receipts[1].result.expectOk().expectUint(42);
  },
});
