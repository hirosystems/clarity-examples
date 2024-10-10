(use-trait ft-token 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-constant contract-owner tx-sender)

;; contract can hold many different sip-10 tokens
(define-public (get-balance (token <ft-token>))
    ;; #[filter(token)]
    (contract-call? token get-balance (as-contract tx-sender)))

;; any user can release any sip-10 token 
;; without worrying about bad token implementations
;; Only `token` can be transferred as we do not use (as-contract (contract-call? token transfer...))
(define-public (release-token (amount uint) (token <ft-token>))
    ;; #[filter(token)]
    (contract-call? token transfer amount (as-contract tx-sender) contract-owner none))