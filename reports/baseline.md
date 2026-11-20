# Baseline execution

Executed with Node.js and Newman 6.2.1 on November 20, 2026.

| Target | Requests | Assertions passed | Failures |
| --- | ---: | ---: | ---: |
| Local synthetic checkout contract | 58 | 174 | 0 |
| Public DummyJSON synthetic API | 25 | 78 | 0 |
| Local Medusa 2.18.0 with PostgreSQL 18.3 | 10 | 30 | 0 |

The checkout fixture used a fresh in-memory catalog and a loopback port. DummyJSON was reached over HTTPS and authenticated with its documented public demo user. The run confirmed the simulated write responses and checked that the original cart stayed unchanged.

The Medusa run used the [official starter at commit 9565d9d](https://github.com/medusajs/medusa-starter-default/tree/9565d9d5487e470137c63824fe58c59a2098bde8), its seeded `Europe` region and `Medusa T-Shirt`, a London address with postcode `SW1A 1AA`, and the system payment provider. The suite completed the order. A separate read-only PostgreSQL observation on the freshly seeded database found one active inventory reservation for two units, matching the checkout quantity.

See the [run instructions](../README.md) to reproduce the JUnit results.
