import type { Finding } from "@/lib/types";

export const findings: Finding[] = [
  {
    id: "api-race-condition",
    title: "API race condition & rate-limit bypass",
    fragment: ["API", "RACE CONDITION"],
    description:
      "Concurrent request timing exposed a critical race condition and a rate-limit bypass in a production API.",
    source: "IdeaPulley Bug Hunt",
    year: "2026",
  },
  {
    id: "authorization-bypass",
    title: "Authorization bypass & parameter tampering",
    fragment: ["AUTH", "PARAMETER MANIPULATION"],
    description:
      "Credit-deduction logic bypass, authorization bypass, parameter tampering, and Clerk auth-metadata manipulation chained into a full authorization failure.",
    source: "IdeaPulley Bug Hunt",
    year: "2026",
  },
  {
    id: "spectral-confounding",
    title: "Spectral confounding in watermark–detector interference",
    fragment: ["DEEPFAKE", "MEDIA AUTHENTICITY"],
    description:
      "A PSNR-matched control for measuring watermark/detector interference is spectrally inverted relative to the watermark it stands in for — a stronger, spectrum-matched control closes the gap for one detector but the effect doesn't generalize across architectures.",
    source: "Independent research, with Yuv Jindal (VIPS-TC)",
    year: "2026",
    status: "Manuscript-ready — not yet submitted, no DOI or venue",
  },
];
