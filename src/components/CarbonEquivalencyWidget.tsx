import { Card, CardContent } from "@/components/ui/card";
import { Car, Zap, Battery, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface CarbonEquivalencyWidgetProps {
  totalCO2: number; // in grams
}

const AnimatedNumber = ({ value, decimals = 2 }: { value: number; decimals?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue.toFixed(decimals)}</span>;
};

export const CarbonEquivalencyWidget = ({ totalCO2 }: CarbonEquivalencyWidgetProps) => {
  // Conversion factors (grams CO₂)
  const teslaKm = totalCO2 / 50; // 1 km Tesla ≈ 50 g CO₂
  const ledMinutes = totalCO2 / 0.5; // 1 LED minute ≈ 0.5 g CO₂
  const phoneCharges = totalCO2 / 12; // 1 phone charge ≈ 12 g CO₂
  const googleSearches = totalCO2 / 0.2; // 1 Google search ≈ 0.2 g CO₂

  const equivalencies = [
    {
      icon: Car,
      label: "km driven in a Tesla",
      value: teslaKm,
      decimals: 3,
    },
    {
      icon: Zap,
      label: "minutes of LED light usage",
      value: ledMinutes,
      decimals: 1,
    },
    {
      icon: Battery,
      label: "smartphone charges",
      value: phoneCharges,
      decimals: 2,
    },
    {
      icon: Search,
      label: "Google searches",
      value: googleSearches,
      decimals: 1,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {equivalencies.map((item, index) => (
        <Card
          key={index}
          className="group relative overflow-hidden bg-gradient-to-br from-primary/5 via-chart-2/5 to-chart-3/5 border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-chart-2/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardContent className="p-4 relative z-10">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-chart-2/20 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                <AnimatedNumber value={item.value} decimals={item.decimals} />
              </div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
