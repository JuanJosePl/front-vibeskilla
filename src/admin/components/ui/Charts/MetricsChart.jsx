import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const MetricsChart = ({ data, metrics = [] }) => {
  const colors = {
    sales: 'var(--primary)',
    orders: 'var(--chart-2)',
    users: 'var(--chart-3)',
    products: 'var(--chart-4)'
  };

  const metricNames = {
    sales: 'Ventas',
    orders: 'Pedidos',
    users: 'Usuarios',
    products: 'Productos'
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            borderRadius: 'var(--radius)',
            color: 'var(--foreground)'
          }}
          formatter={(value, name) => [
            name === 'sales' ? `$${value}` : value,
            metricNames[name] || name
          ]}
        />
        <Legend />
        {metrics.includes('sales') && (
          <Bar 
            dataKey="sales" 
            fill={colors.sales}
            name="Ventas"
            radius={[4, 4, 0, 0]}
          />
        )}
        {metrics.includes('orders') && (
          <Bar 
            dataKey="orders" 
            fill={colors.orders}
            name="Pedidos"
            radius={[4, 4, 0, 0]}
          />
        )}
        {metrics.includes('users') && (
          <Bar 
            dataKey="users" 
            fill={colors.users}
            name="Usuarios"
            radius={[4, 4, 0, 0]}
          />
        )}
        {metrics.includes('products') && (
          <Bar 
            dataKey="products" 
            fill={colors.products}
            name="Productos"
            radius={[4, 4, 0, 0]}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MetricsChart;