import { useNavigate } from "react-router-dom";
import { Leaf, BarChart3, GitCompare, Zap } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light shadow-lg">
              <Leaf className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
            AI Sustainability Dashboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transparency in AI energy consumption and environmental impact
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="max-w-4xl mx-auto shadow-lg mb-12">
          <CardContent className="p-8 md:p-12">
            <p className="text-lg leading-relaxed text-foreground mb-8">
              AI systems consume significant energy during training and usage. This project aims to provide 
              transparency into the energy consumption, efficiency, carbon footprint, and sustainability of 
              different AI models. Our goal is to help users choose AI tools not only based on performance but 
              also on environmental impact. This dashboard compares AI models like GPT-4, Grok, Claude, and 
              Llama, showing how much electricity they use, how efficient they are, and what energy sources 
              power their data centers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/models")}
                className="gap-2"
              >
                <Zap className="h-5 w-5" />
                View Models
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/compare")}
                className="gap-2"
              >
                <GitCompare className="h-5 w-5" />
                Compare Models
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/graphs")}
                className="gap-2"
              >
                <BarChart3 className="h-5 w-5" />
                View Graphs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">4</div>
              <p className="text-sm text-muted-foreground">AI Models Tracked</p>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <p className="text-sm text-muted-foreground">Peak Answer Quality</p>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">283</div>
              <p className="text-sm text-muted-foreground">Best Efficiency Score</p>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <p className="text-sm text-muted-foreground">Renewable Options</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home;
