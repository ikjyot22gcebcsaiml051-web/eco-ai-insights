import { useParams } from "react-router-dom";
import { Cpu, Zap, Award, Leaf, ExternalLink } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DualAxisChart } from "@/components/DualAxisChart";
import { models, monthNames } from "@/data/modelData";

const ModelDetail = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const model = modelId ? models[modelId] : null;

  if (!model) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold">Model not found</h1>
        </div>
      </div>
    );
  }

  const energyVsEfficiencyData = monthNames.map((month, index) => ({
    name: month,
    value1: model.monthlyData.energyKwh[index],
    value2: model.monthlyData.efficiency[index],
  }));

  const energyVsCarbonData = monthNames.map((month, index) => ({
    name: month,
    value1: model.monthlyData.energyKwh[index],
    value2: model.monthlyData.carbonG[index],
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Banner */}
        <div className="gradient-hero rounded-2xl p-8 md:p-12 mb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                <Cpu className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{model.name}</h1>
                <p className="text-xl opacity-90">{model.company}</p>
              </div>
            </div>
            <Button 
              variant="secondary"
              className="gap-2"
              onClick={() => window.open(model.websiteUrl, '_blank')}
            >
              Visit Website <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {model.architecture} Architecture
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-chart-2">
                <Zap className="h-5 w-5" />
                <CardDescription>Energy per Query</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{model.energyPerQuery}</div>
              <p className="text-sm text-muted-foreground mt-1">kWh</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary">
                <Award className="h-5 w-5" />
                <CardDescription>Answer Quality</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{model.answerQuality}</div>
              <p className="text-sm text-muted-foreground mt-1">out of 100</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-chart-1">
                <Cpu className="h-5 w-5" />
                <CardDescription>Efficiency</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{model.efficiency.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground mt-1">score</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-chart-3">
                <Leaf className="h-5 w-5" />
                <CardDescription>Carbon Emission</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{model.carbonEmission}</div>
              <p className="text-sm text-muted-foreground mt-1">g CO₂ per query</p>
            </CardContent>
          </Card>
        </div>

        {/* Energy Sources */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Energy Sources</CardTitle>
            <CardDescription>Breakdown of energy sources powering data centers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {model.energySources.solar && (
                <Badge variant="secondary" className="text-base py-2 px-4">
                  Solar: {model.energySources.solar}%
                </Badge>
              )}
              {model.energySources.wind && (
                <Badge variant="secondary" className="text-base py-2 px-4">
                  Wind: {model.energySources.wind}%
                </Badge>
              )}
              {model.energySources.nuclear && (
                <Badge variant="secondary" className="text-base py-2 px-4">
                  Nuclear: {model.energySources.nuclear}%
                </Badge>
              )}
              {model.energySources.grid && (
                <Badge variant="secondary" className="text-base py-2 px-4">
                  Grid: {model.energySources.grid}%
                </Badge>
              )}
              {model.energySources.renewable && (
                <Badge variant="secondary" className="text-base py-2 px-4 bg-primary text-white">
                  100% Renewable Energy Credits
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Energy vs Efficiency Over Time</h2>
            <DualAxisChart
              data={energyVsEfficiencyData}
              label1="Energy"
              label2="Efficiency"
              unit1="(kWh)"
              unit2=""
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Energy vs Carbon Emissions Over Time</h2>
            <DualAxisChart
              data={energyVsCarbonData}
              label1="Energy"
              label2="Carbon"
              unit1="(kWh)"
              unit2="(g CO₂)"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelDetail;
