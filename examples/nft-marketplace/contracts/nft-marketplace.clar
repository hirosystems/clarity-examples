;; A tiny NFT marketplace that allows users to list NFT for sale. They can specify the following:
;; - The NFT token to sell.
;; - Listing expiry in block height.
;; - The payment asset, either STX or a SIP010 fungible token.
;; - The NFT price in said payment asset.
;; - An optional intended taker. If set, only that principal will be able to fulfil the listing.
;;
;; Source: https://github.com/clarity-lang/book/tree/main/projects/tiny-market

(use-trait nft-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)
(use-trait ft-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-constant contract-owner tx-sender)

;; listing errors
(define-constant err-expiry-in-past (err u1000))
(define-constant err-price-zero (err u1001))

;; cancelling and fulfiling errors
(define-constant err-unknown-listing (err u2000))
(define-constant err-unauthorised (err u2001))
(define-constant err-listing-expired (err u2002))
(define-constant err-nft-asset-mismatch (err u2003))
(define-constant err-payment-asset-mismatch (err u2004))
(define-constant err-maker-taker-equal (err u2005))
(define-constant err-unintended-taker (err u2006))
(define-constant err-asset-contract-not-whitelisted (err u2007))
(define-constant err-payment-contract-not-whitelisted (err u2008))

;; Define a map data structure for the asset listings
(define-map listings
	uint
	{
		maker: principal,
		taker: (optional principal),
		token-id: uint,
		nft-asset-contract: principal,
		expiry: uint,
		price: uint,
		payment-asset-contract: (optional principal)
	}
)

;; Used for unique IDs for each listing
(define-data-var listing-nonce uint u0)

;; This marketplace requires any contracts used for assets or payments to be whitelisted
;; by the contract owner of this (marketplace) contract.
(define-map whitelisted-asset-contracts principal bool)

;; Function that checks if the given contract has been whitelisted.
(define-read-only (is-whitelisted (asset-contract principal))
	(default-to false (map-get? whitelisted-asset-contracts asset-contract))
)

;; Only the contract owner of this (marketplace) contract can whitelist an asset contract.
(define-public (set-whitelisted (asset-contract principal) (whitelisted bool))
	(begin
		(asserts! (is-eq contract-owner tx-sender) err-unauthorised)
		(ok (map-set whitelisted-asset-contracts asset-contract whitelisted))
	)
)

;; Internal function to transfer an NFT asset from a sender to a given recipient.
(define-private (transfer-nft (token-contract <nft-trait>) (token-id uint) (sender principal) (recipient principal))
	(contract-call? token-contract transfer token-id sender recipient)
)

;; Internal function to transfer fungible tokens from a sender to a given recipient.
(define-private (transfer-ft (token-contract <ft-trait>) (amount uint) (sender principal) (recipient principal))
	(contract-call? token-contract transfer amount sender recipient none)
)

;; Public function to list an asset along with its contract
(define-public (list-asset (nft-asset-contract <nft-trait>) (nft-asset {taker: (optional principal), token-id: uint, expiry: uint, price: uint, payment-asset-contract: (optional principal)}))
	(let ((listing-id (var-get listing-nonce)))
		;; Verify that the contract of this asset is whitelisted
		(asserts! (is-whitelisted (contract-of nft-asset-contract)) err-asset-contract-not-whitelisted)
		;; Verify that the asset is not expired
		(asserts! (> (get expiry nft-asset) block-height) err-expiry-in-past)
		;; Verify that the asset price is greater than zero
		(asserts! (> (get price nft-asset) u0) err-price-zero)
		;; Verify that the contract of the payment is whitelisted
		(asserts! (match (get payment-asset-contract nft-asset) payment-asset (is-whitelisted payment-asset) true) err-payment-contract-not-whitelisted)
		;; Transfer the NFT ownership to this contract's principal
		(try! (transfer-nft nft-asset-contract (get token-id nft-asset) tx-sender (as-contract tx-sender)))
		;; List the NFT in the listings map
		(map-set listings listing-id (merge {maker: tx-sender, nft-asset-contract: (contract-of nft-asset-contract)} nft-asset))
		;; Increment the nonce to use for the next unique listing ID
		(var-set listing-nonce (+ listing-id u1))
		;; Return the created listing ID
		(ok listing-id)
	)
)

