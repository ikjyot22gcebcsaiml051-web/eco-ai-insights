import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Wand2, Leaf, Scissors, Sparkles } from "lucide-react";
import { CarbonEquivalencyWidget } from "@/components/CarbonEquivalencyWidget";

// Verbose phrases and their concise replacements
const verboseReplacements: Record<string, string> = {
  "in order to": "to",
  "due to the fact that": "because",
  "at this point in time": "now",
  "in the event that": "if",
  "for the purpose of": "to",
  "with regard to": "about",
  "in spite of the fact that": "although",
  "on a daily basis": "daily",
  "at the present time": "now",
  "in the near future": "soon",
  "make a decision": "decide",
  "give consideration to": "consider",
  "is able to": "can",
  "has the ability to": "can",
  "in addition to": "also",
  "a large number of": "many",
  "the majority of": "most",
  "in my opinion": "",
  "i think that": "",
  "i believe that": "",
  "it is important to note that": "",
  "please": "",
  "kindly": "",
  "could you please": "can you",
  "would you be able to": "can you",
  "i would like you to": "",
  "can you help me": "",
  "i need help with": "",
  "i want to know": "what is",
  "tell me about": "explain",
  "give me information about": "explain",
  "provide me with": "give",
  "as well as": "and",
  "in terms of": "regarding",
  "with respect to": "about",
  "take into account": "consider",
  "a number of": "several",
  "the fact that": "that",
  "it should be noted that": "",
  "there is a possibility that": "possibly",
  "has the capability to": "can",
};

// Redundant words to remove
const redundantPatterns = [
  /\bvery\s+/gi,
  /\breally\s+/gi,
  /\bactually\s+/gi,
  /\bbasically\s+/gi,
  /\bjust\s+/gi,
  /\bliterally\s+/gi,
  /\bsimply\s+/gi,
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
];

const refinePrompt = (text: string): string => {
  let refined = text.toLowerCase();

  // Replace verbose phrases
  Object.entries(verboseReplacements).forEach(([verbose, concise]) => {
    refined = refined.replace(new RegExp(verbose, "gi"), concise);
  });

  // Remove redundant words
  redundantPatterns.forEach((pattern) => {
    refined = refined.replace(pattern, "");
  });

  // Clean up multiple spaces
  refined = refined.replace(/\s+/g, " ").trim();

  // Capitalize first letter
  refined = refined.charAt(0).toUpperCase() + refined.slice(1);

  // Ensure ends with proper punctuation
  if (refined && !refined.match(/[.?!]$/)) {
    refined += ".";
  }

  return refined;
};

const PromptRefiner = () => {
  const [inputPrompt, setInputPrompt] = useState("");
  const [refinedPrompt, setRefinedPrompt] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [metrics, setMetrics] = useState({
    tokensBefore: 0,
    tokensAfter: 0,
    tokenReduction: 0,
    co2Saved: 0,
  });

  // CO₂ per token (estimated based on GPT-4 average)
  const CO2_PER_TOKEN = 0.0001; // grams

  const handleRefine = () => {
    if (!inputPrompt.trim()) return;

    setIsRefining(true);
    setShowResults(false);

    setTimeout(() => {
      const refined = refinePrompt(inputPrompt);
      const tokensBefore = Math.ceil(inputPrompt.length / 4);
      const tokensAfter = Math.ceil(refined.length / 4);
      const tokenReduction = tokensBefore > 0 
        ? ((tokensBefore - tokensAfter) / tokensBefore) * 100 
        : 0;
      const co2Saved = (tokensBefore - tokensAfter) * CO2_PER_TOKEN;

      setRefinedPrompt(refined);
      setMetrics({
        tokensBefore,
        tokensAfter,
        tokenReduction: Math.max(0, tokenReduction),
        co2Saved: Math.max(0, co2Saved),
      });
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
            Optimize your prompts to reduce tokens, save energy, and lower your carbon footprint
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 backdrop-blur-sm bg-card/80 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-primary" />
              Enter Your Prompt
            </CardTitle>
            <CardDescription>
              Paste your prompt below and we'll optimize it for efficiency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type or paste your prompt here... e.g., 'Could you please help me understand in order to learn about the basics of machine learning and artificial intelligence in the near future?'"
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
                  Refining...
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
              <span>Optimizing your prompt...</span>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="animate-fade-in space-y-8">
            {/* Comparison Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="backdrop-blur-sm bg-card/80 border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive" />
                    Original Prompt
                  </CardTitle>
                  <CardDescription>
                    {metrics.tokensBefore} estimated tokens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{inputPrompt}</p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/80 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    Refined Prompt
                  </CardTitle>
                  <CardDescription>
                    {metrics.tokensAfter} estimated tokens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap font-medium">{refinedPrompt}</p>
                </CardContent>
              </Card>
            </div>

            {/* Metrics Badges */}
            <div className="flex flex-wrap justify-center gap-4">
              <Badge 
                variant="outline" 
                className="px-6 py-3 text-lg bg-gradient-to-r from-chart-2/10 to-chart-2/20 border-chart-2/30"
              >
                <Scissors className="h-5 w-5 mr-2 text-chart-2" />
                Token Reduction: {metrics.tokenReduction.toFixed(1)}%
              </Badge>
              <Badge 
                variant="outline" 
                className="px-6 py-3 text-lg bg-gradient-to-r from-primary/10 to-chart-3/20 border-primary/30"
              >
                <Leaf className="h-5 w-5 mr-2 text-primary" />
                CO₂ Savings: {metrics.co2Saved.toFixed(4)} grams
              </Badge>
            </div>

            {/* Carbon Equivalency Widget */}
            {metrics.co2Saved > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-center">
                  Your savings are equivalent to:
                </h3>
                <CarbonEquivalencyWidget totalCO2={metrics.co2Saved} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PromptRefiner;
