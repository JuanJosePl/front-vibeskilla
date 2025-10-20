import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { Search, Filter, Eye, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

const Orders = () => {
  const { getOrders, updateOrderStatus, loading } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    paymentStatus: ''
  });

  useEffect(() => {
    loadOrders();
  }, [filters]);

  const loadOrders = async () => {
    try {
      const response = await getOrders(filters);
      setOrders(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      processing: Truck,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
      refunded: XCircle
    };
    return icons[status] || Clock;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Órdenes</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona y realiza seguimiento de las órdenes
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, status: '', page: 1 }))}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filters.status === '' 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-background border-border hover:bg-accent'
              }`}
            >
              Todas
            </button>
            {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map(status => (
              <button
                key={status}
                onClick={() => setFilters(prev => ({ ...prev, status, page: 1 }))}
                className={`px-4 py-2 rounded-lg border transition-colors capitalize ${
                  filters.status === status 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background border-border hover:bg-accent'
                }`}
              >
                {status === 'pending' && 'Pendientes'}
                {status === 'confirmed' && 'Confirmadas'}
                {status === 'processing' && 'Procesando'}
                {status === 'shipped' && 'Enviadas'}
                {status === 'delivered' && 'Entregadas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Orden</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Cliente</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Fecha</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Total</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Estado</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Pago</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                    <tr key={order._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-foreground">#{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} producto(s)
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-foreground">
                            {order.customerInfo.firstName} {order.customerInfo.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {order.customerInfo.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-foreground">
                          ${order.totalAmount}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="h-4 w-4" />
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            className={`text-xs font-medium px-2 py-1 rounded border-0 focus:ring-1 focus:ring-primary ${getStatusColor(order.status)}`}
                          >
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmada</option>
                            <option value="processing">Procesando</option>
                            <option value="shipped">Enviada</option>
                            <option value="delivered">Entregada</option>
                            <option value="cancelled">Cancelada</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus === 'paid' && 'Pagado'}
                          {order.paymentStatus === 'pending' && 'Pendiente'}
                          {order.paymentStatus === 'failed' && 'Fallido'}
                          {order.paymentStatus === 'refunded' && 'Reembolsado'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {orders.length === 0 && (
              <div className="text-center py-12">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No hay órdenes</h3>
                <p className="text-muted-foreground">
                  {filters.status 
                    ? `No se encontraron órdenes con estado "${filters.status}".` 
                    : 'Aún no hay órdenes en tu tienda.'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Mostrando {orders.length} de {pagination.total} órdenes
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={filters.page === 1}
                    className="px-3 py-1 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-sm text-muted-foreground">
                    Página {filters.page} de {pagination.pages}
                  </span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={filters.page === pagination.pages}
                    className="px-3 py-1 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;