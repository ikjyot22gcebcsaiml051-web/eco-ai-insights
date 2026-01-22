import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Wand2, Leaf, Scissors, Sparkles, Edit, CheckCircle2, Info } from "lucide-react";
import { CarbonEquivalencyWidget } from "@/components/CarbonEquivalencyWidget";
import { optimizePrompt, generateDiffHighlights, type OptimizationResult } from "@/lib/promptOptimizer";

const PromptRefiner = () => {
  const [inputPrompt, setInputPrompt] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showDiffMode, setShowDiffMode] = useState(true);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [diffHighlights, setDiffHighlights] = useState<{
    originalHighlighted: Array<{ text: string; removed: boolean }>;
    refinedHighlighted: Array<{ text: string; added: boolean }>;
  } | null>(null);

  const handleRefine = () => {
    if (!inputPrompt.trim()) return;

    setIsRefining(true);
    setShowResults(false);

    setTimeout(() => {
      const optimizationResult = optimizePrompt(inputPrompt);
      const highlights = generateDiffHighlights(inputPrompt, optimizationResult.refined);
      
      setResult(optimizationResult);
      setDiffHighlights(highlights);
      setIsRefining(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-chart-2/20">
              <Wand2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Prompt Refiner</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Semantically optimize your prompts to reduce tokens, save energy, and lower your carbon footprint
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 backdrop-blur-sm bg-card/80 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-primary" />
              Enter Your Prompt
            </CardTitle>
            <CardDescription>
              Paste your verbose prompt below and we'll semantically optimize it for efficiency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., 'Can you please help me write a Python program that calculates the factorial of a number in a simple way step by step?'"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="min-h-[150px] mb-4 bg-background/50"
            />
            <Button 
              onClick={handleRefine} 
              disabled={!inputPrompt.trim() || isRefining}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-chart-2 hover:opacity-90"
            >
              {isRefining ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Refine Prompt
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isRefining && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-muted-foreground">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span>Applying semantic optimization pipeline...</span>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && result && (
          <div className="animate-fade-in space-y-8">
            {/* Diff Mode Toggle */}
            <div className="flex justify-center">
              <Button
                variant={showDiffMode ? "default" : "outline"}
                size="sm"
                onClick={() => setShowDiffMode(!showDiffMode)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                {showDiffMode ? "Diff Highlight On" : "Diff Highlight Off"}
              </Button>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Original Prompt Card */}
              <Card className="backdrop-blur-sm bg-card/80 border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    Original Prompt
                  </CardTitle>
                  <CardDescription>
                    {result.tokensBefore} estimated tokens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showDiffMode && diffHighlights ? (
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {diffHighlights.originalHighlighted.map((item, idx) => (
                        <span
                          key={idx}
                          className={item.removed ? "bg-destructive/20 text-destructive line-through mx-0.5" : ""}
                        >
                          {item.text}{" "}
                        </span>
                      ))}
                    </p>
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-wrap">{result.original}</p>
                  )}
                </CardContent>
              </Card>

              {/* Refined Prompt Card */}
              <Card className="backdrop-blur-sm bg-card/80 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    Refined Prompt
                  </CardTitle>
                  <CardDescription>
                    {result.tokensAfter} estimated tokens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showDiffMode && diffHighlights ? (
                    <p className="text-foreground whitespace-pre-wrap font-medium leading-relaxed">
                      {diffHighlights.refinedHighlighted.map((item, idx) => (
                        <span
                          key={idx}
                          className={item.added ? "bg-primary/20 text-primary mx-0.5 px-1 rounded" : ""}
                        >
                          {item.text}{" "}
                        </span>
                      ))}
                    </p>
                  ) : (
                    <p className="text-foreground whitespace-pre-wrap font-medium">{result.refined}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Optimization Steps Panel */}
            <Card className="backdrop-blur-sm bg-card/80 border-chart-2/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-chart-2" />
                  Optimization Steps Applied
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">These are the semantic transformations applied to your prompt</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.stepsApplied.length > 0 ? (
                  <ul className="space-y-2">
                    {result.stepsApplied.map((step, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-sm">Your prompt was already optimized!</p>
                )}
              </CardContent>
            </Card>

            {/* Metrics Badges */}
            <div className="flex flex-wrap justify-center gap-4">
              <Badge 
                variant="outline" 
                className="px-6 py-3 text-lg bg-gradient-to-r from-chart-4/10 to-chart-4/20 border-chart-4/30"
              >
                <Edit className="h-5 w-5 mr-2 text-chart-4" />
                Verbosity Reduction: {result.verbosityReduction.toFixed(1)}%
              </Badge>
              <Badge 
                variant="outline" 
                className="px-6 py-3 text-lg bg-gradient-to-r from-chart-2/10 to-chart-2/20 border-chart-2/30"
              >
                <Scissors className="h-5 w-5 mr-2 text-chart-2" />
                Token Reduction: {result.tokenReduction.toFixed(1)}%
              </Badge>
              <Badge 
                variant="outline" 
                className="px-6 py-3 text-lg bg-gradient-to-r from-primary/10 to-chart-3/20 border-primary/30"
              >
                <Leaf className="h-5 w-5 mr-2 text-primary" />
                CO₂ Savings: {result.co2Saved.toFixed(4)} grams
              </Badge>
              <Badge 
                variant="outline" 
                className="px-6 py-3 text-lg bg-gradient-to-r from-chart-1/10 to-chart-1/20 border-chart-1/30"
              >
                <Sparkles className="h-5 w-5 mr-2 text-chart-1" />
                Efficiency Gain: {result.efficiencyGain.toFixed(1)}%
              </Badge>
            </div>

            {/* Carbon Equivalency Widget */}
            {result.co2Saved > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-center">
                  Your savings are equivalent to:
                </h3>
                <CarbonEquivalencyWidget totalCO2={result.co2Saved} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PromptRefiner;
