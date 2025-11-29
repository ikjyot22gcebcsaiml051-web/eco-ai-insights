import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Zap } from "lucide-react";
import { models } from "@/data/modelData";

interface AnalysisResult {
  category: string;
  multiplier: number;
  recommendedModel: string;
  explanation: string;
  energyResults: {
    model: string;
    baseEnergy: number;
    multiplier: number;
    estimatedEnergy: number;
  }[];
}

const PromptEstimator = () => {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzePrompt = () => {
    const lowerPrompt = prompt.toLowerCase();
    
    let category = "Unknown";
    let multiplier = 1.0;
    let recommendedModel = "GPT-4";
    let explanation = "Based on your query, GPT-4 provides a good balance of accuracy and efficiency.";

    // A. CODING / PROGRAMMING
    const codingKeywords = ["code", "program", "programming", "script", "bug", "function", "loop", "build", "compile"];
    const leetcodeKeywords = ["leetcode", "lc", "two sum", "array", "linked list", "tree", "dp", "dynamic programming"];
    
    const hasCodingKeyword = codingKeywords.some(kw => lowerPrompt.includes(kw));
    const hasLeetcodeKeyword = leetcodeKeywords.some(kw => lowerPrompt.includes(kw));
    
    if (hasCodingKeyword || hasLeetcodeKeyword) {
      category = "Coding / Programming";
      multiplier = 3.0;
      
      if (hasLeetcodeKeyword) {
        recommendedModel = "GPT-4";
        explanation = "ChatGPT has the largest repository of solved LeetCode-style patterns and answers.";
      } else {
        recommendedModel = "Claude 3";
        explanation = "Claude performs extremely well on code reasoning and analysis.";
      }
    }
    // B. MATHS / PHYSICS
    else if (
      ["sin", "cos", "tan", "theta", "integral", "derivative", "physics", "calculation", "equation", "solve", "sqrt", "power", "x^2", "x2", "numbers"].some(kw => lowerPrompt.includes(kw))
    ) {
      category = "Maths / Physics";
      multiplier = 2.0;
      recommendedModel = "GPT-4";
      explanation = "GPT-4 excels at mathematical reasoning and physics problem solving.";
    }
    // C. REASONING / LOGIC PUZZLES
    else if (
      ["reason", "logical", "mother", "father", "grandmother", "east", "west", "north", "south", "puzzle", "riddle", "who", "which", "why"].some(kw => lowerPrompt.includes(kw))
    ) {
      category = "Reasoning / Logic Puzzles";
      multiplier = 3.2;
      recommendedModel = "Claude 3";
      explanation = "Claude 3 offers the best logical consistency for complex reasoning tasks.";
    }
    // D. GENERAL QUERY
    else if (
      ["hello", "hi", "good morning", "news", "summarize news", "essay", "letter", "explain", "write", "story", "latest"].some(kw => lowerPrompt.includes(kw))
    ) {
      category = "General Query";
      multiplier = 1.0;
      recommendedModel = "Gemini (Google)";
      explanation = "Gemini is connected to Google search and handles fresh/news data well.";
    }
    // E. UNKNOWN CATEGORY
    else {
      category = "Unknown";
      multiplier = 1.0;
      recommendedModel = "GPT-4";
      explanation = "No specific keywords detected. GPT-4 is a reliable choice for general tasks.";
    }

    // Calculate energy for all models
    const energyResults = [
      {
        model: "GPT-4",
        baseEnergy: 0.0008,
        multiplier: multiplier,
        estimatedEnergy: 0.0008 * multiplier,
      },
      {
        model: "Grok-1.5",
        baseEnergy: 0.0012,
        multiplier: multiplier,
        estimatedEnergy: 0.0012 * multiplier,
      },
      {
        model: "Claude 3",
        baseEnergy: 0.0009,
        multiplier: multiplier,
        estimatedEnergy: 0.0009 * multiplier,
      },
      {
        model: "Llama-3 70B",
        baseEnergy: 0.0003,
        multiplier: multiplier,
        estimatedEnergy: 0.0003 * multiplier,
      },
    ];

    setResult({
      category,
      multiplier,
      recommendedModel,
      explanation,
      energyResults,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Prompt Energy Estimator</h1>
            <p className="text-muted-foreground">
              Estimate energy consumption based on your prompt type
            </p>
          </div>

          {/* Tip Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Tip: Please include category words like 'code', 'math', 'news', or 'reasoning' in your prompt for better estimation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Prompt</CardTitle>
              <CardDescription>Type the prompt you want to analyze</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Type your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px]"
              />
              <Button 
                onClick={analyzePrompt} 
                disabled={!prompt.trim()}
                className="w-full gap-2"
              >
                <Zap className="h-4 w-4" />
                Analyze Prompt
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Category and Recommendation */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Detected Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      {result.category}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-3">
                      Energy Multiplier: <span className="font-semibold text-foreground">{result.multiplier}×</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Recommended Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-lg text-primary mb-2">{result.recommendedModel}</p>
                    <p className="text-sm text-foreground/80">{result.explanation}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Energy Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Energy Estimates by Model</CardTitle>
                  <CardDescription>Estimated energy consumption per query</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Model</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Base Energy (kWh)</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Multiplier</th>
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Estimated Energy (kWh)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.energyResults.map((row, idx) => (
                          <tr 
                            key={row.model} 
                            className={`border-b last:border-0 ${idx % 2 === 0 ? 'bg-muted/20' : ''}`}
                          >
                            <td className="py-3 px-4 font-medium">{row.model}</td>
                            <td className="py-3 px-4">{row.baseEnergy.toFixed(6)}</td>
                            <td className="py-3 px-4">{row.multiplier.toFixed(1)}×</td>
                            <td className="py-3 px-4 font-semibold text-primary">
                              {row.estimatedEnergy.toFixed(6)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PromptEstimator;
