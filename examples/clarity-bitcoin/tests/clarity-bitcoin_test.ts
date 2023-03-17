import {
  Clarinet,
  Chain,
  Account,
} from "https://deno.land/x/clarinet@v1.5.2/index.ts";

// TODO

Clarinet.test({
  name: "Ensure that <...>",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const _addr1 = accounts.get("wallet_1")!.address;
    const _block = chain.mineBlock([
      /*
       * Add transactions with:
       * Tx.contractCall(...)
       */
    ]);
  },
});
