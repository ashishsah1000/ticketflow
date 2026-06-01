import React, { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import CompanySelector from '../company/CompanySelector';
import { BACKEND_URL } from '../../constant';

const ProductCatalog = ({ title = 'Explore Support Catalog', cardClassName = 'card bg-base-100 border border-base-200 shadow-sm', onProductSelect }) => {
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleCompanyChange = (selected) => {
    setSelectedCompanies(selected);
    setProducts([]);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setProducts([]);
    setPage(1);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const companyIdsQuery = selectedCompanies.map((c) => c.id).join(',');
        const url = `${BACKEND_URL}/products?page=${page}&limit=20${
          companyIdsQuery ? `&companyIds=${companyIdsQuery}` : ''
        }${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`;
        
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Failed to retrieve products list');
        }
        const data = await res.json();
        
        if (page === 1) {
          setProducts(data.data || []);
        } else {
          setProducts(prev => [...prev, ...(data.data || [])]);
        }
        
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setProductsError(err.message);
      } finally {
        setProductsLoading(false);
      }
    };
    
    // Add debounce for search query
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [selectedCompanies, page, searchQuery]);

  return (
    <div className={cardClassName}>
      <div className="card-body p-6 space-y-6">

        
        <input 
          type="text" 
          placeholder="Search products..." 
          className="input input-bordered w-full" 
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <CompanySelector onSelectionChange={handleCompanyChange} />

        {productsError && (
          <div className="alert alert-error text-xs py-3">{productsError}</div>
        )}

        {productsLoading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-44 bg-slate-200 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6 relative min-h-[250px]">
            {productsLoading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-xl transition-all duration-200">
                <span className="loading loading-spinner loading-lg text-blue-600"></span>
              </div>
            )}
            {products.length === 0 ? (
              <div className="text-center text-sm py-12 text-slate-400">
                No products found.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div 
                      key={product.id} 
                      className={`card bg-base-100 border border-base-200 shadow-sm ${onProductSelect ? 'cursor-pointer hover:border-primary transition-colors' : ''}`}
                      onClick={() => onProductSelect && onProductSelect(product)}
                    >
                      <figure className="px-4 pt-4 h-32 flex items-center justify-center bg-slate-50/50">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200';
                          }}
                        />
                      </figure>
                      <div className="card-body p-4 space-y-2 justify-between">
                        <div>
                          <h4 className="card-title text-sm text-slate-900 font-bold line-clamp-1">
                            {product.name}
                          </h4>
                          <div className="flex gap-1.5 flex-wrap mt-1.5">
                            <span className="badge badge-outline text-[10px] text-slate-400 py-1 px-2.5 font-bold uppercase tracking-wider">
                              {product.store}
                            </span>
                            <span className="badge badge-outline text-[10px] text-slate-400 py-1 px-2.5 font-bold uppercase tracking-wider line-clamp-1">
                              {product.category?.split(',')[0]}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col mt-3 pt-3 border-t border-slate-100">
                          {product.ratings > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md font-bold text-sm">
                                <FiStar className="fill-amber-500" /> 
                                <span>{product.ratings}</span>
                              </div>
                              <span className="text-xs text-slate-500 font-medium">
                                {!product.complainCount || product.complainCount === 'N/A' 
                                  ? '0 Complaints' 
                                  : product.complainCount.replace(/Reviews/g, 'Complaints').replace(/Review/g, 'Complaint')}
                             &nbsp;Complaints </span> 
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-slate-400 text-sm font-medium">
                              <FiStar /> <span>No complains yet</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {page < totalPages && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() => setPage(prev => prev + 1)}
                      disabled={productsLoading}
                      className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none text-white px-8 rounded-full shadow-md"
                    >
                      {productsLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        'Load More Products'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCatalog;
