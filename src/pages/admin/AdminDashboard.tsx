import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, Package, TrendingUp } from 'lucide-react';
import { products } from '../../data/products';
import { orders } from '../../data/orders';
import { users } from '../../data/users';

const AdminDashboard: React.FC = () => {
  // Calculate dashboard stats
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  // Recent orders for display
  const recentOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Orders</p>
              <h3 className="text-2xl font-bold">{totalOrders}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">${totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
              <ShoppingBag size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Products</p>
              <h3 className="text-2xl font-bold">{totalProducts}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Users</p>
              <h3 className="text-2xl font-bold">{totalUsers}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-slate-600 hover:text-slate-900">
            View all
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const user = users.find(u => u.id === order.userId);
                  
                  return (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {user?.name || 'Guest'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-slate-100 text-slate-800'}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        ${order.total.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-slate-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/products"
              className="block p-3 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center">
                <ShoppingBag size={20} className="text-slate-600 mr-3" />
                <div>
                  <p className="font-medium">Add New Product</p>
                  <p className="text-sm text-slate-500">Add a new product to the store</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/admin/orders"
              className="block p-3 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center">
                <Package size={20} className="text-slate-600 mr-3" />
                <div>
                  <p className="font-medium">Manage Orders</p>
                  <p className="text-sm text-slate-500">Update order status and information</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Store Overview</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-500 mb-2">Products by Category</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600">Men</span>
                    <span className="text-sm text-slate-600">
                      {products.filter(p => p.category === 'men').length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(products.filter(p => p.category === 'men').length / totalProducts) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600">Women</span>
                    <span className="text-sm text-slate-600">
                      {products.filter(p => p.category === 'women').length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-pink-500 h-2 rounded-full"
                      style={{
                        width: `${(products.filter(p => p.category === 'women').length / totalProducts) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600">Kids</span>
                    <span className="text-sm text-slate-600">
                      {products.filter(p => p.category === 'kids').length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(products.filter(p => p.category === 'kids').length / totalProducts) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;