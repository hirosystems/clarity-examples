;; Project Lightning Swaps
;; -----------------------
;; Fraud proof swaps. This contract transfers STX tokens to user on receipt of a valid
;; preimage proving payment on Lightning via LSAT protocol. 
;; The contract also registers the btc address of the user in the case were they
;; want to start stacking or at least contributing to a delegated stacking pool.

;; Constants
;; ---------
(define-constant administrator 'ST1EYJJ3V4DNRVHRWANP8S3CXJ70SFBJF2F8DH2RM)
(define-constant not-allowed u110)
(define-constant not-found u100)
(define-constant not-enough-funds u120)

;; Storage
;; -------
;; preimage-map : map of payments against recipients
(define-map preimage-map ((preimage (buff 32))) ((recipient principal) (amount uint) (paid bool)))
(define-map btc-address-map ((btc-address (buff 56))) ((stacker-address principal) (lockin-rate uint)))

;; Public Functions
;; ----------------

;; Register a btc address for a stacking pool.
;;    lockin-rate - the stx/btc exchange rate
;;    stacker-address - the address of the stacker
(define-public (register-btc-address (btc-address (buff 56)) (lockin-rate uint))
  (begin
    (map-insert btc-address-map {btc-address: btc-address} ((stacker-address tx-sender) (lockin-rate lockin-rate)))
    (ok btc-address)
  )
)

;; Transfer stx:
;;      The preimage is not already contained in the map
;;      The amount is less than the senders balance
(define-public (transfer-to-recipient! (recipient principal) (preimage (buff 32)) (amount uint))
  (begin
    (if (is-create-allowed)
      (begin
        (map-insert preimage-map {preimage: preimage} ((recipient recipient) (amount amount) (paid true)))
        (ok preimage)
      )
      (err not-allowed)
    )
    ;; check that the contract owns enough stx to make the transfer
    (if (is-transfer-possible amount (as-contract tx-sender))
      (stx-transfer? amount tx-sender recipient)
      (err not-enough-funds)
    )
  )
)

;; Certain functions are only permitted to the contract publisher.
(define-public (get-administrator)
  (ok (as-contract tx-sender))
)

;; Get a transfer for a given LSAT transfer by preimage..
(define-public (get-tranfer (preimage (buff 32)))
  (match (map-get? preimage-map {preimage: preimage})
    myTransfer (ok myTransfer) (err not-found)
  )
)

;; Determine whether the given btc address has already been registered..
(define-public (is-btc-registered (btc-address (buff 56)))
  (match (map-get? btc-address-map {btc-address: btc-address})
    address (ok address) (err not-found)
  )
)

;; Private Functions
;; ----------------

;; Are there enough funds in the contract to make the transfer?
(define-private (is-transfer-possible (amt uint) (owner principal))
;; function not yet implemented  (>= amt (stx-get-balance owner))
  (>= amt u0)
)

;; Certain functions are only permitted to the contract publisher.
(define-private (is-create-allowed)
  (is-eq (as-contract tx-sender) tx-sender)
)