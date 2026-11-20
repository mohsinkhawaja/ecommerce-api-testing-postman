# E-commerce regression test plan

## What the suite exercises

- Product catalog map, pagination and search, including return shape and zero matches.
- Cart pricing in integer cents in the fixture. In DummyJSON, permit cents rounding in aggregate totals.
- Decision tables for checkout readiness. An empty cart, missing details, absent payment, and declined payment block checkout. A canceled cart remains closed. An approved order is retrievable and changes inventory once.
- Quantity partitions include non-integers, malformed types, zero, negative values, one unit, exact stock, and one over stock. Verify rejected mutations preserve cart or inventory state.
- Real-service integration uses a disposable Medusa installation with synthetic records, local system payment, and preseeded configuration.

## Execution and exit criteria

Run the fixture collection in CI for each push and pull request. Fail on any network or assertion error. Attach the JUnit report even if tests fail. Use the public and Medusa collections separately to distinguish service drift or configuration issues from fixture regressions. Record target and configuration in any defect report.

## Limits

The fixture defines its own promotion, rounding, payment and availability rules. It does not validate production Medusa behavior, financial settlement, or shared checkout concurrency. DummyJSON writes are simulations. The Medusa collection requires a seeded local installation.
