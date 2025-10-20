import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

const SalesChart = ({ data }) => {
  const chartData = data.map(item => ({
    name: item._id,
    ventas: item.totalSales,
    pedidos: item.orderCount
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
        <XAxis 
          dataKey="name" 
          stroke="var(--muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          stroke="var(--muted-foreground)"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="ventas" 
          stroke="var(--primary)" 
          fill="var(--primary)" 
          fillOpacity={0.3}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;