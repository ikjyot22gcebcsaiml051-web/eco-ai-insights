// Phrase replacement dictionary
export const phraseReplacements: Record<string, string> = {
  "can you please": "",
  "could you please": "",
  "would you please": "",
  "i want you to": "",
  "i would like you to": "",
  "i need you to": "",
  "is it possible to": "",
  "is it possible for you to": "",
  "could you help me": "",
  "can you help me": "",
  "would you be able to": "",
  "in a simple way": "simply",
  "in simple words": "simply",
  "in simple terms": "simply",
  "in detail": "",
  "in great detail": "",
  "step by step explanation": "steps",
  "step-by-step explanation": "steps",
  "as much as possible": "",
  "if possible": "",
  "for me": "",
  "please kindly": "",
  "kindly": "",
  "please": "",
  "i want": "",
  "i need": "",
  "i would like": "",
  "help me with": "",
  "help me to": "",
  "help me": "",
  "assist me with": "",
  "assist me to": "",
  "assist me": "",
};

// Clause compression patterns
export const clauseCompressions: Record<string, string> = {
  "what are the steps involved in": "steps to",
  "what are the steps to": "steps to",
  "how can i go about solving": "how to solve",
  "how can i go about": "how to",
  "how do i go about": "how to",
  "is it possible for you to": "can you",
  "would it be possible to": "",
  "can you explain to me": "explain",
  "could you explain to me": "explain",
  "can you tell me about": "explain",
  "could you tell me about": "explain",
  "can you describe": "describe",
  "can you provide": "provide",
  "can you give me": "give",
  "can you write": "write",
  "can you create": "create",
  "can you generate": "generate",
  "can you make": "make",
  "i was wondering if": "",
  "i am wondering if": "",
  "i'm wondering if": "",
  "do you think you could": "",
  "do you think you can": "",
  "would you mind": "",
  "i was hoping you could": "",
  "i'm hoping you could": "",
};

// Sentence normalization patterns (polite → instruction)
export const sentenceNormalizations: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /^can you (please )?explain (how|what|why|when)/i, replacement: "Explain $2" },
  { pattern: /^could you (please )?explain (how|what|why|when)/i, replacement: "Explain $2" },
  { pattern: /^can you (please )?help me (understand|learn|with)/i, replacement: "$2" },
  { pattern: /^i want you to help me with/i, replacement: "" },
  { pattern: /^i want you to/i, replacement: "" },
  { pattern: /^i would like you to/i, replacement: "" },
  { pattern: /^i need help (with|to|understanding)/i, replacement: "" },
  { pattern: /^please (help me )?(to )?/i, replacement: "" },
];

// Redundant filler words/phrases to remove
export const redundantPatterns = [
  /\bvery\s+/gi,
  /\breally\s+/gi,
  /\bactually\s+/gi,
  /\bbasically\s+/gi,
  /\bjust\s+/gi,
  /\bliterally\s+/gi,
  /\bsimply\s+(?=simply)/gi, // Remove duplicate "simply"
  /\bobviously\s+/gi,
  /\bclearly\s+/gi,
  /\bdefinitely\s+/gi,
  /\babsolutely\s+/gi,
  /\bextremely\s+/gi,
  /\btotally\s+/gi,
  /\bcompletely\s+/gi,
  /\bentirely\s+/gi,
  /\bperhaps\s+/gi,
  /\bmaybe\s+/gi,
  /\bkind of\s+/gi,
  /\bsort of\s+/gi,
  /\blike\s+/gi,
  /\bi think\s+/gi,
  /\bi believe\s+/gi,
  /\bin my opinion\s+/gi,
  /\bit is important to note that\s+/gi,
  /\bit should be noted that\s+/gi,
  /\bthe fact that\s+/gi,
];

// Action verbs for instruction rewriting
export const actionVerbs = [
  "write", "explain", "summarize", "generate", "solve", "analyze",
  "create", "describe", "list", "compare", "define", "calculate",
  "implement", "design", "develop", "build", "outline", "evaluate",
  "identify", "demonstrate", "illustrate", "discuss", "review"
];

export interface OptimizationResult {
  original: string;
  refined: string;
  stepsApplied: string[];
  tokensBefore: number;
  tokensAfter: number;
  tokenReduction: number;
  verbosityReduction: number;
  co2Saved: number;
  efficiencyGain: number;
}

// CO₂ per token (grams) - based on average model consumption
const CO2_PER_TOKEN = 0.0001;

