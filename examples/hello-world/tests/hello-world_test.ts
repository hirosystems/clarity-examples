import { Clarinet, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.5/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "say-hi returns Hello World message",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        // Get the deployer account.
        let deployer = accounts.get("deployer")!;

        let response = chain.callReadOnlyFn("hello-world", "say-hi", [], deployer.address);

        response.result.expectOk();
        assertEquals(response.result, '(ok "Hello World")');
    },
});

Clarinet.test({
    name: "echo-number returns the passed number",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        // Get the deployer account.
        let deployer = accounts.get("deployer")!;

        let response = chain.callReadOnlyFn("hello-world", "echo-number", [
            types.int(101)
        ], deployer.address);

        response.result.expectOk();
        assertEquals(response.result, '(ok 101)');
    },
});
