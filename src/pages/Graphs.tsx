import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { models } from "@/data/modelData";

const Graphs = () => {
  const modelList = Object.values(models);

  const energyData = modelList.map((model) => ({
    name: model.name,
    energy: model.energyPerQuery,
  }));

  const efficiencyData = modelList.map((model) => ({
    name: model.name,
    efficiency: model.efficiency,
  }));

  const carbonData = modelList.map((model) => ({
    name: model.name,
    carbon: model.carbonEmission,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Overall Analytics</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive data visualizations across all AI models
          </p>
        </div>

        <div className="space-y-8 max-w-6xl mx-auto">
          {/* Energy per Query */}
          <Card>
            <CardHeader>
              <CardTitle>Energy per Query by Model</CardTitle>
              <CardDescription>Comparison of energy consumption (kWh) per query</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] border border-border rounded-lg p-4 bg-card">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={energyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="energy" fill="hsl(var(--chart-2))" name="Energy (kWh)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Efficiency */}
          <Card>
            <CardHeader>
              <CardTitle>Efficiency by Model</CardTitle>
              <CardDescription>Comparison of efficiency scores (Answer Quality ÷ Energy)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] border border-border rounded-lg p-4 bg-card">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={efficiencyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="efficiency" fill="hsl(var(--chart-1))" name="Efficiency Score" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Carbon Emission */}
          <Card>
            <CardHeader>
              <CardTitle>Carbon Emission per Query by Model</CardTitle>
              <CardDescription>Comparison of CO₂ emissions (grams) per query</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] border border-border rounded-lg p-4 bg-card">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={carbonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="carbon" fill="hsl(var(--chart-3))" name="Carbon (g CO₂)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Graphs;
