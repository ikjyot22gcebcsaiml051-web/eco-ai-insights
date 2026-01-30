import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CarbonEquivalencyWidget } from "@/components/CarbonEquivalencyWidget";
import { Upload, Download, Mail, AlertCircle, Leaf, Code, Brain, Calculator, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import emailjs from "@emailjs/browser";

interface AIAnalysisResult {
  total_tokens: number;
  estimated_energy_kwh: number;
  estimated_co2_grams: number;
  task_breakdown: {
    coding: number;
    reasoning: number;
    math: number;
    general: number;
  };
  fallback?: boolean;
}

interface QueryAnalysis {
  query: string;
  category: string;
  recommendedModel: string;
  tokens: number;
  energy: number;
  carbon: number;
}

interface AnalysisResult {
  queries: QueryAnalysis[];
  totalQueries: number;
  totalTokens: number;
  totalEnergy: number;
  totalCarbon: number;
  drivingMeters: number;
  aiAnalysis?: AIAnalysisResult;
}

const UploadChat = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const categorizeQuery = (query: string) => {
    const lowerQuery = query.toLowerCase();

    const codeKeywords = ["code", "program", "api", "json", "class", "function", "leetcode", "python", "java", "script", "bug", "loop", "build", "compile", "backend", "endpoint", "algorithm", "database"];
    const mathKeywords = ["sin", "cos", "theta", "sqrt", "integral", "derivative", "polynomial", "limit", "equation", "calculation", "solve", "power", "x^2", "x2", "numbers", "pi", "radians", "degrees", "vector", "matrix", "log"];
    const physicsKeywords = ["velocity", "acceleration", "quantum", "photon", "force", "gravity", "electron", "physics"];
    const reasoningKeywords = ["puzzle", "logical", "grandmother", "west", "east", "scenario", "assume", "reason", "mother", "father", "north", "south", "riddle", "who", "which", "why", "relation", "compare", "stronger", "weaker", "logic problem"];

    if (codeKeywords.some(kw => lowerQuery.includes(kw))) return "CODE";
    if (mathKeywords.some(kw => lowerQuery.includes(kw))) return "MATH";
    if (physicsKeywords.some(kw => lowerQuery.includes(kw))) return "PHYSICS";
    if (reasoningKeywords.some(kw => lowerQuery.includes(kw))) return "REASONING";
    return "GENERAL";
  };

  const getRecommendedModel = (category: string, query: string) => {
    const lowerQuery = query.toLowerCase();
    if (category === "CODE") {
      const leetcodeKeywords = ["leetcode", "lc", "two sum", "array", "linked list", "tree", "dp"];
      if (leetcodeKeywords.some(kw => lowerQuery.includes(kw))) {
        return "GPT-4";
      }
      return "Claude 3";
    }
    if (category === "MATH" || category === "PHYSICS") return "GPT-4";
    if (category === "REASONING") return "Claude 3";
    if (category === "GENERAL") return "Efficient LLM";
    return "GPT-4";
  };

  const getCategoryMultiplier = (category: string) => {
    const multipliers: Record<string, number> = {
      CODE: 3.0,
      MATH: 2.0,
      PHYSICS: 2.0,
      REASONING: 3.2,
      GENERAL: 1.0,
    };
    return multipliers[category] || 1.0;
  };

  const analyzeWithAI = async (content: string): Promise<AIAnalysisResult | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-chat', {
        body: { transcript: content }
      });

      if (error) {
        console.error('AI analysis error:', error);
        return null;
      }

      if (data.error) {
        console.error('AI analysis returned error:', data.error);
        return null;
      }

      return data as AIAnalysisResult;
    } catch (err) {
      console.error('Failed to call AI analysis:', err);
      return null;
    }
  };

  const analyzeFile = async () => {
    const content = pastedText.trim() || (file ? await readFileContent(file) : null);
    
    if (!content) {
      toast({
        title: "No content provided",
        description: "Please upload a file or paste chat text.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);
    setLoadingProgress(0);

    // Animate progress bar over 5 seconds
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 500);

    const startTime = Date.now();

    try {
      // Run AI analysis in parallel with local analysis
      const [aiAnalysis] = await Promise.all([
        analyzeWithAI(content),
        new Promise(resolve => setTimeout(resolve, 2000)) // Minimum 2 second delay for local processing
      ]);

      // Parse queries locally for the table
      let queries: string[] = [];
      
      if (file?.name.endsWith(".json")) {
        try {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            queries = parsed
              .filter((item: any) => item.role === "user" || item.content || item.message)
              .map((item: any) => item.content || item.message || item.text || "")
              .filter((q: string) => q.trim().length > 0);
          } else if (parsed.messages) {
            queries = parsed.messages
              .filter((item: any) => item.role === "user")
              .map((item: any) => item.content || "");
          }
        } catch {
          queries = content.split(/\n\n+|\n\d+\.\s+/).map(q => q.trim()).filter(q => q.length > 10);
        }
      } else {
        queries = content.split(/\n\n+|\n\d+\.\s+/).map(q => q.trim()).filter(q => q.length > 10);
      }

      if (queries.length === 0) {
        queries = [content]; // Treat entire content as single query
      }

      // Analyze each query locally
      const analyzed: QueryAnalysis[] = queries.slice(0, 50).map(query => {
        const category = categorizeQuery(query);
        const recommendedModel = getRecommendedModel(category, query);
        const tokens = Math.ceil(query.length / 4);
        const multiplier = getCategoryMultiplier(category);
        
        const baseEnergy: Record<string, number> = {
          "GPT-4": 0.0008,
          "Claude 3": 0.0009,
          "Efficient LLM": 0.0007,
        };

        const baseCarbon: Record<string, number> = {
          "GPT-4": 3.0,
          "Claude 3": 2.5,
          "Efficient LLM": 2.0,
        };

        const energy = (baseEnergy[recommendedModel] || 0.0008) * multiplier;
        const carbon = (baseCarbon[recommendedModel] || 2.5) * multiplier;

        return {
          query: query.substring(0, 100) + (query.length > 100 ? "..." : ""),
          category,
          recommendedModel,
          tokens,
          energy,
          carbon,
        };
      });

      // Use AI analysis if available, otherwise fall back to local calculation
      const totalTokens = aiAnalysis?.total_tokens || analyzed.reduce((sum, a) => sum + a.tokens, 0);
      const totalEnergy = aiAnalysis?.estimated_energy_kwh || analyzed.reduce((sum, a) => sum + a.energy, 0);
      const totalCarbon = aiAnalysis?.estimated_co2_grams || analyzed.reduce((sum, a) => sum + a.carbon, 0);
      const drivingMeters = Math.round(totalCarbon * 0.005);

      // Ensure minimum 5 seconds loading
      const elapsed = Date.now() - startTime;
      if (elapsed < 5000) {
        await new Promise(resolve => setTimeout(resolve, 5000 - elapsed));
      }

      clearInterval(progressInterval);
      setLoadingProgress(100);

      setResult({
        queries: analyzed,
        totalQueries: queries.length,
        totalTokens,
        totalEnergy,
        totalCarbon,
        drivingMeters,
        aiAnalysis: aiAnalysis || undefined,
      });
    } catch (err) {
      clearInterval(progressInterval);
      console.error("Error analyzing:", err);
      setError("Carbon analysis engine temporarily unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const downloadCSV = () => {
    if (!result) return;

    const headers = ["Query", "Category", "Recommended Model", "Tokens", "Energy (kWh)", "Carbon (g CO₂)"];
    const rows = result.queries.map(q => [
      `"${q.query.replace(/"/g, '""')}"`,
      q.category,
      q.recommendedModel,
      q.tokens.toString(),
      q.energy.toFixed(6),
      q.carbon.toFixed(4)
    ]);

    rows.push([]);
    rows.push(["Summary"]);
    rows.push(["Total Queries", result.totalQueries.toString()]);
    rows.push(["Total Tokens", result.totalTokens.toLocaleString()]);
    rows.push(["Total Energy (kWh)", result.totalEnergy.toFixed(6)]);
    rows.push(["Total CO₂ (g)", result.totalCarbon.toFixed(2)]);
    
    if (result.aiAnalysis?.task_breakdown) {
      rows.push([]);
      rows.push(["Task Breakdown"]);
      rows.push(["Coding", `${result.aiAnalysis.task_breakdown.coding}%`]);
      rows.push(["Reasoning", `${result.aiAnalysis.task_breakdown.reasoning}%`]);
      rows.push(["Math", `${result.aiAnalysis.task_breakdown.math}%`]);
      rows.push(["General", `${result.aiAnalysis.task_breakdown.general}%`]);
    }

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `chat-analysis-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "CSV Downloaded",
      description: "Your analysis report has been downloaded.",
    });
  };

  const sendEmail = async () => {
    if (!result || !email) {
      toast({
        title: "Missing information",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    try {
      await emailjs.send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        {
          to_email: email,
          total_queries: result.totalQueries,
          total_tokens: result.totalTokens,
          total_energy: result.totalEnergy.toFixed(6),
          total_carbon: result.totalCarbon.toFixed(2),
          driving_meters: result.drivingMeters,
          categories: JSON.stringify(
            result.queries.reduce((acc, q) => {
              acc[q.category] = (acc[q.category] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ),
        },
        "YOUR_PUBLIC_KEY"
      );

      toast({
        title: "Email Sent!",
        description: `Analysis summary sent to ${email}`,
      });
      setShowEmailForm(false);
      setEmail("");
    } catch (error) {
      toast({
        title: "Email Setup Required",
        description: "Please configure EmailJS credentials in the code. Visit emailjs.com to get started.",
        variant: "destructive",
      });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'coding': return <Code className="h-4 w-4" />;
      case 'reasoning': return <Brain className="h-4 w-4" />;
      case 'math': return <Calculator className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-chart-2/20">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Carbon Analysis Engine</h1>
            <p className="text-muted-foreground">
              Upload your chat history to analyze energy consumption and environmental impact
            </p>
          </div>

          {/* Upload Card */}
          <Card className="backdrop-blur-sm bg-card/80 border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Upload or Paste Chat Content
              </CardTitle>
              <CardDescription>
                Supported formats: .json, .txt, .md or paste text directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload */}
              <div className="flex items-center gap-4">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors">
                    <Upload className="h-5 w-5" />
                    <span>Choose File</span>
                  </div>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".json,.txt,.md"
                    onChange={(e) => {
                      setFile(e.target.files?.[0] || null);
                      setPastedText("");
                    }}
                    className="hidden"
                  />
                </Label>
                {file && (
                  <span className="text-sm text-muted-foreground">
                    Selected: {file.name}
                  </span>
                )}
              </div>

              <div className="text-center text-muted-foreground text-sm">or</div>

              {/* Text Paste Area */}
              <Textarea
                placeholder="Paste your chat transcript here..."
                value={pastedText}
                onChange={(e) => {
                  setPastedText(e.target.value);
                  setFile(null);
                }}
                className="min-h-[150px] bg-background/50"
              />

              <Button 
                onClick={analyzeFile} 
                disabled={(!file && !pastedText.trim()) || isLoading}
                className="w-full gap-2 bg-gradient-to-r from-primary to-chart-2 hover:opacity-90"
              >
                <Leaf className="h-4 w-4" />
                {isLoading ? "Analyzing..." : "Analyze Carbon Footprint"}
              </Button>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card className="backdrop-blur-sm bg-card/80 border-primary/20 animate-in fade-in duration-500">
              <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Leaf className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-lg font-medium text-foreground mb-4 animate-pulse text-center">
                  Analyzing conversation footprint…
                </p>
                <div className="w-full max-w-md">
                  <Progress value={loadingProgress} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Processing with Advanced Semantic Analysis
                </p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive" className="animate-in fade-in">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {result && !isLoading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* AI Analysis Task Breakdown */}
              {result.aiAnalysis?.task_breakdown && (
                <Card className="backdrop-blur-sm bg-gradient-to-r from-primary/5 to-chart-2/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      AI Task Distribution Analysis
                    </CardTitle>
                    <CardDescription>
                      Breakdown of conversation topics detected by Carbon Analysis Engine
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(result.aiAnalysis.task_breakdown).map(([key, value]) => (
                        <div key={key} className="flex flex-col items-center p-4 rounded-lg bg-background/50">
                          <div className="p-2 rounded-full bg-primary/10 mb-2">
                            {getCategoryIcon(key)}
                          </div>
                          <span className="text-2xl font-bold text-foreground">{value}%</span>
                          <span className="text-sm text-muted-foreground capitalize">{key}</span>
                        </div>
                      ))}
                    </div>
                    {result.aiAnalysis.fallback && (
                      <p className="text-xs text-muted-foreground mt-4 text-center">
                        *Estimated values (AI analysis fallback mode)
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="backdrop-blur-sm bg-card/80">
                  <CardHeader className="pb-3">
                    <CardDescription>Total Queries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{result.totalQueries}</div>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-sm bg-card/80">
                  <CardHeader className="pb-3">
                    <CardDescription>Total Tokens</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{result.totalTokens.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-sm bg-card/80">
                  <CardHeader className="pb-3">
                    <CardDescription>Total Energy</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{result.totalEnergy.toFixed(6)} kWh</div>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-sm bg-gradient-to-br from-primary/10 to-chart-2/10 border-primary/20">
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center gap-1">
                      <Leaf className="h-4 w-4" />
                      Total CO₂
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{result.totalCarbon.toFixed(2)} g</div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button onClick={downloadCSV} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download CSV Report
                </Button>
                <Button 
                  onClick={() => setShowEmailForm(!showEmailForm)} 
                  variant="outline" 
                  className="gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Send Summary to Email
                </Button>
              </div>

              {/* Email Form */}
              {showEmailForm && (
                <Card className="backdrop-blur-sm bg-card/80">
                  <CardHeader>
                    <CardTitle>Send Email Summary</CardTitle>
                    <CardDescription>
                      Enter your email to receive the analysis summary
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button onClick={sendEmail} className="w-full">
                      Send Email
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Note: Email feature requires EmailJS configuration. Visit{" "}
                      <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                        emailjs.com
                      </a>
                      {" "}to set up.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Carbon Equivalency Widget */}
              <Card className="backdrop-blur-sm bg-card/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    Environmental Impact Context
                  </CardTitle>
                  <CardDescription>What does {result.totalCarbon.toFixed(2)}g CO₂ mean in real terms?</CardDescription>
                </CardHeader>
                <CardContent>
                  <CarbonEquivalencyWidget totalCO2={result.totalCarbon} animationDuration={2000} />
                </CardContent>
              </Card>

              {/* Query Details Table */}
              <Card className="backdrop-blur-sm bg-card/80">
                <CardHeader>
                  <CardTitle>Query Analysis (First 50 Queries)</CardTitle>
                  <CardDescription>
                    Detailed breakdown of each query
                  </CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[300px]">Query</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Recommended</TableHead>
                        <TableHead className="text-right">Tokens</TableHead>
                        <TableHead className="text-right">Energy (kWh)</TableHead>
                        <TableHead className="text-right">CO₂ (g)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.queries.map((query, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-xs">{query.query}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{query.category}</Badge>
                          </TableCell>
                          <TableCell>{query.recommendedModel}</TableCell>
                          <TableCell className="text-right">{query.tokens}</TableCell>
                          <TableCell className="text-right">{query.energy.toFixed(6)}</TableCell>
                          <TableCell className="text-right">{query.carbon.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UploadChat;
