import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DualAxisChartProps {
  data: {
    name: string;
    value1: number;
    value2: number;
  }[];
  label1: string;
  label2: string;
  unit1?: string;
  unit2?: string;
}

export const DualAxisChart = ({ data, label1, label2, unit1 = "", unit2 = "" }: DualAxisChartProps) => {
  return (
    <div className="w-full h-[400px] border border-border rounded-lg p-4 bg-card">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 40, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))"
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            yAxisId="left" 
            stroke="hsl(var(--chart-1))"
            label={{ value: label1, angle: -90, position: 'insideLeft', style: { fill: 'hsl(var(--chart-1))' } }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="hsl(var(--chart-2))"
            label={{ value: label2, angle: 90, position: 'insideRight', style: { fill: 'hsl(var(--chart-2))' } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="value1" 
            stroke="hsl(var(--chart-1))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
            name={`${label1} ${unit1}`}
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="value2" 
            stroke="hsl(var(--chart-2))" 
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
            name={`${label2} ${unit2}`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
