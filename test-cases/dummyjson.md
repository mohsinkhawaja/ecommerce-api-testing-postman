# DummyJSON public API regression

Public synthetic service with simulated cart writes.

| ID | Method | Path | Scenario | Status |
| --- | --- | --- | --- | --- |
| DJ-01 | `GET` | `/auth/me` | Reject missing bearer | 401 |
| DJ-02 | `POST` | `/auth/login` | Reject invalid login | 400 |
| DJ-03 | `POST` | `/auth/login` | Login and capture tokens | 200 |
| DJ-04 | `GET` | `/auth/me` | Fetch current user with captured token | 200 |
| DJ-05 | `POST` | `/auth/refresh` | Refresh and capture token | 200 |
| DJ-06 | `GET` | `/auth/me` | Use the refreshed token | 200 |
| DJ-07 | `GET` | `/products` | Read default catalog with schema checks | 200 |
| DJ-08 | `GET` | `/products?limit=1&skip=0` | Read catalog page of one | 200 |
| DJ-09 | `GET` | `/products?limit=1&skip=1` | Page two has a distinct product | 200 |
| DJ-10 | `GET` | `/products?limit=0` | Zero limit returns all products | 200 |
| DJ-11 | `GET` | `/products?limit=1&skip={{totalProducts}}` | Offset equal to total is empty | 200 |
| DJ-12 | `GET` | `/products?limit=1&select=title,price` | Product field projection | 200 |
| DJ-13 | `GET` | `/products/{{firstProduct}}` | Product details by known ID | 200 |
| DJ-14 | `GET` | `/products/99999999` | Missing product returns 404 | 404 |
| DJ-15 | `GET` | `/products/search?q=phone&limit=5` | Search for phones | 200 |
| DJ-16 | `GET` | `/products/search?q=qa-unmatched-term-xzs` | Search with unmatched term | 200 |
| DJ-17 | `GET` | `/products/category/smartphones?limit=3` | Filter products by known category | 200 |
| DJ-18 | `GET` | `/carts?limit=2` | Read carts with pagination | 200 |
| DJ-19 | `GET` | `/carts/1` | Read and reconcile known cart | 200 |
| DJ-20 | `GET` | `/carts/99999999` | Missing cart returns 404 | 404 |
| DJ-21 | `POST` | `/carts/add` | Simulate cart creation | 201 |
| DJ-22 | `GET` | `/carts/{{simulatedCartId}}` | Confirm created cart is not persisted | 404 |
| DJ-23 | `PUT` | `/carts/1` | Simulate cart replacement | 200 |
| DJ-24 | `DELETE` | `/carts/1` | Simulate cart deletion | 200 |
| DJ-25 | `GET` | `/carts/1` | Confirm original cart still exists | 200 |
