;; This contract implements the community-standard Non-Fungible Token trait.
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; Define the NFT's name.
(define-non-fungible-token amazing-aardvarks uint)

;; Keep track of the last minted token ID.
(define-data-var last-token-id uint u0)

;; Define constants for the transaction sender (deployer) and error codes.
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

;; Get the last minted token ID.
(define-read-only (get-last-token-id)
    (ok (var-get last-token-id))
)

;; Given a token ID, get the URL where its data is hosted.
;; This would be implemented when this contract has a corresponding web interface/dapp.
(define-read-only (get-token-uri (token-id uint))
    (ok none)
)

;; Given a token ID, get its owner.
(define-read-only (get-owner (token-id uint))
    (ok (nft-get-owner? amazing-aardvarks token-id))
)

;; Transfer an NFT to a new owner. Only the NFT's current owner can complete this transaction.
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
    (begin
        (asserts! (is-eq tx-sender sender) err-not-token-owner)
        (nft-transfer? amazing-aardvarks token-id sender recipient)
    )
)

;; Mint a new NFT.
(define-public (mint (recipient principal))
    (let
        (
            (token-id (+ (var-get last-token-id) u1)) ;; Create the new token ID by incrementing the last minted ID.
        )
        (asserts! (is-eq tx-sender contract-owner) err-owner-only) ;; Only the contract owner can mint.
        (try! (nft-mint? amazing-aardvarks token-id recipient)) ;; Mint the NFT and send it to the given recipient.
        (var-set last-token-id token-id) ;; Update the last minted token ID.
        (ok token-id) ;; Return a success status and the newly minted NFT ID.
    )
)
