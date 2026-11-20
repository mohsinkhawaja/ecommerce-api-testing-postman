# Baseline execution

Executed with Node.js and Newman 6.2.1 on November 20, 2026.

| Target | Requests | Assertions passed | Failures |
| --- | ---: | ---: | ---: |
| Local synthetic checkout contract | 58 | 174 | 0 |
| Public DummyJSON synthetic API | 25 | 78 | 0 |

The checkout fixture used a fresh in-memory catalog and a loopback port. DummyJSON was reached over HTTPS and authenticated with its documented public demo user. The run confirmed the simulated write responses and checked that the original cart stayed unchanged. The configured Medusa integration was not part of this baseline.

See the [run instructions](../README.md) to reproduce the JUnit results.
