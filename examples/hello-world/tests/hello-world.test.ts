import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;

describe("test contract functions", () => {
  it("returns 'Hello World' from say-hi", () => {
    const sayHiResponse = simnet.callPublicFn(
      "hello-world",
      "say-hi",
      [],
      address1
    );
    expect(sayHiResponse.result).toBeOk(Cl.stringAscii("Hello World"));
  });

  it("returns the same number from echo-number", () => {
    const echoNumberResponse = simnet.callPublicFn(
      "hello-world",
      "echo-number",
      [Cl.int(42)],
      address1
    );
    expect(echoNumberResponse.result).toBeOk(Cl.int(42));
  });

  it("returns ok when check-it is true", () => {
    const checkItResponseTrue = simnet.callPublicFn(
      "hello-world",
      "check-it",
      [Cl.bool(true)],
      address1
    );
    expect(checkItResponseTrue.result).toBeOk(Cl.int(1));
  });

  it("returns error when check-it is false", () => {
    const checkItResponseFalse = simnet.callPublicFn(
      "hello-world",
      "check-it",
      [Cl.bool(false)],
      address1
    );
    expect(checkItResponseFalse.result).toBeErr(Cl.uint(100));
  });
});
