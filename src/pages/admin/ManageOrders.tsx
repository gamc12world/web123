import React, { useState } from 'react';
import { orders as initialOrders } from '../../data/orders';
import { users } from '../../data/users';
import { Order } from '../../types';
import { Search, Eye, ArrowDownUp } from 'lucide-react';

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [sortField, setSortField] = useState<'date' | 'total'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (users.find(u => u.id === order.userId)?.name.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === '' || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return sortDirection === 'asc' 
        ? a.total - b.total
        : b.total - a.total;
    }
  });

  const toggleSort = (field: 'date' | 'total') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(
      orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder({ ...viewingOrder, status: newStatus });
    }
  };

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order);
  };

  const closeOrderDetail = () => {
    setViewingOrder(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Manage Orders</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input w-full md:w-auto"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <button 
                  onClick={closeOrderDetail}
                  className="text-slate-500 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium mb-2">Order Information</h3>
                  <p className="text-sm text-slate-600">Order ID: #{viewingOrder.id.slice(0, 8)}</p>
                  <p className="text-sm text-slate-600">
                    Date: {new Date(viewingOrder.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-slate-600">
                    Customer: {users.find(u => u.id === viewingOrder.userId)?.name || 'Guest'}
                  </p>
                  <div className="mt-2">
                    <label className="block text-sm font-medium mb-1">Status:</label>
                    <select
                      value={viewingOrder.status}
                      onChange={(e) => handleStatusChange(viewingOrder.id, e.target.value as Order['status'])}
                      className="input w-full"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <p className="text-sm text-slate-600">{viewingOrder.shippingAddress.fullName}</p>
                  <p className="text-sm text-slate-600">{viewingOrder.shippingAddress.streetAddress}</p>
                  <p className="text-sm text-slate-600">
                    {viewingOrder.shippingAddress.city}, {viewingOrder.shippingAddress.state} {viewingOrder.shippingAddress.postalCode}
                  </p>
                  <p className="text-sm text-slate-600">{viewingOrder.shippingAddress.country}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-4">Order Items</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Details
                        </th>
                        <th className="px-4 py-3 bg-slate-50 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 bg-slate-50 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 bg-slate-50 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {viewingOrder.items.map((item) => (
                        <tr key={`${item.product.id}-${item.size}-${item.color}`}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  className="h-10 w-10 rounded-md object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">
                                  {item.product.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-slate-500">
                              Size: {item.size}
                            </div>
                            <div className="text-sm text-slate-500">
                              Color: {item.color}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-slate-900">
                            ${item.product.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-slate-900">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-slate-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-end border-t border-slate-200 pt-6">
                <div className="w-64">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600">Subtotal:</span>
                    <span className="text-sm text-slate-900">${(viewingOrder.total * 0.9).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600">Tax:</span>
                    <span className="text-sm text-slate-900">${(viewingOrder.total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${viewingOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-lg">
              <div className="flex justify-end">
                <button
                  onClick={closeOrderDetail}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                  <button 
                    onClick={() => toggleSort('date')}
                    className="flex items-center text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Date
                    <ArrowDownUp size={12} className="ml-1" />
                  </button>
                </th>
                <th className="px-6 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 bg-slate-50 text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <button 
                    onClick={() => toggleSort('total')}
                    className="flex items-center text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Total
                    <ArrowDownUp size={12} className="ml-1" />
                  </button>
                </th>
                <th className="px-6 py-3 bg-slate-50 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {sortedOrders.length > 0 ? (
                sortedOrders.map((order) => {
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
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                          className="input py-1 px-2 text-xs rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-center">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          <Eye size={16} />
                          <span className="sr-only">View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-slate-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;