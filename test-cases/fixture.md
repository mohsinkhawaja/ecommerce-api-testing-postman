# E-commerce checkout contract

Synthetic Medusa-shaped workflow and explicit fixture-only rules.

| ID | Method | Path | Scenario | Status |
| --- | --- | --- | --- | --- |
| EC-01 | `GET` | `/store/products` | Read seeded catalog | 200 |
| EC-02 | `GET` | `/store/products?limit=1` | First page with limit one | 200 |
| EC-03 | `GET` | `/store/products?limit=1&offset=1` | Read page two | 200 |
| EC-04 | `GET` | `/store/products?offset=3` | Offset equals result count | 200 |
| EC-05 | `GET` | `/store/products?q=muG` | Search case insensitive title | 200 |
| EC-06 | `GET` | `/store/products?q=not-a-fixture-product` | Search returns empty collection | 200 |
| EC-07 | `GET` | `/store/products?limit=50` | Maximum page size | 200 |
| EC-08 | `GET` | `/store/products?limit=0` | Zero page size | 400 |
| EC-09 | `GET` | `/store/products?limit=51` | Over max page size | 400 |
| EC-10 | `GET` | `/store/products?offset=-1` | Negative offset | 400 |
| EC-11 | `GET` | `/store/products?limit=1.5` | Fractional page size | 400 |
| EC-12 | `GET` | `/store/products` | Require store key | 401 |
| EC-13 | `POST` | `/store/carts` | Reject unknown region | 422 |
| EC-14 | `POST` | `/store/carts` | Create empty cart | 200 |
| EC-15 | `GET` | `/store/carts/{{cartId}}` | Retrieve created cart | 200 |
| EC-16 | `GET` | `/store/carts/missing` | Missing cart | 404 |
| EC-17 | `POST` | `/store/carts/{{cartId}}/complete` | Reject empty checkout | 409 |
| EC-18 | `POST` | `/store/carts/{{cartId}}/line-items` | Reject zero quantity | 400 |
| EC-19 | `POST` | `/store/carts/{{cartId}}/line-items` | Reject negative quantity | 400 |
| EC-20 | `POST` | `/store/carts/{{cartId}}/line-items` | Reject fractional quantity | 400 |
| EC-21 | `POST` | `/store/carts/{{cartId}}/line-items` | Reject quoted quantity | 400 |
| EC-22 | `POST` | `/store/carts/{{cartId}}/line-items` | Reject quantity above contract maximum | 400 |
| EC-23 | `POST` | `/store/carts/{{cartId}}/line-items` | Reject nonexistent variant | 404 |
| EC-24 | `POST` | `/store/carts/{{cartId}}/line-items` | Reject out of stock variant | 409 |
| EC-25 | `POST` | `/store/carts/{{cartId}}/line-items` | Reject one unit over stock | 409 |
| EC-26 | `GET` | `/store/carts/{{cartId}}` | Rejections leave cart unchanged | 200 |
| EC-27 | `POST` | `/store/carts/{{cartId}}/line-items` | Accept quantity of one | 200 |
| EC-28 | `POST` | `/store/carts/{{cartId}}/line-items` | Repeated add merges the same variant | 200 |
| EC-29 | `POST` | `/store/carts/{{cartId}}/line-items/{{lineId}}` | Update line to the exact stock limit | 200 |
| EC-30 | `POST` | `/store/carts/{{cartId}}/line-items/{{lineId}}` | Reject an overstock update | 409 |
| EC-31 | `POST` | `/store/carts/{{cartId}}/line-items/{{lineId}}` | Reduce quantity before placing order | 200 |
| EC-32 | `POST` | `/store/carts/{{cartId}}/line-items` | Add a second variant | 200 |
| EC-33 | `DELETE` | `/store/carts/{{cartId}}/line-items/{{bookLine}}` | Remove a line and recalculate | 200 |
| EC-34 | `DELETE` | `/store/carts/{{cartId}}/line-items/unknown` | Reject missing line removal | 404 |
| EC-35 | `POST` | `/store/carts/{{cartId}}/promotions` | Reject unknown promotion | 422 |
| EC-36 | `POST` | `/store/carts/{{cartId}}/promotions` | Apply fixture discount | 200 |
| EC-37 | `POST` | `/store/carts/{{cartId}}/promotions` | Repeated promotion does not stack | 200 |
| EC-38 | `POST` | `/store/carts/{{cartId}}/shipping-methods` | Reject shipping without address | 409 |
| EC-39 | `POST` | `/store/carts/{{cartId}}` | Reject invalid email | 422 |
| EC-40 | `POST` | `/store/carts/{{cartId}}` | Reject missing country | 422 |
| EC-41 | `POST` | `/store/carts/{{cartId}}` | Accept synthetic checkout address | 200 |
| EC-42 | `POST` | `/store/carts/{{cartId}}/shipping-methods` | Reject unknown shipping option | 404 |
| EC-43 | `POST` | `/store/carts/{{cartId}}/shipping-methods` | Apply shipping and reconcile total | 200 |
| EC-44 | `POST` | `/store/carts/{{cartId}}/complete` | Reject completion with no payment | 409 |
| EC-45 | `POST` | `/store/carts/{{cartId}}/fixture-payment` | Simulate declined payment | 200 |
| EC-46 | `POST` | `/store/carts/{{cartId}}/complete` | A declined payment cannot create an order | 409 |
| EC-47 | `GET` | `/fixture/inventory/variant_mug` | Failed checkout preserves stock | 200 |
| EC-48 | `POST` | `/store/carts/{{cartId}}/fixture-payment` | Simulate approved payment | 200 |
| EC-49 | `POST` | `/store/carts/{{cartId}}/complete` | Complete the cart and create an order | 200 |
| EC-50 | `GET` | `/store/orders/{{orderId}}` | Retrieve the persisted order | 200 |
| EC-51 | `GET` | `/fixture/inventory/variant_mug` | Verify final stock deduction | 200 |
| EC-52 | `POST` | `/store/carts/{{cartId}}/complete` | Reject repeat completion | 409 |
| EC-53 | `GET` | `/fixture/inventory/variant_mug` | Repeat completion leaves stock unchanged | 200 |
| EC-54 | `POST` | `/store/carts/{{cartId}}/line-items/{{lineId}}` | Reject post-completion item changes | 409 |
| EC-55 | `POST` | `/store/carts` | Create a second cart for cancellation | 200 |
| EC-56 | `POST` | `/store/carts/{{cancelCart}}/fixture-cancel` | Cancel second checkout before payment | 200 |
| EC-57 | `POST` | `/store/carts/{{cancelCart}}/complete` | Canceled cart cannot complete | 409 |
| EC-58 | `GET` | `/fixture/inventory/variant_mug` | Canceled checkout preserves available stock | 200 |
