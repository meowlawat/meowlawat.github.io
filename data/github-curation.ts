/**
 * Manually maintained curation config for the "More on GitHub" section.
 * Edited by hand — scripts/fetch-github.ts reads this to decide which
 * repositories to include and how to present them, but never writes to it.
 *
 * Repos already covered as full case studies (mpls-copilot, Deep-NIDS) are
 * intentionally left out here to avoid duplicating them.
 */
export interface CuratedRepo {
  /** Exact GitHub repository name (case-sensitive). */
  name: string;
  /** Overrides the repo's GitHub description when set (sourced from its README, never invented). */
  descriptionOverride?: string;
  /** Short category label shown on the card. */
  category: string;
  /** Display order in the section (ascending). */
  order: number;
}

export const githubCuration: CuratedRepo[] = [
  {
    name: "AetherGraph",
    category: "Security Research",
    order: 1,
  },
  {
    name: "Deep-Learning-for-Targeted-Threat-Mitigation",
    category: "Machine Learning / Security",
    order: 2,
    descriptionOverride:
      "Detects spear-phishing emails with a hyperparameter-tuned LSTM classifier (TensorFlow/Keras, KerasTuner), optimized for high recall on enterprise threat data.",
  },
  {
    name: "AuthPrint",
    category: "Machine Learning / Security",
    order: 3,
    descriptionOverride:
      "Identity-based moderation engine: flags AI-generated submissions by fingerprinting a creator's stylometric writing habits (character n-gram TF-IDF, stylistic drift) instead of analyzing text content.",
  },
];
