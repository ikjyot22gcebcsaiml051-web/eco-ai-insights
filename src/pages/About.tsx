import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Target, Leaf } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About This Project</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Understanding our methodology and mission
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Description */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Project Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                This project visualizes the energy usage and environmental footprint of various AI models. 
                As artificial intelligence becomes increasingly prevalent in our daily lives, understanding 
                its environmental impact is crucial for making informed decisions.
              </p>
              <p>
                Our goal is to help users choose AI tools not only based on performance but also on 
                environmental impact. By providing transparent data about energy consumption, efficiency, 
                and carbon emissions, we empower developers and organizations to make sustainable choices.
              </p>
            </CardContent>
          </Card>

          {/* Methodology */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-1/10">
                  <Calculator className="h-6 w-6 text-chart-1" />
                </div>
                <CardTitle className="text-2xl">Methodology</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Efficiency Calculation</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  Efficiency = Answer Quality ÷ Energy per Query
                </div>
                <p className="text-muted-foreground mt-2">
                  This metric helps identify models that deliver the best performance relative to their 
                  energy consumption.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Carbon Emissions</h3>
                <p className="text-muted-foreground">
                  Carbon emissions are approximated using typical grid emission factors for the regions 
                  where data centers operate. Models powered by renewable energy naturally have lower 
                  carbon footprints.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Data Sources</h3>
                <p className="text-muted-foreground">
                  Energy consumption data is derived from published research papers, company disclosures, 
                  and independent audits. We continuously update our data as new information becomes 
                  available.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sustainability */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Why Sustainability Matters</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-foreground">
              <p>
                AI training and inference consume significant amounts of electricity. As AI adoption 
                grows, so does its energy footprint. By choosing more efficient models and supporting 
                providers that use renewable energy, we can reduce the environmental impact of AI 
                technologies.
              </p>
              <p className="font-medium">
                Every query counts. Together, we can build a more sustainable future for AI.
              </p>
            </CardContent>
          </Card>

          {/* Research References */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-2/10">
                  <Calculator className="h-6 w-6 text-chart-2" />
                </div>
                <CardTitle className="text-2xl">Research References</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  <a 
                    href="https://smartly.ai/blog/the-carbon-footprint-of-chatgpt-how-much-co2-does-a-query-generate" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    The Carbon Footprint of ChatGPT
                  </a>
                </h3>
                <p className="text-muted-foreground">
                  Comprehensive analysis of ChatGPT's environmental impact, examining the CO₂ emissions 
                  per query and comparing them to everyday activities. This research provides crucial 
                  insights into the energy consumption patterns of large language models.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  <a 
                    href="https://piktochart.com/blog/carbon-footprint-of-chatgpt/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Understanding AI's Environmental Cost
                  </a>
                </h3>
                <p className="text-muted-foreground">
                  Visual breakdown of how AI models like ChatGPT contribute to carbon emissions, 
                  including data center operations, training costs, and per-query environmental impact. 
                  Helps contextualize the true cost of AI convenience.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  <a 
                    href="https://news.climate.columbia.edu/2023/06/09/ais-growing-carbon-footprint/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    AI's Growing Carbon Footprint - Columbia Climate School
                  </a>
                </h3>
                <p className="text-muted-foreground">
                  Academic research from Columbia University examining the exponential growth of AI's 
                  carbon footprint. Discusses the challenges of scaling AI sustainably and the importance 
                  of renewable energy adoption in data centers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;
