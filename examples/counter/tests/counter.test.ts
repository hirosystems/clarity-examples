import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;

describe("test individual counters", () => {
  it("retrieves the default count for a new user", () => {
    const countResponse = simnet.callReadOnlyFn(
      "counter",
      "get-count",
      [Cl.standardPrincipal(address2)],
      address1
    );
    expect(countResponse.result).toBeUint(0);
  });

  it("increments the count for a user", () => {
    const incrementResponse = simnet.callPublicFn(
      "counter",
      "count-up",
      [],
      address1
    );
    expect(incrementResponse.result).toBeOk(Cl.bool(true));

    // Retrieve the updated count for address1
    const updatedCountResponse = simnet.callReadOnlyFn(
      "counter",
      "get-count",
      [Cl.standardPrincipal(address1)],
      address1
    );
    expect(updatedCountResponse.result).toBeUint(1);
  });
  it("increments the count for a user multiple times", () => {
    // Call the count-up function for address2 twice
    let incrementResponse = simnet.callPublicFn(
      "counter",
      "count-up",
      [],
      address2
    );
    expect(incrementResponse.result).toBeOk(Cl.bool(true));

    incrementResponse = simnet.callPublicFn(
      "counter",
      "count-up",
      [],
      address2
    );
    expect(incrementResponse.result).toBeOk(Cl.bool(true));

    // Retrieve the updated count for address2
    const updatedCountResponse = simnet.callReadOnlyFn(
      "counter",
      "get-count",
      [Cl.standardPrincipal(address2)],
      address1
    );
    expect(updatedCountResponse.result).toBeUint(2);
  });

});