export function optimizePrompt(input: string): OptimizationResult {
  const stepsApplied: string[] = [];
  let text = input.trim();
  const originalLength = text.length;

  // Step 1: Sentence Normalization
  const beforeNormalization = text;
  sentenceNormalizations.forEach(({ pattern, replacement }) => {
    text = text.replace(pattern, replacement);
  });
  if (text !== beforeNormalization) {
    stepsApplied.push("Converted polite phrasing to instruction format");
  }

  // Step 2: Phrase Replacement Dictionary
  const beforePhraseReplacement = text;
  Object.entries(phraseReplacements).forEach(([phrase, replacement]) => {
    const regex = new RegExp(phrase, "gi");
    text = text.replace(regex, replacement);
  });
  if (text !== beforePhraseReplacement) {
    stepsApplied.push("Removed polite filler phrases");
  }

  // Step 3: Clause Compression
  const beforeCompression = text;
  Object.entries(clauseCompressions).forEach(([verbose, concise]) => {
    const regex = new RegExp(verbose, "gi");
    text = text.replace(regex, concise);
  });
  if (text !== beforeCompression) {
    stepsApplied.push("Compressed verbose clause structures");
  }

  // Step 4: Redundancy Removal
  const beforeRedundancy = text;
  redundantPatterns.forEach((pattern) => {
    text = text.replace(pattern, "");
  });
  if (text !== beforeRedundancy) {
    stepsApplied.push("Removed redundant filler words");
  }

  // Step 5: Clean up whitespace
  text = text.replace(/\s+/g, " ").trim();

  // Step 6: Instruction Rewriting - ensure starts with action verb
  const beforeRewriting = text;
  const firstWord = text.split(" ")[0]?.toLowerCase() || "";
  const startsWithActionVerb = actionVerbs.some(
    (verb) => firstWord === verb || firstWord === verb + "s" || firstWord === verb + "ing"
  );

  if (!startsWithActionVerb && text.length > 0) {
    // Try to identify the intent and add appropriate action verb
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes("code") || lowerText.includes("program") || lowerText.includes("function")) {
      text = "Write " + text.charAt(0).toLowerCase() + text.slice(1);
      stepsApplied.push("Added action verb 'Write' for code-related task");
    } else if (lowerText.includes("explain") || lowerText.includes("what is") || lowerText.includes("how does")) {
      text = text.replace(/^(what is|how does)/i, "Explain");
      if (!text.toLowerCase().startsWith("explain")) {
        text = "Explain " + text.charAt(0).toLowerCase() + text.slice(1);
      }
      stepsApplied.push("Restructured as explanation instruction");
    } else if (lowerText.includes("summary") || lowerText.includes("summarize")) {
      if (!text.toLowerCase().startsWith("summarize")) {
        text = "Summarize " + text.charAt(0).toLowerCase() + text.slice(1);
      }
      stepsApplied.push("Restructured as summarization instruction");
    } else if (lowerText.includes("list") || lowerText.includes("give me")) {
      text = text.replace(/^give me (a )?/i, "List ");
      if (!text.toLowerCase().startsWith("list")) {
        text = "List " + text.charAt(0).toLowerCase() + text.slice(1);
      }
      stepsApplied.push("Restructured as list instruction");
    }
  }

  // Step 7: Capitalize first letter and ensure proper ending
  if (text.length > 0) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
    
    // Remove trailing punctuation issues and ensure clean ending
    text = text.replace(/[,;:\s]+$/, "");
    
    if (!text.match(/[.?!]$/)) {
      text += ".";
    }
  }

  // Calculate metrics
  const tokensBefore = Math.ceil(input.length / 4);
  const tokensAfter = Math.ceil(text.length / 4);
  const tokenReduction = tokensBefore > 0 
    ? ((tokensBefore - tokensAfter) / tokensBefore) * 100 
    : 0;
  const verbosityReduction = originalLength > 0
    ? ((originalLength - text.length) / originalLength) * 100
    : 0;
  const co2Saved = Math.max(0, (tokensBefore - tokensAfter) * CO2_PER_TOKEN);
  const efficiencyGain = tokensBefore > 0 
    ? ((tokensBefore - tokensAfter) / tokensBefore) * 100 
    : 0;

  if (stepsApplied.length === 0 && text !== input) {
    stepsApplied.push("Minor cleanup applied");
  }

  return {
    original: input,
    refined: text,
    stepsApplied,
    tokensBefore,
    tokensAfter,
    tokenReduction: Math.max(0, tokenReduction),
    verbosityReduction: Math.max(0, verbosityReduction),
    co2Saved,
    efficiencyGain: Math.max(0, efficiencyGain),
  };
}

// Generate diff highlights between original and refined text
export function generateDiffHighlights(original: string, refined: string): {
  originalHighlighted: Array<{ text: string; removed: boolean }>;
  refinedHighlighted: Array<{ text: string; added: boolean }>;
} {
  const originalWords = original.split(/\s+/);
  const refinedWords = refined.split(/\s+/);
  const refinedLower = refinedWords.map(w => w.toLowerCase().replace(/[.,!?]/g, ""));

  const originalHighlighted = originalWords.map(word => {
    const cleanWord = word.toLowerCase().replace(/[.,!?]/g, "");
    const isRemoved = !refinedLower.includes(cleanWord);
    return { text: word, removed: isRemoved };
  });

  const originalLower = originalWords.map(w => w.toLowerCase().replace(/[.,!?]/g, ""));
  
  const refinedHighlighted = refinedWords.map(word => {
    const cleanWord = word.toLowerCase().replace(/[.,!?]/g, "");
    const isAdded = !originalLower.includes(cleanWord);
    return { text: word, added: isAdded };
  });

  return { originalHighlighted, refinedHighlighted };
}
