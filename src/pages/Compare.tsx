import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DualAxisChart } from "@/components/DualAxisChart";
import { CarbonEquivalencyWidget } from "@/components/CarbonEquivalencyWidget";
import { models } from "@/data/modelData";
import { Award, Zap, Leaf } from "lucide-react";

const Compare = () => {
  const modelList = Object.values(models);

  const comparisonData = modelList.map((model) => ({
    name: model.name,
    value1: model.energyPerQuery,
    value2: model.efficiency,
  }));

  // Calculate total CO₂ from all models for widget demo
  const totalCO2 = modelList.reduce((sum, model) => sum + model.carbonEmission, 0);

  const getMainEnergySource = (sources: any) => {
    if (sources.renewable) return "100% Renewable";
    const entries = Object.entries(sources) as [string, number][];
    const sorted = entries.sort(([, a], [, b]) => b - a);
    return `${sorted[0][0].charAt(0).toUpperCase() + sorted[0][0].slice(1)} ${sorted[0][1]}%`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Compare AI Models</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Side-by-side comparison of energy consumption and efficiency
          </p>
        </div>

        {/* Comparison Table */}
        <Card className="mb-12 overflow-hidden">
          <CardHeader>
            <CardTitle>Model Comparison Table</CardTitle>
            <CardDescription>Key metrics for all tracked AI models</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Model</TableHead>
                  <TableHead className="font-bold">Energy per Query (kWh)</TableHead>
                  <TableHead className="font-bold">Answer Quality</TableHead>
                  <TableHead className="font-bold">Efficiency</TableHead>
                  <TableHead className="font-bold">Carbon per Query (g CO₂)</TableHead>
                  <TableHead className="font-bold">Main Energy Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modelList.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{model.name}</div>
                        <div className="text-sm text-muted-foreground">{model.company}</div>
                      </div>
                    </TableCell>
                    <TableCell>{model.energyPerQuery}</TableCell>
                    <TableCell>{model.answerQuality}/100</TableCell>
                    <TableCell>{model.efficiency.toFixed(2)}</TableCell>
                    <TableCell>{model.carbonEmission}</TableCell>
                    <TableCell>{getMainEnergySource(model.energySources)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Comparison Graph */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Energy vs Efficiency Comparison</CardTitle>
            <CardDescription>Visual comparison of energy consumption and efficiency across models</CardDescription>
          </CardHeader>
          <CardContent>
            <DualAxisChart
              data={comparisonData}
              label1="Energy per Query"
              label2="Efficiency"
              unit1="(kWh)"
              unit2=""
            />
          </CardContent>
        </Card>

        {/* Carbon Equivalency Widget */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Carbon Footprint Context</CardTitle>
            <CardDescription>What does {totalCO2.toFixed(2)}g CO₂ (combined model emissions) mean in real terms?</CardDescription>
          </CardHeader>
          <CardContent>
            <CarbonEquivalencyWidget totalCO2={totalCO2} />
          </CardContent>
        </Card>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Award className="h-5 w-5" />
                <CardTitle className="text-lg">Most Efficient</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Llama-3 70B</p>
              <p className="text-sm text-muted-foreground mt-1">Efficiency score: 283.33</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-2/5 to-chart-2/10 border-chart-2/20">
            <CardHeader>
              <div className="flex items-center gap-2 text-chart-2">
                <Zap className="h-5 w-5" />
                <CardTitle className="text-lg">Lowest Energy</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Llama-3 70B</p>
              <p className="text-sm text-muted-foreground mt-1">0.0003 kWh per query</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-chart-3/5 to-chart-3/10 border-chart-3/20">
            <CardHeader>
              <div className="flex items-center gap-2 text-chart-3">
                <Leaf className="h-5 w-5" />
                <CardTitle className="text-lg">Most Renewable</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Claude 3</p>
              <p className="text-sm text-muted-foreground mt-1">100% Renewable Energy Credits</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Compare;
