import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Zap, Leaf, Rocket } from "lucide-react";

const Recommendation = () => {
  const recommendations = [
    {
      title: "For General Use",
      model: "GPT-4",
      reason: "Best overall answer quality with strong efficiency",
      icon: Award,
      gradient: "from-primary/10 to-primary/20",
      iconColor: "text-primary",
    },
    {
      title: "For Lowest Energy Usage",
      model: "Llama-3 70B",
      reason: "Most energy-efficient model with lowest carbon footprint",
      icon: Zap,
      gradient: "from-chart-2/10 to-chart-2/20",
      iconColor: "text-chart-2",
    },
    {
      title: "For Most Renewable",
      model: "Claude 3",
      reason: "Powered by 100% Renewable Energy Credits",
      icon: Leaf,
      gradient: "from-chart-3/10 to-chart-3/20",
      iconColor: "text-chart-3",
    },
    {
      title: "For High-Creativity / Speed",
      model: "Grok-1.5",
      reason: "Innovative Mixture-of-Experts architecture with renewable energy",
      icon: Rocket,
      gradient: "from-chart-4/10 to-chart-4/20",
      iconColor: "text-chart-4",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Recommendations</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the right AI model for your specific needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <Card 
                key={index} 
                className={`card-hover bg-gradient-to-br ${rec.gradient} border-2`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-background ${rec.iconColor}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{rec.title}</CardTitle>
                  </div>
                  <CardDescription className="text-lg font-semibold text-foreground">
                    {rec.model}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{rec.reason}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <Card className="max-w-3xl mx-auto mt-12">
          <CardHeader>
            <CardTitle>How to Choose</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              When selecting an AI model, consider these factors:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Answer Quality:</strong> For mission-critical applications, prioritize models with higher quality scores</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Energy Efficiency:</strong> For high-volume usage, choose models with better efficiency to reduce costs and environmental impact</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Renewable Energy:</strong> If sustainability is a priority, select models powered by renewable sources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><strong>Use Case:</strong> Match the model's strengths to your specific requirements</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Recommendation;
