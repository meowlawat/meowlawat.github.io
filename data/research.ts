import type { ResearchProject } from "@/lib/types";

export const research: ResearchProject[] = [
  {
    slug: "runtime-data-shadowing",
    title: "Runtime Data Shadowing (RDS)",
    subtitle: "A TEE Approach for Secure Medical Data Sharing",
    layout: "feature",
    status: "Accepted — ETTIS 2026",
    venue: "ETTIS 2026",
    publisher: "Springer / Scopus-indexed",
    year: "2026",
    description:
      "A trusted-execution-environment approach for sharing medical data under role-aware access control, built on Intel SGX enclaves and authenticated encryption.",
    technologies: ["Intel SGX", "TEE", "AES-128-GCM"],
    metrics: [
      { label: "Mean query latency", value: "8.93 μs" },
      { label: "Overhead", value: "2.9×" },
      { label: "Throughput", value: "112,046", context: "ops/sec" },
      {
        label: "Latency degradation",
        value: "15×",
        context: "beyond 128 MB EPC boundary",
      },
    ],
    architecture: {
      nodes: [
        { id: "client", label: "Client" },
        { id: "encrypted", label: "Encrypted Patient Data" },
        { id: "enclave", label: "SGX Enclave", state: "verified" },
        { id: "shadow", label: "Role-Aware Shadow View", state: "verified" },
        { id: "result", label: "Authorized Result" },
      ],
      edges: [
        { from: "client", to: "encrypted" },
        { from: "encrypted", to: "enclave" },
        { from: "enclave", to: "shadow" },
        { from: "shadow", to: "result" },
      ],
    },
    details: {
      problem:
        "Medical data sharing requires strict role-based access control while remaining resistant to a compromised host OS or hypervisor — the party operating the infrastructure should not be able to read plaintext patient data.",
      approach:
        "Runtime Data Shadowing runs the access-control and view-derivation logic inside an Intel SGX enclave. Patient data stays encrypted (AES-128-GCM) outside the enclave; the enclave decrypts, derives a role-aware \"shadow view\" of the record for the requesting party, and re-encrypts only the authorized result before it leaves the trusted boundary.",
      threatModel:
        "Assumes a malicious or compromised host OS/hypervisor with physical access to memory outside the enclave, but trusts the SGX hardware root of trust and the enclave's measured code.",
      implementation:
        "Implemented as an SGX enclave application with AES-128-GCM for data confidentiality/integrity, evaluated for query latency and throughput under varying enclave page cache (EPC) pressure.",
      results:
        "Mean query latency of 8.93 μs with a 2.9× overhead versus a non-enclave baseline, sustaining 112,046 ops/sec. Latency degrades sharply (15×) once working-set size exceeds the 128 MB EPC boundary, which is the dominant scalability constraint.",
      limitations:
        "Performance is bounded by SGX's EPC size — workloads that exceed 128 MB incur substantial paging overhead. The evaluation targets a single-enclave deployment rather than a distributed multi-party setting.",
    },
    links: {
      // NOTE: github.com/meowlawat/Runtime-Data-Shadowing returned 404 as of
      // 2026-09-27 (checked directly + common naming variants). Omitted
      // pending confirmation that the repository is public. See summary.
    },
  },
  {
    slug: "token-accounting-integrity-llm-metering",
    title: "Token-Accounting Integrity in LLM Metering",
    subtitle: "Client-Side Under-Payment in Usage-Based Billing",
    layout: "compact",
    status: "Submitted — FGCS 2026",
    venue: "Future Generation Computer Systems",
    publisher: "Elsevier",
    year: "2026",
    description:
      "A reproducible testbed and formal model studying client-side under-payment in LLM metering: an authenticated, legitimate client that pays less than it owes, across three accounting architectures and two inference backends.",
    technologies: ["FastAPI", "PostgreSQL", "TLA+", "Python"],
    metrics: [
      { label: "Value leakage, controlled", value: "58.3%" },
      { label: "Value leakage, real serving stack", value: "69.0%" },
      { label: "Formal verification", value: "40/40", context: "TLA+ configurations, 0 disagreements" },
      { label: "Over-serving onset", value: "100 ms", context: "reconciliation delay, sequential arrivals" },
    ],
    architecture: {
      nodes: [
        { id: "client", label: "Client" },
        { id: "gateway", label: "Metering Gateway" },
        { id: "usage", label: "Client-Influenced Usage Record" },
        { id: "authoritative", label: "Server-Authoritative Recount", state: "verified" },
        { id: "billed", label: "Net Debit" },
      ],
      edges: [
        { from: "client", to: "gateway" },
        { from: "gateway", to: "usage" },
        { from: "usage", to: "authoritative" },
        { from: "authoritative", to: "billed" },
      ],
    },
    details: {
      problem:
        "Usage-based LLM pricing makes metering a security boundary: value reaches the client before accounting is finalized, and most security work on that boundary assumes the client is honest. This studies the remaining direction — an authenticated, legitimate client that under-pays.",
      approach:
        "Unifies known enabling mechanisms under one integrity property (delivered value must not exceed net debit), taxonomized into three dimensions — state synchronization (B0, baseline), commitment timing (M1), and usage authority (M2) — measured across three accounting architectures, three execution topologies, and two independent inference data planes, with every mechanism model-checked in TLA+.",
      threatModel:
        "Honest provider; dishonest client holding valid credentials, controlling request payloads (including client-declared usage fields), concurrency, and connection lifecycle, but unable to compromise TLS, the database, or server code.",
      implementation:
        "FastAPI gateway fronting a deterministic mock generator and a real llama.cpp backend, with three accounting backends (mutable balance, append-only ledger, event queue) behind common interfaces so experiments compare semantics rather than unrelated code.",
      results:
        "An architecture that recounts usage correctly but bills from a client-influenced representation leaks 58.3% of delivered value in the controlled setting and 69.0% against the real serving stack. Reservation and abort-safe finalization are orthogonal — both are required for solvency and integrity together, confirmed by exhaustive model checking across all four combinations (40/40 matched, 0 disagreements).",
      limitations:
        "No mechanized refinement proof from the TLA+ specification to the implementation; the formal model checks safety only, on a finite instance. One physical host, one local serving stack, one small model. Pricing tiers are synthetic. No commercial provider was tested. An earlier version of this work claimed detectability as a result — that claim was withdrawn after the project's own audit found the instrumentation restated experimenter-assigned labels rather than measuring evidence.",
    },
    links: {
      artifact: "https://doi.org/10.5281/zenodo.22086254",
    },
  },
  {
    slug: "lstm-password-guessing-argon2id",
    title: "Evaluating LSTM-Based Password Guessing",
    subtitle: "Under Argon2id Memory-Hard Constraints",
    status: "Accepted — ICDSCNC 2026",
    venue: "ICDSCNC 2026",
    publisher: "IEEE Xplore",
    year: "2026",
    description:
      "Evaluates how effectively a character-level LSTM password guesser performs against credentials protected by Argon2id's memory-hard parameters, compared to a classical n-gram baseline.",
    technologies: ["LSTM", "Argon2id", "Python"],
    metrics: [
      { label: "Architecture", value: "2-layer LSTM", context: "256 hidden units" },
      { label: "Validation loss", value: "2.29" },
      { label: "Efficiency vs. 3-gram Markov baseline", value: "5.41×" },
      { label: "Attack match rate", value: "0.87%" },
      { label: "Credentials evaluated", value: "666,401" },
    ],
    details: {
      problem:
        "Memory-hard password hashing schemes like Argon2id are designed to make brute-force and dictionary attacks expensive. Whether a learned password-guessing model changes that calculus in practice is not obvious from the KDF parameters alone.",
      approach:
        "Trains a 2-layer character-level LSTM (256 hidden units) as a password-guessing model and evaluates its guess efficiency against credentials hashed with Argon2id (m=65536, t=3, p=4), benchmarked against a classical 3-gram Markov baseline.",
      implementation:
        "Character-level LSTM trained to convergence at a validation loss of 2.29, then used to generate guesses evaluated against a held-out set of 666,401 real-world credentials under the fixed Argon2id parameters.",
      results:
        "The LSTM guesser is 5.41× more efficient than the 3-gram Markov baseline at generating high-likelihood guesses, but achieves only a 0.87% match rate against the evaluated credential set under Argon2id's memory-hard constraints.",
      limitations:
        "The low absolute match rate reflects Argon2id's cost parameters constraining the number of guesses that are practical to attempt; results are specific to the chosen m/t/p parameters and the evaluated credential distribution.",
    },
    links: {},
  },
];
