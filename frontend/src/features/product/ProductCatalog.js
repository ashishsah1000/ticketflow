import React, { useState, useEffect } from 'react';
import { FiStar, FiSearch, FiPackage, FiMessageCircle } from 'react-icons/fi';
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

        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="text-slate-400 text-lg" />
          </div>
          <input 
            type="text" 
            placeholder="Search products by name, category, or brand..." 
            className="input w-full pl-12 pr-4 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all rounded-xl shadow-sm" 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <CompanySelector onSelectionChange={handleCompanyChange} />

        {productsError && (
          <div className="alert alert-error text-xs py-3">{productsError}</div>
        )}

        {productsLoading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm p-4 h-[320px]">
                <div className="h-40 bg-slate-100 animate-pulse rounded-xl w-full mb-5"></div>
                <div className="h-5 bg-slate-100 animate-pulse rounded w-3/4 mb-4"></div>
                <div className="flex gap-2 mb-6">
                  <div className="h-6 bg-slate-100 animate-pulse rounded-md w-16"></div>
                  <div className="h-6 bg-slate-100 animate-pulse rounded-md w-20"></div>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between">
                  <div className="h-7 bg-slate-100 animate-pulse rounded-lg w-16"></div>
                  <div className="h-7 bg-slate-100 animate-pulse rounded-lg w-24"></div>
                </div>
              </div>
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
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <FiPackage className="text-3xl text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">No products found</h3>
                <p className="text-slate-500 max-w-sm text-sm">We couldn't find any products matching your search criteria. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div 
                      key={product.id} 
                      className={`flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group ${onProductSelect ? 'cursor-pointer hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300' : 'hover:shadow-md transition-shadow duration-300'}`}
                      onClick={() => onProductSelect && onProductSelect(product)}
                    >
                      <figure className="relative h-48 bg-white p-5 flex items-center justify-center border-b border-slate-50 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 mix-blend-multiply"></div>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200';
                          }}
                        />
                      </figure>
                      <div className="flex flex-col flex-grow p-5 space-y-3">
                        <div className="flex-grow space-y-2">
                          <h4 className="text-[15px] text-slate-800 font-bold leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </h4>
                          <div className="flex gap-2 flex-wrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                              {product.store || 'Unknown'}
                            </span>
                            {product.category && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 line-clamp-1 max-w-[120px]">
                                {product.category.split(',')[0]}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col pt-4 border-t border-slate-50 mt-auto">
                          {product.ratings > 0 ? (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg font-bold text-sm">
                                <FiStar className="fill-amber-500" /> 
                                <span>{product.ratings}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-rose-600 font-semibold bg-rose-50 px-2 py-1 rounded-lg border border-rose-100/50">
                                <FiMessageCircle />
                                <span>
                                  {!product.complainCount || product.complainCount === 'N/A' 
                                    ? '0' 
                                    : (typeof product.complainCount === 'string' ? product.complainCount.replace(/Reviews/g, '').replace(/Review/g, '').trim() : product.complainCount)} Complaints
                                </span> 
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1.5 text-slate-400 font-medium px-1">
                                <FiStar /> <span>Unrated</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium px-1">
                                <FiMessageCircle /> <span>No complaints yet</span>
                              </div>
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
