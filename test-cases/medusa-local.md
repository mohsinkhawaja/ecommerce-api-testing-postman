# Medusa v2 seeded checkout integration

Opt-in collection for a separately configured local Medusa v2 instance.

| ID | Method | Path | Scenario | Status |
| --- | --- | --- | --- | --- |
| MD-01 | `GET` | `/store/products?limit=1&q={{productQuery}}` | Read seeded product | 200 |
| MD-02 | `POST` | `/store/carts` | Create cart in seeded region | 200 |
| MD-03 | `POST` | `/store/carts/{{cartId}}/line-items` | Add a seeded variant | 200 |
| MD-04 | `POST` | `/store/carts/{{cartId}}/line-items/{{lineId}}` | Update line quantity | 200 |
| MD-05 | `POST` | `/store/carts/{{cartId}}` | Set email and checkout addresses | 200 |
| MD-06 | `GET` | `/store/shipping-options?cart_id={{cartId}}` | Choose configured shipping option | 200 |
| MD-07 | `POST` | `/store/carts/{{cartId}}/shipping-methods` | Attach shipping method | 200 |
| MD-08 | `POST` | `/store/payment-collections` | Create payment collection | 200 |
| MD-09 | `POST` | `/store/payment-collections/{{paymentCollection}}/payment-sessions` | Initialize local test payment session | 200 |
| MD-10 | `POST` | `/store/carts/{{cartId}}/complete` | Complete seeded checkout | 200 |
