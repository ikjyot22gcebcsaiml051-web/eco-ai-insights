export interface ModelData {
  id: string;
  name: string;
  company: string;
  architecture: string;
  energyPerQuery: number;
  answerQuality: number;
  efficiency: number;
  carbonEmission: number;
  websiteUrl: string;
  energySources: {
    solar?: number;
    wind?: number;
    nuclear?: number;
    grid?: number;
    renewable?: number;
  };
  monthlyData: {
    energyKwh: number[];
    efficiency: number[];
    carbonG: number[];
  };
}

export const models: Record<string, ModelData> = {
  gpt4: {
    id: "gpt4",
    name: "GPT-4",
    company: "OpenAI",
    architecture: "Transformer",
    energyPerQuery: 0.0008,
    answerQuality: 95,
    efficiency: 118.75,
    carbonEmission: 3.0,
    websiteUrl: "https://openai.com",
    energySources: {
      solar: 20,
      wind: 25,
      nuclear: 5,
      grid: 50,
    },
    monthlyData: {
      energyKwh: [0.00070, 0.00075, 0.00078, 0.00080, 0.00082, 0.00085, 0.00088, 0.00083, 0.00080, 0.00078, 0.00076, 0.00079],
      efficiency: [120, 119, 118, 118, 117, 116, 115, 116, 118, 119, 121, 120],
      carbonG: [2.8, 2.9, 2.95, 3.0, 3.05, 3.1, 3.15, 3.05, 3.0, 2.95, 2.9, 2.95],
    },
  },
  grok: {
    id: "grok",
    name: "Grok-1.5",
    company: "xAI",
    architecture: "Mixture-of-Experts",
    energyPerQuery: 0.0012,
    answerQuality: 90,
    efficiency: 75,
    carbonEmission: 3.75,
    websiteUrl: "https://x.ai",
    energySources: {
      solar: 40,
      wind: 60,
    },
    monthlyData: {
      energyKwh: [0.00110, 0.00115, 0.00118, 0.00120, 0.00122, 0.00125, 0.00130, 0.00135, 0.00132, 0.00128, 0.00124, 0.00120],
      efficiency: [80, 79, 78, 77, 76, 75, 74, 74, 75, 76, 77, 78],
      carbonG: [3.5, 3.6, 3.65, 3.7, 3.75, 3.8, 3.9, 4.0, 3.9, 3.85, 3.8, 3.75],
    },
  },
  claude3: {
    id: "claude3",
    name: "Claude 3",
    company: "Anthropic",
    architecture: "Transformer",
    energyPerQuery: 0.0009,
    answerQuality: 92,
    efficiency: 102.22,
    carbonEmission: 2.5,
    websiteUrl: "https://www.anthropic.com",
    energySources: {
      renewable: 100,
    },
    monthlyData: {
      energyKwh: [0.00085, 0.00086, 0.00087, 0.00088, 0.00090, 0.00092, 0.00093, 0.00094, 0.00093, 0.00091, 0.00089, 0.00088],
      efficiency: [105, 104, 104, 103, 103, 102, 102, 103, 104, 105, 106, 107],
      carbonG: [2.3, 2.35, 2.4, 2.45, 2.5, 2.55, 2.6, 2.55, 2.5, 2.45, 2.4, 2.45],
    },
  },
  llama3: {
    id: "llama3",
    name: "Llama-3 70B",
    company: "Meta",
    architecture: "Transformer",
    energyPerQuery: 0.0003,
    answerQuality: 85,
    efficiency: 283.33,
    carbonEmission: 1.4,
    websiteUrl: "https://ai.meta.com/llama",
    energySources: {
      solar: 80,
      grid: 20,
    },
    monthlyData: {
      energyKwh: [0.00025, 0.00026, 0.00027, 0.00028, 0.00029, 0.00030, 0.00031, 0.00032, 0.00031, 0.00030, 0.00029, 0.00028],
      efficiency: [280, 282, 283, 284, 285, 286, 287, 287, 286, 285, 284, 283],
      carbonG: [1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5, 1.45, 1.4, 1.35, 1.3, 1.35],
    },
  },
};

export const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
