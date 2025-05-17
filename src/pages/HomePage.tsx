import React from 'react';
import Hero from '../components/Hero';
import FeaturedCategories from '../components/FeaturedCategories';
import ProductGrid from '../components/ProductGrid';
import { getFeaturedProducts } from '../data/products';

const HomePage: React.FC = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <div>
      <Hero />
      <FeaturedCategories />
      
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">Featured Products</h2>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
      
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Free Shipping on Orders Over $50</h2>
          <p className="max-w-2xl mx-auto text-slate-600 mb-8">
            Shop now and enjoy free shipping on all orders over $50. Limited time offer.
          </p>
          <button className="btn btn-accent">
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;