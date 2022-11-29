;; A print expression
(print "Hello World")

;; A function that returns a message
(define-public (say-hi)
  (ok "Hello World"))
    
;; A function that returns an input number
(define-public (echo-number (val int))
  (ok val))

;; Constants
(define-constant my-constant "This is a constant value")
(define-constant contract-owner tx-sender)

;; A private function (can only be called by this contract)
(define-private (is-valid-caller)
  (is-eq contract-owner tx-sender)
)

;; Get the STX balance of a wallet's address or a contract
(stx-get-balance 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE)
(stx-get-balance 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.my-contract)

;; Addition of 2 + 3
(+ 2 3)

;; Lists
(list 4 8 15 16 23 42)
(list "Hello" "World" "!")

;; Map a list: inverts the boolean values
(map not (list true true false false))

;; Fold a list: sums all the numbers
(fold + (list u1 u2 u3) u0)

;; Mutable variable
(define-data-var my-number uint u0)
(var-set my-number u5000)

;; Tuple data structure
{
    id: u5, ;; a uint
    username: "ClarityIsAwesome", ;; an ASCI string
    address: 'ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE ;; and a principal
}

;; Map data structure
(define-map scores principal uint)
;; Insert a value to a map
(map-insert scores tx-sender u100)
;; This second insert will do nothing because the key already exists
(map-insert scores tx-sender u200)
;; The score for tx-sender will be u100.
(print (map-get? scores tx-sender))
;; Delete the entry for tx-sender.
(map-delete scores tx-sender)
;; Will return none because the entry got deleted.
(print (map-get? scores tx-sender))