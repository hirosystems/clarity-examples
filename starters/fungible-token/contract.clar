;; This contract implements the community-standard Fungible Token trait.
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Define the FT, with no maximum supply
(define-fungible-token clarity-coin)

;; Define constants for the transaction sender (deployer) and error codes.
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

;; Returns the balance of a specified principal.
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance clarity-coin who))
)

;; Returns the total supply of our custom token.
(define-read-only (get-total-supply)
  (ok (ft-get-supply clarity-coin))
)

;; Returns a human-readable name for our token.
(define-read-only (get-name)
  (ok "Clarity Coin")
)

;; Returns the symbol or "ticker" for this token.
(define-read-only (get-symbol)
  (ok "CC")
)

;; The number of decimals used for display. STX, for example, uses 6.
(define-read-only (get-decimals)
  (ok u6)
)

;; Returns a link to a metadata file for the token.
;; Our practice fungible token does not have a website, so we can return none.
(define-read-only (get-token-uri)
  (ok none)
)

;; Mint new tokens and send them to a recipient.
;; Only the contract deployer can perform this operation.
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-mint? clarity-coin amount recipient)
  )
)

;; Transfer tokens to a recipient.
;; Sender must be the same as the caller to prevent principals from transferring tokens they do not own.
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (try! (ft-transfer? clarity-coin amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)
