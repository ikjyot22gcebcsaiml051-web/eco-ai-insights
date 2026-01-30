import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CarbonEquivalencyWidget } from "@/components/CarbonEquivalencyWidget";
import { Lightbulb, Zap } from "lucide-react";
import { models } from "@/data/modelData";

interface AnalysisResult {
  category: string;
  multiplier: number;
  recommendedModel: string;
  explanation: string;
  estimatedCO2: number;
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
  const [isLoading, setIsLoading] = useState(false);

  const analyzePrompt = () => {
    setIsLoading(true);
    setResult(null);
    
    setTimeout(() => {
    const lowerPrompt = prompt.toLowerCase();
    
    let category = "Unknown";
    let multiplier = 1.0;
    let recommendedModel = "GPT-4";
    let explanation = "Based on your query, GPT-4 provides a good balance of accuracy and efficiency.";

    // A. CODING / PROGRAMMING
    const codingKeywords = ["code", "program", "programming", "script", "bug", "function", "loop", "build", "compile", "json", "api", "backend", "endpoint", "algorithm", "database"];
    const leetcodeKeywords = ["leetcode", "lc", "two sum", "array", "linked list", "tree", "dp", "dynamic programming"];
    
    const hasCodingKeyword = codingKeywords.some(kw => lowerPrompt.includes(kw));
    const hasLeetcodeKeyword = leetcodeKeywords.some(kw => lowerPrompt.includes(kw));
    
    if (hasCodingKeyword || hasLeetcodeKeyword) {
      category = "Coding / Programming";
      multiplier = 3.0 + (Math.random() * 0.2 - 0.1);
      
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
      ["sin", "cos", "tan", "theta", "integral", "derivative", "physics", "calculation", "equation", "solve", "sqrt", "power", "x^2", "x2", "numbers", "pi", "radians", "degrees", "vector", "matrix", "log"].some(kw => lowerPrompt.includes(kw))
    ) {
      category = "Maths / Physics";
      multiplier = 2.0 + (Math.random() * 0.2 - 0.1);
      recommendedModel = "GPT-4";
      explanation = "GPT-4 excels at mathematical reasoning and physics problem solving.";
    }
    // C. REASONING / LOGIC PUZZLES
    else if (
      ["reason", "logical", "mother", "father", "grandmother", "east", "west", "north", "south", "puzzle", "riddle", "who", "which", "why", "relation", "compare", "stronger", "weaker", "logic problem"].some(kw => lowerPrompt.includes(kw))
    ) {
      category = "Reasoning / Logic Puzzles";
      multiplier = 3.2 + (Math.random() * 0.3 - 0.15);
      recommendedModel = "Claude 3";
      explanation = "Claude 3 offers the best logical consistency for complex reasoning tasks.";
    }
    // D. GENERAL QUERY
    else if (
      ["hello", "hi", "good morning", "news", "summarize news", "essay", "letter", "explain", "write", "story", "latest"].some(kw => lowerPrompt.includes(kw))
    ) {
      category = "General Query";
      multiplier = 1.0 + (Math.random() * 0.1 - 0.05);
      recommendedModel = "Efficient LLM";
      explanation = "Optimized for general queries with lower energy footprint and fast response times.";
    }
    // E. UNKNOWN CATEGORY
    else {
      category = "Unknown";
      multiplier = 1.0 + (Math.random() * 0.1 - 0.05);
      recommendedModel = "GPT-4";
      explanation = "No specific keywords detected. GPT-4 is a reliable choice for general tasks.";
    }

    // Calculate energy for all models with updated CO₂ values
    const energyResults = [
      {
        model: "GPT-4",
        baseEnergy: 0.0008,
        baseCO2: 3.0,
        multiplier: multiplier,
        estimatedEnergy: 0.0008 * multiplier,
        estimatedCO2: 3.0 * multiplier,
      },
      {
        model: "Grok-1.5",
        baseEnergy: 0.0012,
        baseCO2: 3.75,
        multiplier: multiplier,
        estimatedEnergy: 0.0012 * multiplier,
        estimatedCO2: 3.75 * multiplier,
      },
      {
        model: "Claude 3",
        baseEnergy: 0.0009,
        baseCO2: 2.5,
        multiplier: multiplier,
        estimatedEnergy: 0.0009 * multiplier,
        estimatedCO2: 2.5 * multiplier,
      },
      {
        model: "Llama-3 70B",
        baseEnergy: 0.0003,
        baseCO2: 1.4,
        multiplier: multiplier,
        estimatedEnergy: 0.0003 * multiplier,
        estimatedCO2: 1.4 * multiplier,
      },
    ];

    const recommendedModelData = energyResults.find(r => r.model === recommendedModel);
    const estimatedCO2 = recommendedModelData?.estimatedCO2 || 3.0;

      setResult({
        category,
        multiplier,
        recommendedModel,
        explanation,
        estimatedCO2,
        energyResults,
      });
      setIsLoading(false);
    }, 5000);
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

          {/* Loading State */}
          {isLoading && (
            <Card className="animate-in fade-in duration-500">
              <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="animate-spin">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <p className="text-lg font-medium text-foreground animate-pulse">
                  Analyzing your prompt… Recommending the best model…
                </p>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && !isLoading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Reasoning Warning */}
              {result.category === "Reasoning / Logic Puzzles" && (
                <Card className="border-destructive/50 bg-destructive/10">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 text-destructive mt-0.5">⚠️</div>
                      <div>
                        <p className="text-sm font-medium text-destructive">
                          Note: No current AI model gives consistently accurate reasoning answers. It is better to verify or solve reasoning problems manually.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Detected Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detected Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    {result.category}
                  </Badge>
                </CardContent>
              </Card>

              {/* Recommended Model - Large Card */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Zap className="h-6 w-6 text-primary" />
                    Recommended Model
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {result.recommendedModel.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-2xl text-primary">{result.recommendedModel}</p>
                      <p className="text-sm text-foreground/80 mt-1">{result.explanation}</p>
                    </div>
                  </div>
                  <Button asChild className="w-full gap-2">
                    <Link to={`/models/${result.recommendedModel.toLowerCase().replace(/\s+/g, '-')}`}>
                      Visit Model Page
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Estimated Energy */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Estimated Energy Consumption</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">
                    {result.energyResults.find(r => r.model === result.recommendedModel)?.estimatedEnergy.toFixed(6) || "N/A"} kWh
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Estimated energy used per query for {result.recommendedModel}
                  </p>
                </CardContent>
              </Card>

              {/* Carbon Equivalency Widget */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Environmental Impact</CardTitle>
                  <CardDescription>What does {result.estimatedCO2.toFixed(2)}g CO₂ mean in real terms?</CardDescription>
                </CardHeader>
                <CardContent>
                  <CarbonEquivalencyWidget totalCO2={result.estimatedCO2} />
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
