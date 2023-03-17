// source: https://github.com/LNSwap/lnstxbridge/blob/bc730211ad76f864abdd1000eb6991bb60ae3220/tests/stxswap_test.ts

/* eslint-disable import/no-unresolved */
import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v1.5.2/index.ts";
import { assertObjectMatch } from "https://deno.land/std@0.180.0/testing/asserts.ts";

const contractName = "stxswap_v10";

Clarinet.test({
  name: "Ensure that user can lock and claim stx",
  fn(chain: Chain, accounts: Map<string, Account>) {
    // Get the wallet_1 account from settings/devnet.toml
    const wallet_1 = accounts.get("wallet_1")!;
    const wallet_2 = accounts.get("wallet_2")!;

    const amount = 1000;

    const block1 = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "lockStx",
        [
          "0x4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a", // preimagehash
          types.uint(amount),
          types.uint(5),
          types.principal(wallet_2.address),
        ],
        wallet_1.address
      ),
    ]);
    block1.receipts[0].result.expectOk().expectBool(true);

    const block2 = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "claimStx",
        [
          "0x01", //preimage
          types.uint(amount),
        ],
        wallet_2.address
      ),
    ]);
    block2.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "Ensure that user can lock and refund stx",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    const wallet_2 = accounts.get("wallet_2")!;
    const amount = 1_000;

    const block1 = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "lockStx",
        [
          "0x4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a", // preimagehash
          types.uint(amount),
          types.uint(5),
          types.principal(wallet_2.address),
        ],
        wallet_1.address
      ),
    ]);
    block1.receipts[0].result.expectOk().expectBool(true);

    // check the swap before refund
    const swap = chain.callReadOnlyFn(
      contractName,
      "getSwap",
      ["0x4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a"],
      wallet_1.address
    );

    const result = swap.result.expectSome().expectTuple();
    assertObjectMatch(result, {
      amount: types.uint(1000),
      timelock: types.uint(5),
      claimPrincipal: wallet_2.address,
      initiator: wallet_1.address,
    });

    chain.mineEmptyBlockUntil(6);

    const block2 = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "refundStx",
        [
          "0x4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a", // preimagehash
        ],
        wallet_1.address
      ),
    ]);

    block2.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "Ensure user can't claim funds that is locked for someone else",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    const wallet_2 = accounts.get("wallet_2")!;
    const amount = 1000;
    const block1 = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "lockStx",
        [
          "0x4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a", // preimagehash
          types.uint(amount),
          types.uint(5),
          types.principal(wallet_2.address),
        ],
        wallet_1.address
      ),
    ]);
    block1.receipts[0].result.expectOk().expectBool(true);

    const block2 = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "claimStx",
        [
          "0x01", //preimage
          types.uint(amount),
        ],
        wallet_1.address
      ),
    ]);
    block2.receipts[0].result.expectErr().expectUint(1002);
  },
});

Clarinet.test({
  name: "Ensure that user can't claim funds for non-existent swap",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    const wallet_2 = accounts.get("wallet_2")!;

    const amount = 1000;

    const block1 = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "lockStx",
        [
          "0x4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a", // preimagehash
          types.uint(amount),
          types.uint(5),
          types.principal(wallet_2.address),
        ],
        wallet_1.address
      ),
    ]);
    block1.receipts[0].result.expectOk().expectBool(true);

    const block2 = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "claimStx",
        [
          "0x02", // wrong preimage
          types.uint(amount),
        ],
        wallet_2.address
      ),
    ]);
    block2.receipts[0].result.expectErr().expectUint(1000);
  },
});

Clarinet.test({
  name: "Ensure that user can't lock with same hash twice",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    const wallet_2 = accounts.get("wallet_2")!;
    const amount = 1000;
    const block1 = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "lockStx",
        [
          "0x4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a", // preimagehash
          types.uint(amount),
          types.uint(5),
          types.principal(wallet_2.address),
        ],
        wallet_1.address
      ),
    ]);
    block1.receipts[0].result.expectOk().expectBool(true);

    const block2 = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "lockStx",
        [
          "0x4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a", // preimagehash
          types.uint(amount + 10),
          types.uint(5),
          types.principal(wallet_2.address),
        ],
        wallet_1.address
      ),
    ]);
    block2.receipts[0].result.expectErr().expectUint(1005);
  },
});

Clarinet.test({
  name: "Ensure that user can't refund non-existent hash",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;

    const block = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "refundStx",
        [
          "0x4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a", // preimagehash
        ],
        wallet_1.address
      ),
    ]);
    block.receipts[0].result.expectErr().expectUint(1000);
  },
});

Clarinet.test({
  name: "Ensure that user can't claim after refund - confirm hash is deleted from swaps map",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    const wallet_2 = accounts.get("wallet_2")!;

    const amount = 1_000;

    const block1 = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "lockStx",
        [
          "0x4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a", // preimagehash
          types.uint(amount),
          types.uint(5),
          types.principal(wallet_2.address),
        ],
        wallet_1.address
      ),
    ]);
    block1.receipts[0].result.expectOk().expectBool(true);

    // check the swap before refund
    const swap = chain.callReadOnlyFn(
      contractName,
      "getSwap",
      ["0x4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a"],
      wallet_1.address
    );

    const swapResult = swap.result.expectSome().expectTuple();
    assertObjectMatch(swapResult, {
      amount: types.uint(amount),
      timelock: types.uint(5),
      claimPrincipal: wallet_2.address,
      initiator: wallet_1.address,
    });

    chain.mineEmptyBlockUntil(6);
    const block2 = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "refundStx",
        [
          "0x4bf5122f344554c53bde2ebb8cd2b7e3d1600ad631c385a5d7cce23c7785459a", // preimagehash
        ],
        wallet_1.address
      ),
    ]);
    block2.receipts[0].result.expectOk().expectBool(true);

    const block3 = chain.mineBlock([
      Tx.contractCall(
        contractName,
        "claimStx",
        [
          "0x01", // preimage
          types.uint(amount),
        ],
        wallet_2.address
      ),
    ]);
    block3.receipts[0].result.expectErr().expectUint(amount);
  },
});
