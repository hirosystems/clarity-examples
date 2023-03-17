import {
  Clarinet,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v1.5.2/index.ts";

Clarinet.test({
  name: "say-hi returns Hello World message",
  fn(chain: Chain, accounts: Map<string, Account>) {
    // Get the wallet_1 account from settings/devnet.toml
    const wallet1 = accounts.get("wallet_1")!;

    const response = chain.callReadOnlyFn(
      "hello-world",
      "say-hi",
      [],
      wallet1.address
    );

    response.result.expectOk().expectAscii("Hello World");
  },
});

Clarinet.test({
  name: "echo-number returns the passed number",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get("wallet_1")!;

    const response = chain.callReadOnlyFn(
      "hello-world",
      "echo-number",
      [types.int(101)],
      wallet1.address
    );

    response.result.expectOk().expectInt(101);
  },
});
