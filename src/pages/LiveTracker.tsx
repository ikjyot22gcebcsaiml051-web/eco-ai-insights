import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { models } from "@/data/modelData";
import { Activity } from "lucide-react";

const LiveTracker = () => {
  const modelList = Object.values(models);
  
  const initialValues: Record<string, number> = {
    gpt4: 245.32,
    grok: 180.11,
    claude3: 120.78,
    llama3: 95.24,
  };

  const [energyValues, setEnergyValues] = useState(initialValues);
  const [sparklineData, setSparklineData] = useState<Record<string, number[]>>({
    gpt4: Array(20).fill(245.32),
    grok: Array(20).fill(180.11),
    claude3: Array(20).fill(120.78),
    llama3: Array(20).fill(95.24),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyValues((prev) => {
        const newValues = { ...prev };
        Object.keys(newValues).forEach((key) => {
          const increment = Math.random() * 0.02 + 0.01; // Random increment between 0.01 and 0.03
          newValues[key] = Number((newValues[key] + increment).toFixed(2));
        });
        return newValues;
      });

      setSparklineData((prev) => {
        const newData = { ...prev };
        Object.keys(newData).forEach((key) => {
          const current = energyValues[key];
          newData[key] = [...newData[key].slice(1), current];
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [energyValues]);

  const getSparklineData = (data: number[]) => {
    return data.map((value, index) => ({ value, index }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Live Energy Tracker</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Real-time monitoring of AI model energy consumption
          </p>
          <Badge variant="secondary" className="text-sm">
            <Activity className="h-3 w-3 mr-1 animate-pulse" />
            Live Simulation
          </Badge>
        </div>

        <Card className="max-w-4xl mx-auto mb-8 bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-muted-foreground">
              These numbers are simulated to demonstrate live tracking of AI energy usage. 
              Values update every 2 seconds to show real-time monitoring capabilities.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {modelList.map((model) => (
            <Card key={model.id} className="card-hover">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{model.name}</CardTitle>
                    <CardDescription>{model.company}</CardDescription>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Energy Used Today</div>
                  <div className="text-4xl font-bold text-primary">
                    {energyValues[model.id]}
                  </div>
                  <div className="text-sm text-muted-foreground">kWh</div>
                </div>
                
                <div className="h-16 -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getSparklineData(sparklineData[model.id])}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <div className="text-xs text-muted-foreground">Per Query</div>
                    <div className="text-sm font-semibold">{model.energyPerQuery} kWh</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Efficiency</div>
                    <div className="text-sm font-semibold">{model.efficiency.toFixed(1)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LiveTracker;
