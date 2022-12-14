;; This contract implements the SIP009 community-standard Non-Fungible Token trait
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; Define the NFT's name
(define-non-fungible-token Your-NFT-Name uint)

;; Keep track of the last minted token ID
(define-data-var last-token-id uint u0)

;; Define constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant COLLECTION-LIMIT u1000) ;; Limit to series of 1000
(define-constant ERR-OWNER-ONLY (err u100))
(define-constant ERR-NOT-TOKEN-OWNER (err u101))
(define-constant ERR-SOLD-OUT (err u300))

(define-data-var base-uri (string-ascii 80) "https://your.api.com/path/to/collection/{id}")

;; Get the last minted token ID.
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

;; Get the link where the NFT's data is hosted.
(define-read-only (get-token-uri (token-id uint))
  (ok (some (var-get base-uri)))
)

;; Given a token ID, get its owner.
(define-read-only (get-owner (token-id uint))
  (ok (nft-get-owner? Your-NFT-Name token-id))
)

;; Transfer an NFT to a new owner. Only the NFT's current owner can complete this transaction.
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-NOT-TOKEN-OWNER)
    (nft-transfer? Your-NFT-Name token-id sender recipient)
  )
)

;; Mint a new NFT.
(define-public (mint (recipient principal))
  (let
    (
      (token-id (+ (var-get last-token-id) u1)) ;; Create the new token ID by incrementing the last minted ID.
    )
    (asserts! (< (var-get last-token-id) COLLECTION-LIMIT) ERR-SOLD-OUT) ;; Ensure the collection stays within the limit.
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-OWNER-ONLY) ;; Only the contract owner can mint.
    (try! (nft-mint? Your-NFT-Name token-id recipient)) ;; Mint the NFT and send it to the given recipient.
    (var-set last-token-id token-id) ;; Update the last minted token ID.
    (ok token-id) ;; Return a success status and the newly minted NFT ID.
  )
)
