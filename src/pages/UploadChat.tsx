import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CarbonEquivalencyWidget } from "@/components/CarbonEquivalencyWidget";
import { Upload, Download, Mail, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";

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
}

const UploadChat = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
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
    if (category === "GENERAL") return "Gemini";
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

  const analyzeFile = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a chat file first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          let queries: string[] = [];

          // Parse different file formats
          if (file.name.endsWith(".json")) {
            const parsed = JSON.parse(content);
            // Try to extract messages from common chat export formats
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
          } else {
            // For .txt and .md files, split by double newline or numbered lists
            queries = content
              .split(/\n\n+|\n\d+\.\s+/)
              .map(q => q.trim())
              .filter(q => q.length > 10); // Filter out very short lines
          }

          if (queries.length === 0) {
            toast({
              title: "No queries found",
              description: "Could not extract queries from the file.",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }

          // Analyze each query
          const analyzed: QueryAnalysis[] = queries.map(query => {
            const category = categorizeQuery(query);
            const recommendedModel = getRecommendedModel(category, query);
            const tokens = Math.ceil(query.length / 4); // Rough token estimation
            const multiplier = getCategoryMultiplier(category);
            
            // Base energy values (kWh)
            const baseEnergy: Record<string, number> = {
              "GPT-4": 0.0008,
              "Claude 3": 0.0009,
              "Gemini": 0.0007,
            };

            // Base carbon values (g CO₂)
            const baseCarbon: Record<string, number> = {
              "GPT-4": 3.0,
              "Claude 3": 2.5,
              "Gemini": 2.0,
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

          const totalQueries = analyzed.length;
          const totalTokens = analyzed.reduce((sum, a) => sum + a.tokens, 0);
          const totalEnergy = analyzed.reduce((sum, a) => sum + a.energy, 0);
          const totalCarbon = analyzed.reduce((sum, a) => sum + a.carbon, 0);
          
          // 1g CO₂ = ~0.005 meters of driving (rough estimate)
          const drivingMeters = Math.round(totalCarbon * 0.005);

          setResult({
            queries: analyzed.slice(0, 50), // Show first 50 queries
            totalQueries,
            totalTokens,
            totalEnergy,
            totalCarbon,
            drivingMeters,
          });
          setIsLoading(false);
        } catch (error) {
          console.error("Error analyzing file:", error);
          toast({
            title: "Error analyzing file",
            description: "Could not parse the file. Please check the format.",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      };
      reader.readAsText(file);
    }, 5000);
  };

  const downloadCSV = () => {
    if (!result) return;

    // Generate CSV content
    const headers = ["Query", "Category", "Recommended Model", "Tokens", "Energy (kWh)", "Carbon (g CO₂)"];
    const rows = result.queries.map(q => [
      `"${q.query.replace(/"/g, '""')}"`,
      q.category,
      q.recommendedModel,
      q.tokens.toString(),
      q.energy.toFixed(6),
      q.carbon.toFixed(4)
    ]);

    // Add summary rows
    rows.push([]);
    rows.push(["Summary"]);
    rows.push(["Total Queries", result.totalQueries.toString()]);
    rows.push(["Total Tokens", result.totalTokens.toLocaleString()]);
    rows.push(["Total Energy (kWh)", result.totalEnergy.toFixed(6)]);
    rows.push(["Total CO₂ (g)", result.totalCarbon.toFixed(2)]);
    rows.push(["Equivalent Driving (meters)", result.drivingMeters.toString()]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create and download file
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
      // Note: Users need to configure EmailJS with their own credentials
      // This is a template - they need to sign up at emailjs.com
      await emailjs.send(
        "YOUR_SERVICE_ID", // User needs to replace this
        "YOUR_TEMPLATE_ID", // User needs to replace this
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
        "YOUR_PUBLIC_KEY" // User needs to replace this
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Upload Chat Analysis</h1>
            <p className="text-muted-foreground">
              Upload your chat history to analyze energy consumption and get recommendations
            </p>
          </div>

          {/* Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Chat File</CardTitle>
              <CardDescription>
                Supported formats: .json, .txt, .md (containing chat messages)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </Label>
                {file && (
                  <span className="text-sm text-muted-foreground">
                    Selected: {file.name}
                  </span>
                )}
              </div>
              <Button 
                onClick={analyzeFile} 
                disabled={!file || isLoading}
                className="w-full gap-2"
              >
                <Upload className="h-4 w-4" />
                Analyze Chat
              </Button>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <Card className="animate-in fade-in duration-500">
              <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="animate-spin">
                    <AlertCircle className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <p className="text-lg font-medium text-foreground animate-pulse text-center">
                  Analyzing your queries and calculating environmental impact…
                </p>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && !isLoading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Queries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{result.totalQueries}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Tokens</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{result.totalTokens.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Energy</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{result.totalEnergy.toFixed(6)} kWh</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total CO₂</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{result.totalCarbon.toFixed(2)} g</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      ≈ {result.drivingMeters}m driving
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
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
                <Card>
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
              <Card>
                <CardHeader>
                  <CardTitle>Environmental Impact Context</CardTitle>
                  <CardDescription>What does {result.totalCarbon.toFixed(2)}g CO₂ mean in real terms?</CardDescription>
                </CardHeader>
                <CardContent>
                  <CarbonEquivalencyWidget totalCO2={result.totalCarbon} />
                </CardContent>
              </Card>

              {/* Query Details Table */}
              <Card>
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