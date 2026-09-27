import type { ResearchProject } from "@/lib/types";

export const research: ResearchProject[] = [
  {
    slug: "runtime-data-shadowing",
    title: "Runtime Data Shadowing (RDS)",
    subtitle: "A TEE Approach for Secure Medical Data Sharing",
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
        { id: "enclave", label: "SGX Enclave" },
        { id: "shadow", label: "Role-Aware Shadow View" },
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
