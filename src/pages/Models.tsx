import { useNavigate } from "react-router-dom";
import { Cpu, Zap, ArrowRight } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { models } from "@/data/modelData";

const Models = () => {
  const navigate = useNavigate();

  const modelList = Object.values(models);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">AI Models</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare energy consumption and efficiency across leading AI models
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {modelList.map((model) => (
            <Card key={model.id} className="card-hover">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Cpu className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary">{model.company}</Badge>
                </div>
                <CardTitle className="text-2xl">{model.name}</CardTitle>
                <CardDescription>{model.architecture} Architecture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-chart-2" />
                  <span className="text-sm font-medium">Energy per Query:</span>
                  <span className="text-sm text-muted-foreground">{model.energyPerQuery} kWh</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-primary" />
                  <span className="text-sm font-medium">Efficiency:</span>
                  <span className="text-sm text-muted-foreground">{model.efficiency.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-chart-3" />
                  <span className="text-sm font-medium">Answer Quality:</span>
                  <span className="text-sm text-muted-foreground">{model.answerQuality}/100</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button 
                  className="flex-1 gap-2" 
                  onClick={() => navigate(`/models/${model.id}`)}
                >
                  View Details <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => window.open(model.websiteUrl, '_blank')}
                >
                  Visit Website
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Models;
