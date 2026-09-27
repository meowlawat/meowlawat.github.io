import type { SkillGroup } from "@/lib/types";

export const skills: SkillGroup[] = [
  {
    category: "Security & Systems",
    items: [
      "Penetration Testing",
      "Vulnerability Assessment",
      "CVSS",
      "API Security",
      "Burp Suite",
      "Nmap",
      "OWASP Top 10",
      "Intel SGX",
      "TEE Enclave Isolation",
      "AES-128-GCM",
    ],
  },
  {
    category: "AI / ML / Data",
    items: [
      "TensorFlow",
      "Keras",
      "PyTorch",
      "CUDA",
      "LSTM",
      "LSTM Autoencoders",
      "PCA",
      "NumPy",
      "Pandas",
      "Scikit-learn",
    ],
  },
  {
    category: "Engineering",
    items: ["Python", "C/C++", "SQL", "Git", "Docker", "FastAPI", "Jupyter"],
  },
];
