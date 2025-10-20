import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/products', icon: Package, label: 'Productos' },
  { path: '/admin/categories', icon: Tags, label: 'Categorías' },
  { path: '/admin/orders', icon: ShoppingCart, label: 'Pedidos' },
  { path: '/admin/users', icon: Users, label: 'Usuarios' },
];

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  return (
    <div className={`
      bg-card border-r border-border h-screen flex flex-col transition-all duration-300
      ${isCollapsed ? 'w-20' : 'w-64'}
    `}>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        {!isCollapsed ? (
          <h1 className="text-xl font-bold gradient-text">Admin Panel</h1>
        ) : (
          <div className="w-8 h-8 bg-primary rounded-lg mx-auto"></div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <Icon className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!isCollapsed && <span className="ml-2 text-sm">Contraer</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;