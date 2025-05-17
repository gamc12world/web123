import React, { useState } from 'react';
import { products as initialProducts } from '../../data/products';
import { Product } from '../../types';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import ProductForm from '../../components/admin/ProductForm';

const ManageProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsAdding(false);
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    if (editingProduct) {
      // Update existing product
      setProducts(
        products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      setEditingProduct(null);
    } else if (isAdding) {
      // Add new product
      setProducts([...products, updatedProduct]);
      setIsAdding(false);
    }
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingProduct(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingProduct(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button onClick={handleAddNew} className="btn btn-primary">
          <Plus size={18} className="mr-2" />
          Add New Product
        </button>
      </div>

      {isAdding || editingProduct ? (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">
            {isAdding ? 'Add New Product' : 'Edit Product'}
          </h2>
          <ProductForm
            product={editingProduct || undefined}
            onSubmit={handleSaveProduct}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <>
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
              <div className="ml-4">
                <select className="input">
                  <option value="">All Categories</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 bg-slate-50 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {product.sizes.join(', ')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-900 capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-900">
                          ${product.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            product.inStock
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-slate-600 hover:text-slate-900 mr-3"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-sm text-slate-500"
                      >
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageProducts;
