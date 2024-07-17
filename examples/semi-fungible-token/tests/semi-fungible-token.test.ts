import { describe, expect, it } from "vitest"
import { Cl, ClarityType, cvToValue, cvToString } from "@stacks/transactions"

/*
  The test below is an example. To learn more, read the testing documentation here:
  https://docs.hiro.so/clarinet/feature-guides/test-contract-with-clarinet-sdk
*/

const accounts = simnet.getAccounts()
const deployerAddress = accounts.get("deployer")!
const address1 = accounts.get("wallet_1")!
const address2 = accounts.get("wallet_2")!

function createSemiFungibleToken(
  tokenId: number = 1,
  amount: number = 100,
  recipient: string = address1
) {
  let outcome = simnet.callPublicFn(
    "semi-fungible-token",
    "mint",
    [Cl.uint(tokenId), Cl.uint(amount), Cl.standardPrincipal(recipient)],
    deployerAddress
  )

  return outcome
}

describe("example tests", () => {
  it("ensures simnet is well initalised", () => {
    expect(simnet.blockHeight).toBeDefined()
  })
})

describe("mint a semi-fungible-token", () => {
  it("ensures semi-fungible token is minted", () => {
    let { result, events } = createSemiFungibleToken()

    expect(result).toBeOk(Cl.bool(true))

    let { result: readOnlyResult } = simnet.callReadOnlyFn(
      "semi-fungible-token",
      "get-balance",
      [Cl.uint(1), Cl.standardPrincipal(address1)],
      address1
    )

    expect(readOnlyResult).toBeOk(Cl.uint(100))
  })

  it("ensures principal can be minted multiple types of semi-fungible tokens", () => {
    let SFT1_id = 1
    let SFT1_amount = 88
    let SFT2_id = 2
    let SFT2_amount = 77
    createSemiFungibleToken(SFT1_id, SFT1_amount, address1)
    createSemiFungibleToken(SFT2_id, SFT2_amount, address1)

    let { result: numberOfSFT1 } = simnet.callReadOnlyFn(
      "semi-fungible-token",
      "get-balance",
      [Cl.uint(1), Cl.standardPrincipal(address1)],
      address1
    )

    let { result: numberOfSFT2 } = simnet.callReadOnlyFn(
      "semi-fungible-token",
      "get-balance",
      [Cl.uint(2), Cl.standardPrincipal(address1)],
      address1
    )

    expect(numberOfSFT1).toBeOk(Cl.uint(88))
    expect(numberOfSFT2).toBeOk(Cl.uint(77))

    let { result: overallBalance } = simnet.callReadOnlyFn(
      "semi-fungible-token",
      "get-overall-balance",
      [Cl.standardPrincipal(address1)],
      address1
    )

    expect(overallBalance).toBeOk(Cl.uint(SFT1_amount + SFT2_amount))
  })
})

describe("transfer a semi-fungible-token", () => {
  it("ensures SFT can be transfered to a new owner", () => {
    createSemiFungibleToken()

    let { result } = simnet.callPublicFn(
      "semi-fungible-token",
      "transfer",
      [
        Cl.uint(1),
        Cl.uint(30),
        Cl.standardPrincipal(address1),
        Cl.standardPrincipal(address2)
      ],
      address1
    )

    expect(result).toHaveClarityType(ClarityType.ResponseOk)

    let { result: readOnlyResult } = simnet.callReadOnlyFn(
      "semi-fungible-token",
      "get-balance",
      [Cl.uint(1), Cl.standardPrincipal(address2)],
      address2
    )

    expect(readOnlyResult).toBeOk(Cl.uint(30))
  })
})
