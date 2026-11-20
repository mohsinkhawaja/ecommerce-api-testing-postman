# E-commerce API Testing with Postman

Newman regression suites for catalog, cart, and checkout contracts. The repository includes a deterministic checkout service, a public DummyJSON practice run, and a configurable Medusa v2 checkout collection.

| Target | Cases | Purpose |
| --- | ---: | --- |
| Local synthetic checkout | 58 | CI checks for cart state, quantity limits, promotions, payment outcomes, and inventory effects |
| DummyJSON | 25 | Login and token refresh, product schema and pagination, search, and simulated cart CRUD |
| Local Medusa v2 | 10 | Opt-in checkout from seeded product through order creation |

## Run the reproducible regression

Prerequisite: Node.js 22 or later.

```sh
npm ci
npm run verify:collections
npm test
```

The runner starts an isolated fixture on a loopback port, executes the same Postman collection used by CI, and saves `reports/fixture.junit.xml`. To run it interactively, use `npm run fixture` and import `collections/fixture.postman_collection.json` and `environments/fixture.example.postman_environment.json` into Postman. Restart it before running the full collection again. Cases share captured cart and line identifiers and run in collection order.

## DummyJSON practice

```sh
npx --no-install newman run collections/dummyjson.postman_collection.json -e environments/dummyjson.example.postman_environment.json --reporters cli,junit --reporter-junit-export reports/dummyjson.junit.xml
```

The exported environment uses the documented public demo login. DummyJSON simulates cart creation, updates, and deletion. The collection confirms those requests leave the original server data intact. It never uses real customer records or privately issued credentials.

## Medusa v2 integration

Follow the [Medusa Store API reference](https://docs.medusajs.com/api/store/) and [checkout guide](https://docs.medusajs.com/resources/storefront-development/checkout) to stand up a disposable local store. Seed a region and sales channel, a stock-managed product with at least two units, a compatible shipping option, and a local system payment provider. Set `productQuery` to return the intended product first. Copy the example environment to `environments/medusa.local.postman_environment.json` and supply the target-specific values. Keep `baseUrl` on loopback and use synthetic checkout data. Reset your seed between runs because a completed checkout may reserve inventory.

```sh
npx --no-install newman run collections/medusa-local.postman_collection.json -e environments/medusa.local.postman_environment.json --bail
```

The Medusa collection checks a seeded checkout, including shipping and a local payment session. Promotions, payment decline, cart cancellation, inventory effects, and exact money rules have coverage in the fixture suite. Validate those expectations against your configured Medusa payment, promotion, and inventory behavior before using them as upstream acceptance criteria.

## Project layout

- [`TEST_PLAN.md`](TEST_PLAN.md) explains coverage and exit criteria.
- [`test-cases/`](test-cases/) contains the case matrix and editable scenario contracts.
- [`test-data/`](test-data/) contains the synthetic catalog. [`fixture/`](fixture/) implements its HTTP contract.
- [`collections/`](collections/) holds generated Postman exports. Run `npm run build` after changing a scenario.
- [`reports/`](reports/) contains execution evidence. [`bug-reports/`](bug-reports/) contains the defect template.
