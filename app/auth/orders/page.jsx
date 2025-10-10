import { useState, useEffect } from "react"
import { Package, Calendar, MapPin, DollarSign, Search, Filter, Eye, XCircle } from "lucide-react"
import { PageLayout } from "../../../components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Badge } from "../../../components/ui/badge"
import { useAuth } from "../../../src/contexts/AuthContext"
import { orderService } from "../../../src/services/orderService"
import { formatPrice, formatDate } from "../../../src/utils/utils"

export default function OrdersPage() {
  const { user, token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Cargar órdenes del usuario
  useEffect(() => {
    const loadOrders = async () => {
      if (!user || !token) return

      try {
        setLoading(true)
        const response = await orderService.getUserOrders(token)
        if (response.success) {
          setOrders(response.data.orders || [])
        } else {
          setError('Error al cargar las órdenes')
        }
      } catch (err) {
        console.error('Error loading orders:', err)
        setError('Error al cargar las órdenes')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [user, token])

  // Filtrar órdenes
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items?.some(item => 
                           item.product?.name.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Función para cancelar orden
  const handleCancelOrder = async (orderId) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta orden?')) return

    try {
      const response = await orderService.cancelOrder(orderId, token)
      if (response.success) {
        // Actualizar la lista de órdenes
        setOrders(prev => prev.map(order => 
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        ))
        alert('Orden cancelada correctamente')
      } else {
        alert('Error al cancelar la orden')
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
      alert('Error al cancelar la orden')
    }
  }

  // Función para obtener el color del badge según el estado
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pendiente', color: 'bg-yellow-500' },
      confirmed: { label: 'Confirmada', color: 'bg-blue-500' },
      processing: { label: 'En Proceso', color: 'bg-purple-500' },
      shipped: { label: 'Enviada', color: 'bg-indigo-500' },
      delivered: { label: 'Entregada', color: 'bg-green-500' },
      cancelled: { label: 'Cancelada', color: 'bg-red-500' }
    }

    const config = statusConfig[status] || { label: status, color: 'bg-gray-500' }
    
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    )
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold mb-4">Inicia sesión para ver tus pedidos</h1>
            <p className="text-muted-foreground mb-8">
              Necesitas estar autenticado para acceder a esta página
            </p>
            <a href="/auth/login">
              <Button className="btn-primary">Iniciar Sesión</Button>
            </a>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando tus pedidos...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-red-500">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="mb-8">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Mis Pedidos</h1>
          <p className="text-muted-foreground">
            Revisa el estado y detalles de todos tus pedidos
          </p>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número de orden o producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="confirmed">Confirmadas</option>
                  <option value="processing">En proceso</option>
                  <option value="shipped">Enviadas</option>
                  <option value="delivered">Entregadas</option>
                  <option value="cancelled">Canceladas</option>
                </select>
                {(searchTerm || statusFilter !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('all')
                    }}
                  >
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {orders.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Pedidos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">
                {orders.filter(o => o.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">
                {orders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-sm text-muted-foreground">Entregados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">
                {orders.filter(o => o.status === 'processing').length}
              </div>
              <div className="text-sm text-muted-foreground">En Proceso</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Órdenes */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2 mb-2">
                        <Package className="h-5 w-5" />
                        <span>Orden #{order.orderNumber}</span>
                        {getStatusBadge(order.status)}
                      </CardTitle>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatPrice(order.total)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{order.shippingAddress?.city || 'Barranquilla'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4 md:mt-0">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                      {(order.status === 'pending' || order.status === 'confirmed') && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelOrder(order._id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Items de la orden */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Productos:</h4>
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg">
                        <img
                          src={item.product?.images?.[0]?.url || item.product?.image || "/placeholder.svg"}
                          alt={item.product?.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{item.product?.name}</h5>
                          <p className="text-xs text-muted-foreground">
                            Cantidad: {item.quantity} × {formatPrice(item.product?.price)}
                          </p>
                          {item.attributes && Object.keys(item.attributes).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {Object.entries(item.attributes).map(([key, value]) => (
                                <span key={key} className="text-xs bg-background px-2 py-1 rounded">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">
                            {formatPrice((item.product?.price || 0) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Resumen de la orden */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Método de pago: <span className="font-medium capitalize">{order.paymentMethod}</span>
                        </p>
                        {order.trackingNumber && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Número de seguimiento: <span className="font-medium">{order.trackingNumber}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          Total: {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">
                {orders.length === 0 ? 'Aún no tienes pedidos' : 'No se encontraron pedidos'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {orders.length === 0 
                  ? 'Realiza tu primera compra y tus pedidos aparecerán aquí'
                  : 'Intenta ajustar tus filtros de búsqueda'
                }
              </p>
              <a href="/productos">
                <Button className="btn-primary">
                  {orders.length === 0 ? 'Comenzar a Comprar' : 'Ver Productos'}
                </Button>
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  )
}