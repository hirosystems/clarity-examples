import { Cl, ClarityType } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const contractName = "clarity-bitcoin";
const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;

describe("bitcoin-clarity contract tests", () => {
  it("parses a Bitcoin transaction correctly", async () => {
    const btcTx =
      "0x02000000019b69251560ea1143de610b3c6630dcf94e12000ceba7d40b136bfb67f5a9e4eb000000006b483045022100a52f6c484072528334ac4aa5605a3f440c47383e01bc94e9eec043d5ad7e2c8002206439555804f22c053b89390958083730d6a66c1b711f6b8669a025dbbf5575bd012103abc7f1683755e94afe899029a8acde1480716385b37d4369ba1bed0a2eb3a0c5feffffff022864f203000000001976a914a2420e28fbf9b3bd34330ebf5ffa544734d2bfc788acb1103955000000001976a9149049b676cf05040103135c7342bcc713a816700688ac3bc50700";

    const result = await simnet.callReadOnlyFn(
      contractName,
      "parse-tx",
      [Cl.buffer(Buffer.from(btcTx.slice(2), "hex"))],
      deployer
    );

    const jsonResult = cvToJSON(result.result);
    expect(jsonResult.success).toBe(true);
  });
});
