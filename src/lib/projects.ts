export const projects = [
  {
    slug: "aura-audio",
    name: "AURA",
    category: "E-commerce / 3D experience",
    year: "2026",
    type: "audio",
    title: "Sound. In a different dimension.",
    description:
      "An immersive product story for an imagined high-fidelity audio brand.",
    brief:
      "Make the craft of a premium speaker tangible before a customer ever hears it.",
    response:
      "A sculptural product stage, material exploration, and a focused path from discovery to purchase.",
    value:
      "Designed to answer product questions through visual exploration and make purchase decisions feel considered.",
    color: "sage",
  },
  {
    slug: "monument-architecture",
    name: "MONUMENT",
    category: "Brand platform / Web design",
    year: "2026",
    type: "architecture",
    title: "Space to see things differently.",
    description:
      "An editorial digital home for a fictional architecture practice.",
    brief: "Give spatial design the quiet, generous presentation it deserves.",
    response:
      "Architectural compositions, restrained navigation, and a project narrative that puts the work first.",
    value:
      "Designed to help prospective clients understand a practice’s point of view and start a relevant conversation.",
    color: "sand",
  },
  {
    slug: "orbit-finance",
    name: "ORBIT",
    category: "Digital product / Interface design",
    year: "2026",
    type: "interface",
    title: "Complexity, brought into focus.",
    description:
      "An experimental interface for an imagined personal finance product.",
    brief: "Turn dense information into a calm and useful daily overview.",
    response:
      "A clear information hierarchy, responsive charts, and small moments of motion that explain state changes.",
    value:
      "Designed to make essential information easier to scan and common actions easier to discover.",
    color: "lavender",
  },
] as const;
export type Project = (typeof projects)[number];