;; Public read-only function to retrieve a listing by its ID
(define-read-only (get-listing (listing-id uint))
	(map-get? listings listing-id)
)

;; Public function to cancel a listing using an asset contract.
;; This function can only be called by the NFT's creator, and must use the same asset contract that the NFT uses.
(define-public (cancel-listing (listing-id uint) (nft-asset-contract <nft-trait>))
	(let (
      (listing (unwrap! (map-get? listings listing-id) err-unknown-listing))
      (maker (get maker listing))
		)
		;; Verify that the caller of the function is the creator of the NFT to be cancelled
		(asserts! (is-eq maker tx-sender) err-unauthorised)
		;; Verify that the asset contract to use is the same one that the NFT uses
		(asserts! (is-eq (get nft-asset-contract listing) (contract-of nft-asset-contract)) err-nft-asset-mismatch)
		;; Delete the listing
		(map-delete listings listing-id)
		;; Transfer the NFT from this contract's principal back to the creator's principal
		(as-contract (transfer-nft nft-asset-contract (get token-id listing) tx-sender maker))
	)
)

;; Private function to validate that a purchase can be fulfilled
(define-private (assert-can-fulfil (nft-asset-contract principal) (payment-asset-contract (optional principal)) (listing {maker: principal, taker: (optional principal), token-id: uint, nft-asset-contract: principal, expiry: uint, price: uint, payment-asset-contract: (optional principal)}))
	(begin
		;; Verify that the buyer is not the same as the NFT creator
		(asserts! (not (is-eq (get maker listing) tx-sender)) err-maker-taker-equal)
		;; Verify the buyer has been set in the listing metadata as its `taker`
		(asserts! (match (get taker listing) intended-taker (is-eq intended-taker tx-sender) true) err-unintended-taker)
		;; Verify the listing for purchase is not expired
		(asserts! (< block-height (get expiry listing)) err-listing-expired)
		;; Verify the asset contract used to purchase the NFT is the same as the one set on the NFT
		(asserts! (is-eq (get nft-asset-contract listing) nft-asset-contract) err-nft-asset-mismatch)
		;; Verify the payment contract used to purchase the NFT is the same as the one set on the NFT
		(asserts! (is-eq (get payment-asset-contract listing) payment-asset-contract) err-payment-asset-mismatch)
		(ok true)
	)
)

;; Public function to purchase a listing using STX as payment
(define-public (fulfil-listing-stx (listing-id uint) (nft-asset-contract <nft-trait>))
	(let (
			;; Verify the given listing ID exists
      (listing (unwrap! (map-get? listings listing-id) err-unknown-listing))
			;; Set the NFT's taker to the purchaser (caller of the function)
      (taker tx-sender)
		)
		;; Validate that the purchase can be fulfilled
		(try! (assert-can-fulfil (contract-of nft-asset-contract) none listing))
		;; Transfer the NFT to the purchaser (caller of the function)
		(try! (as-contract (transfer-nft nft-asset-contract (get token-id listing) tx-sender taker)))
		;; Transfer the STX payment from the purchaser to the creator of the NFT
		(try! (stx-transfer? (get price listing) taker (get maker listing)))
		;; Remove the NFT from the marketplace listings
		(map-delete listings listing-id)
		;; Return the listing ID that was just purchased
		(ok listing-id)
	)
)

;; Public function to purchase a listing using another fungible token as payment
(define-public (fulfil-listing-ft (listing-id uint) (nft-asset-contract <nft-trait>) (payment-asset-contract <ft-trait>))
	(let (
			;; Verify the given listing ID exists
      (listing (unwrap! (map-get? listings listing-id) err-unknown-listing))
			;; Set the NFT's taker to the purchaser (caller of the function)
      (taker tx-sender)
		)
		;; Validate that the purchase can be fulfilled
		(try! (assert-can-fulfil (contract-of nft-asset-contract) (some (contract-of payment-asset-contract)) listing))
		;; Transfer the NFT to the purchaser (caller of the function)
		(try! (as-contract (transfer-nft nft-asset-contract (get token-id listing) tx-sender taker)))
		;; Transfer the tokens as payment from the purchaser to the creator of the NFT
		(try! (transfer-ft payment-asset-contract (get price listing) taker (get maker listing)))
		;; Remove the NFT from the marketplace listings
		(map-delete listings listing-id)
		;; Return the listing ID that was just purchased
		(ok listing-id)
	)
)
