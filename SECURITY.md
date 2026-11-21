# Security and trust boundaries

This is an early-stage engine foundation. Do not use it as an online authoritative game server.

Untrusted game manifests are validated before use; project slugs and file paths are constrained; asset digests are metadata only and **not yet independently verified against file bytes**. Games must not install arbitrary plugin code supplied by untrusted users. Plugin setup currently runs with application privileges and requires code review.

No network, authentication, payment, matchmaking or secrets should be added to engine-core. Multiplayer authority and user data services belong in separately secured services. Save storage is not encrypted or tamper-proof; do not store secrets or trust offline scores for competitive ranking.

Please report vulnerabilities privately to the repository maintainer using GitHub's private vulnerability reporting where enabled, rather than public issues containing exploit details.
