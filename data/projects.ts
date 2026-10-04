import type { Project } from "@/lib/types";

export const projects: Project[] = [
  {
    slug: "mpls-predictive-copilot",
    title: "MPLS Predictive Copilot",
    tagline: "Air-Gapped Autonomous NOC System",
    category: "Systems / Networking / Applied ML",
    // Sourced from the repo's creation date (github.com/meowlawat/mpls-copilot,
    // created 2026-06-26) — not tracked separately elsewhere.
    year: "2026",
    description:
      "A 7-module air-gapped NOC pipeline combining Containerlab MPLS simulation, Prometheus telemetry, LightGBM impact prediction, NetworkX blast-radius analysis, and a local LLM copilot — zero outbound dependency.",
    stack: [
      "Containerlab",
      "Prometheus",
      "LightGBM",
      "NetworkX",
      "Local LLM",
      "FastAPI",
      "Streamlit",
    ],
    metrics: [
      { label: "Pipeline modules", value: "7", context: "fully air-gapped" },
      { label: "Prediction features", value: "8", context: "LightGBM time-to-impact model" },
    ],
    architecture: {
      nodes: [
        { id: "network", label: "MPLS Network" },
        { id: "telemetry", label: "Telemetry" },
        { id: "prediction", label: "LightGBM Prediction" },
        { id: "blast", label: "Blast Radius Analysis", state: "verified" },
        { id: "llm", label: "Local LLM Copilot" },
        { id: "operator", label: "Operator" },
      ],
      edges: [
        { from: "network", to: "telemetry" },
        { from: "telemetry", to: "prediction" },
        { from: "prediction", to: "blast" },
        { from: "blast", to: "llm" },
        { from: "llm", to: "operator" },
      ],
    },
    featured: true,
    details: {
      overview:
        "An autonomous network-operations-center copilot that runs entirely air-gapped: a simulated MPLS network generates real telemetry, a gradient-boosted model predicts time-to-impact for developing faults, a graph analysis finds the blast radius and backup paths, and a local LLM turns that into operator-facing guidance — with zero outbound network dependency.",
      architectureNote:
        "Containerlab simulates a 4-node MPLS topology (Branch-A, PE-1, PE-2, Branch-B). Telegraf/Prometheus collect multi-signal telemetry (utilization, latency, jitter, packet loss, BGP flaps, OSPF changes). An 8-feature LightGBM model predicts time-to-impact with confidence scoring; NetworkX performs blast-radius and backup-path analysis; a locally-hosted LLM (via Ollama) grounds its answers in runbooks through local TF-IDF retrieval — no cloud API calls anywhere in the loop.",
      implementation:
        "FastAPI serves the prediction/analysis backend; a Streamlit dashboard provides real-time gauges, a multi-signal panel, a copilot chat interface, and live fault-injection controls for demoing failure scenarios (progressive congestion, packet loss + latency spikes, BGP route flapping).",
      results:
        "Delivers confidence-scored time-to-impact predictions and automatic backup-path discovery entirely within the air-gapped environment, demonstrated across multiple live fault-injection scenarios.",
      challenges:
        "Keeping the entire pipeline — telemetry, ML inference, retrieval, and language generation — running with strictly zero outbound dependency, which ruled out cloud LLM APIs and vector database services in favor of a local LLM and local TF-IDF retrieval.",
    },
    links: {
      repo: "https://github.com/meowlawat/mpls-copilot",
    },
  },
  {
    slug: "deep-nids",
    title: "Deep-NIDS",
    tagline: "AI-Powered Network Intrusion Detection System",
    category: "Machine Learning / Network Security",
    description:
      "A network intrusion detection system built on an LSTM autoencoder, using PCA-based feature reduction over the NSL-KDD dataset to flag anomalous traffic from reconstruction error.",
    stack: ["LSTM Autoencoder", "NSL-KDD", "PCA", "Python", "PyTorch"],
    metrics: [
      { label: "Detection accuracy", value: "85.4%" },
      { label: "Feature reduction", value: "41 → 10" },
      { label: "Inference latency", value: "12 ms" },
    ],
    architecture: {
      nodes: [
        { id: "traffic", label: "Network Traffic" },
        { id: "features", label: "Feature Extraction" },
        { id: "pca", label: "PCA" },
        { id: "lstm", label: "LSTM Autoencoder" },
        { id: "anomaly", label: "Anomaly Detection" },
      ],
      edges: [
        { from: "traffic", to: "features" },
        { from: "features", to: "pca" },
        { from: "pca", to: "lstm" },
        { from: "lstm", to: "anomaly" },
      ],
    },
    featured: false, // kept as real, working data — not surfaced in the primary homepage experience (see MPLS as the sole flagship project)
    details: {
      overview:
        "A deep-learning intrusion detection system designed for localized, real-time packet analysis: traffic features are reduced with PCA, an LSTM autoencoder learns to reconstruct normal traffic, and anomalies are flagged by reconstruction error rather than a fixed signature set.",
      architectureNote:
        "Raw NSL-KDD traffic features are extracted and normalized, reduced from 41 to 10 dimensions via PCA, then fed through an LSTM autoencoder whose reconstruction error over the input sequence is thresholded to classify traffic as normal or anomalous.",
      implementation:
        "Built on PyTorch with CUDA acceleration for the inference engine, and NumPy/Pandas for the preprocessing pipeline that cleans and vectorizes raw network features into normalized tensors ahead of inference.",
      results:
        "Achieves 85.4% detection accuracy on the NSL-KDD evaluation set after reducing the feature space from 41 to 10 dimensions, with 12 ms inference latency per sample — low enough for line-rate, edge-local deployment without a cloud round trip.",
      challenges:
        "Balancing the dimensionality reduction aggressive enough to keep inference latency low against retaining enough signal in the reduced feature set for the autoencoder to separate normal from anomalous traffic reliably.",
    },
    links: {
      repo: "https://github.com/meowlawat/Deep-NIDS",
    },
  },
];
