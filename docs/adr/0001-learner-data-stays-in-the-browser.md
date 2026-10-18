# Learner data stays in the browser

Attempts, Personal Best and everything derived from them (Miss Rates, Weak Keys) are stored only in the learner's browser via localStorage. The app is a static site on S3 (see `template.yaml`), and keeping it that way means no accounts, no API and near-zero running cost.

## Consequences

- History is per browser and per device, and is lost if the learner clears site data. That is accepted.
- Personal Best is stored separately from the Attempt history (capped at 50), so it survives Attempts rolling off.
- Changing the WPM definition to the 5-character standard made old Personal Best values incomparable, so they are discarded rather than migrated.
- Syncing across devices would require a backend and is the main reason to revisit this decision.
