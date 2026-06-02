import React from 'react';
import { ProductCatalog } from '../../features';

const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Our Products</h1>
          <p className="text-slate-500 mt-2 text-lg">Browse our complete catalog of products and support items.</p>
        </div>
        
        <ProductCatalog cardClassName="bg-white rounded-2xl shadow-sm border border-slate-200" />
      </div>
    </div>
  );
};

export default ProductsPage;
