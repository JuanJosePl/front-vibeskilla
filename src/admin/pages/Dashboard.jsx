import React, { useState, useEffect } from "react";
import { useAdmin } from "../hooks/useAdmin";
import StatsCard from "../components/ui/StatsCard";
import SalesChart from "../components/ui/Charts/SalesChart";
import MetricsChart from "../components/ui/Charts/MetricsChart"; // Importar MetricsChart
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  AlertCircle,
  BarChart3, // Importar BarChart3
} from "lucide-react";

const Dashboard = () => {
  const { getDashboardStats, getSalesData, loading, error } = useAdmin();

  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [metricsData, setMetricsData] = useState([]); // Agregar metricsData

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, salesResponse] = await Promise.all([
        getDashboardStats(),
        getSalesData("monthly"),
      ]);

      setStats(statsResponse.data);
      setSalesData(salesResponse.data);

      // Preparar datos para MetricsChart
      const metrics = salesResponse.data.map((item) => ({
        name: item._id,
        sales: item.totalSales,
        orders: item.orderCount,
        users: Math.floor(Math.random() * 100), // Datos de ejemplo
      }));
      setMetricsData(metrics);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error al cargar el dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Resumen general de tu negocio
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Ventas Totales"
          value={`$${stats?.totalSales?.toLocaleString() || "0"}`}
          icon={DollarSign}
          change="+12.5%"
          changeType="positive"
          description="Este mes"
        />
        <StatsCard
          title="Total Pedidos"
          value={stats?.totalOrders?.toLocaleString() || "0"}
          icon={ShoppingCart}
          change="+8.2%"
          changeType="positive"
          description="Órdenes completadas"
        />
        <StatsCard
          title="Productos"
          value={stats?.totalProducts?.toLocaleString() || "0"}
          icon={Package}
          change="+5.1%"
          changeType="positive"
          description="Productos activos"
        />
        <StatsCard
          title="Usuarios"
          value={stats?.totalUsers?.toLocaleString() || "0"}
          icon={Users}
          change="+15.3%"
          changeType="positive"
          description="Usuarios registrados"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Ventas Mensuales
            </h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <SalesChart data={salesData} />
        </div>

        {/* Metrics Chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Métricas Principales
            </h3>
            <BarChart3 className="h-5 w-5 text-blue-500" />
          </div>
          <MetricsChart
            data={metricsData}
            metrics={["sales", "orders", "users"]}
          />
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Órdenes Recientes
          </h3>
          <div className="space-y-4">
            {stats?.recentOrders?.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">
                    #{order.orderNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    ${order.totalAmount}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Productos Más Vendidos
          </h3>
          <div className="space-y-3">
            {stats?.topProducts?.map((product, index) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-primary w-6">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">
                      {product.productName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.totalSold} vendidos
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Ranking #{index + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
