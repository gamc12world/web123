import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { getProductsByCategory } from '../data/products';
import { Product } from '../types';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      // Simulate API fetch delay
      const timer = setTimeout(() => {
        const fetchedProducts = getProductsByCategory(category);
        setProducts(fetchedProducts);
        setLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [category]);

  const getCategoryTitle = () => {
    switch (category) {
      case 'men':
        return "Men's Collection";
      case 'women':
        return "Women's Collection";
      case 'kids':
        return "Kids' Collection";
      default:
        return "Products";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-200 rounded w-1/4 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <div className="h-64 bg-slate-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-12">{getCategoryTitle()}</h1>
      <ProductGrid products={products} />
    </div>
  );
};

export default CategoryPage;