import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wand2, Leaf, Sparkles, Braces, Gauge, AlertCircle, Lightbulb, Zap, Target, TreeDeciduous } from "lucide-react";
import { CarbonEquivalencyWidget } from "@/components/CarbonEquivalencyWidget";
import { supabase } from "@/integrations/supabase/client";

interface PromptVariant {
  text: string;
  tokens: number;
  energyMultiplier: number;
  co2: number;
  label: string;
  description: string;
  recommendedFor: string;
  color: "destructive" | "warning" | "success";
}

interface RefinementResult {
  original: string;
  variants: {
    highAccuracy: PromptVariant;
    balanced: PromptVariant;
    minimal: PromptVariant;
  };
}

const CO2_PER_TOKEN = 0.0001;

const PromptRefiner = () => {
  const [inputPrompt, setInputPrompt] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<RefinementResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("balanced");

  const calculateVariantMetrics = (text: string, energyMultiplier: number) => {
    const tokens = Math.ceil(text.length / 4);
    const co2 = tokens * CO2_PER_TOKEN * energyMultiplier;
    return { tokens, co2 };
  };

  const handleRefine = async () => {
    if (!inputPrompt.trim()) return;

    setIsRefining(true);
    setShowResults(false);
    setError(null);

    // Minimum 5-second loading state
    const startTime = Date.now();

    try {
      const { data, error: functionError } = await supabase.functions.invoke('refine-prompt', {
        body: { prompt: inputPrompt }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to refine prompt');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Calculate metrics for each variant
      const highAccuracyMetrics = calculateVariantMetrics(data.variants.highAccuracy, 1.6);
      const balancedMetrics = calculateVariantMetrics(data.variants.balanced, 1.0);
      const minimalMetrics = calculateVariantMetrics(data.variants.minimal, 0.6);

      const refinementResult: RefinementResult = {
        original: inputPrompt,
        variants: {
          highAccuracy: {
            text: data.variants.highAccuracy,
            ...highAccuracyMetrics,
            energyMultiplier: 1.6,
            label: "High Accuracy (JSON | Higher Energy)",
            description: "Structured JSON format for maximum precision",
            recommendedFor: "Accuracy",
            color: "destructive",
          },
          balanced: {
            text: data.variants.balanced,
            ...balancedMetrics,
            energyMultiplier: 1.0,
            label: "Optimized Prompt (Balanced Efficiency)",
            description: "Clear, concise natural-language instruction",
            recommendedFor: "Balance",
            color: "warning",
          },
          minimal: {
            text: data.variants.minimal,
            ...minimalMetrics,
            energyMultiplier: 0.6,
            label: "Minimal Prompt (Lowest Energy)",
            description: "Aggressively compressed for sustainability",
            recommendedFor: "Sustainability",
            color: "success",
          },
        },
      };

      // Ensure minimum 5 seconds loading
      const elapsed = Date.now() - startTime;
      if (elapsed < 5000) {
        await new Promise(resolve => setTimeout(resolve, 5000 - elapsed));
      }

      setResult(refinementResult);
      setShowResults(true);
    } catch (err) {
      console.error('Error refining prompt:', err);
      setError(err instanceof Error ? err.message : 'Prompt refinement service temporarily unavailable.');
    } finally {
      setIsRefining(false);
    }
  };

  const getEnergyBarColor = (multiplier: number) => {
    if (multiplier >= 1.5) return "bg-destructive";
    if (multiplier >= 0.9) return "bg-yellow-500";
    return "bg-primary";
  };

  const getEnergyLabel = (multiplier: number) => {
    if (multiplier >= 1.5) return "High Energy";
    if (multiplier >= 0.9) return "Medium Energy";
    return "Low Energy";
  };

  const calculateSavings = () => {
    if (!result) return 0;
    const highCO2 = result.variants.highAccuracy.co2;
    const minCO2 = result.variants.minimal.co2;
    if (highCO2 === 0) return 0;
    return ((highCO2 - minCO2) / highCO2) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-chart-2/20">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">AI Prompt Refiner</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powered by Google Gemini — Get three optimized variants of your prompt with CO₂ impact analysis
          </p>
        </div>

        {/* Tip Banner */}
        <Alert className="mb-8 border-primary/20 bg-primary/5">
          <Lightbulb className="h-4 w-4 text-primary" />
          <AlertTitle>Tip</AlertTitle>
          <AlertDescription>
            Clear prompts reduce tokens and carbon footprint. The more concise your input, the better the optimization results.
          </AlertDescription>
        </Alert>

        {/* Input Section */}
        <Card className="mb-8 backdrop-blur-sm bg-card/80 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Enter Your Prompt
            </CardTitle>
            <CardDescription>
              Paste your prompt below and Gemini will generate three optimized variants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., 'Can you please help me write a Python program that calculates the factorial of a number in a simple way step by step?'"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="min-h-[150px] mb-4 bg-background/50"
              aria-label="Prompt input"
            />
            <Button 
              onClick={handleRefine} 
              disabled={!inputPrompt.trim() || isRefining}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-chart-2 hover:opacity-90"
              aria-busy={isRefining}
            >
              {isRefining ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Refine Prompt
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isRefining && (
          <Card className="mb-8 backdrop-blur-sm bg-card/80 border-primary/20">
            <CardContent className="py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Sparkles className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-foreground mb-2">
                    Optimizing prompt using Gemini…
                  </p>
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Generating three optimized variants for accuracy, balance, and sustainability
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {showResults && result && (
          <div className="animate-fade-in space-y-8">
            {/* Comparison Summary */}
            <Card className="backdrop-blur-sm bg-gradient-to-r from-primary/5 to-chart-2/5 border-primary/20">
              <CardContent className="py-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                  <TreeDeciduous className="h-8 w-8 text-primary" />
                  <p className="text-lg">
                    Using <span className="font-bold text-primary">Minimal Prompt</span> saves{" "}
                    <span className="font-bold text-primary">~{calculateSavings().toFixed(1)}%</span> CO₂ vs High Accuracy
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Variants */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="highAccuracy" className="gap-2">
                  <Braces className="h-4 w-4" />
                  <span className="hidden sm:inline">High Accuracy</span>
                  <span className="sm:hidden">JSON</span>
                </TabsTrigger>
                <TabsTrigger value="balanced" className="gap-2">
                  <Gauge className="h-4 w-4" />
                  <span className="hidden sm:inline">Balanced</span>
                  <span className="sm:hidden">Balanced</span>
                </TabsTrigger>
                <TabsTrigger value="minimal" className="gap-2">
                  <Leaf className="h-4 w-4" />
                  <span className="hidden sm:inline">Minimal</span>
                  <span className="sm:hidden">Minimal</span>
                </TabsTrigger>
              </TabsList>

              {Object.entries(result.variants).map(([key, variant]) => (
                <TabsContent key={key} value={key} className="space-y-4">
                  <Card className="backdrop-blur-sm bg-card/80">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {key === "highAccuracy" && <Braces className="h-5 w-5 text-destructive" />}
                            {key === "balanced" && <Gauge className="h-5 w-5 text-yellow-500" />}
                            {key === "minimal" && <Leaf className="h-5 w-5 text-primary" />}
                            {variant.label}
                          </CardTitle>
                          <CardDescription>{variant.description}</CardDescription>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${variant.color === "destructive" ? "border-destructive/50 text-destructive" : ""}
                            ${variant.color === "warning" ? "border-yellow-500/50 text-yellow-600" : ""}
                            ${variant.color === "success" ? "border-primary/50 text-primary" : ""}
                          `}
                        >
                          <Target className="h-3 w-3 mr-1" />
                          Recommended for: {variant.recommendedFor}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Refined Prompt */}
                      <Textarea
                        readOnly
                        value={variant.text}
                        className={`min-h-[150px] bg-muted/50 font-mono text-sm ${key === "highAccuracy" ? "whitespace-pre" : ""}`}
                        aria-label={`${variant.label} refined prompt`}
                      />

                      {/* Metrics Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/30">
                          <span className="text-sm text-muted-foreground">Estimated Tokens</span>
                          <span className="text-2xl font-bold">{variant.tokens}</span>
                        </div>
                        <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/30">
                          <span className="text-sm text-muted-foreground">Energy Multiplier</span>
                          <span className="text-2xl font-bold">{variant.energyMultiplier}×</span>
                        </div>
                        <div className="flex flex-col gap-2 p-4 rounded-lg bg-muted/30">
                          <Badge 
                            variant="outline" 
                            className="w-fit px-4 py-2 text-base bg-gradient-to-r from-primary/10 to-chart-3/10"
                          >
                            <Leaf className="h-4 w-4 mr-2 text-primary" />
                            Estimated CO₂: {variant.co2.toFixed(4)} g
                          </Badge>
                        </div>
                      </div>

                      {/* Energy Usage Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Zap className="h-4 w-4" />
                            Energy Usage
                          </span>
                          <span className={`font-medium ${
                            variant.energyMultiplier >= 1.5 ? "text-destructive" :
                            variant.energyMultiplier >= 0.9 ? "text-yellow-600" : "text-primary"
                          }`}>
                            {getEnergyLabel(variant.energyMultiplier)}
                          </span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${getEnergyBarColor(variant.energyMultiplier)}`}
                            style={{ width: `${Math.min(100, variant.energyMultiplier * 60)}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {/* Carbon Equivalency Widget */}
            {result.variants.balanced && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-center">
                  Balanced prompt CO₂ equivalent to:
                </h3>
                <CarbonEquivalencyWidget totalCO2={result.variants.balanced.co2} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PromptRefiner;
