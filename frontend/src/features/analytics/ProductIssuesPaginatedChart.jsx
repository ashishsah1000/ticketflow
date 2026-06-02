import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProductIssuesPaginatedChart = ({ products }) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 20;

  const processedData = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    const parsed = products.map(product => {
      const count = Number(product.complainCount) || 0;
      return {
        name: product.name,
        company: product.store || 'Unknown',
        complaints: count
      };
    });

    return parsed.sort((a, b) => b.complaints - a.complaints);
  }, [products]);

  const maxPage = Math.max(0, Math.ceil(processedData.length / itemsPerPage) - 1);
  const currentData = processedData.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 shadow-lg rounded-xl border border-slate-100 max-w-xs">
          <p className="font-bold text-slate-800 text-sm mb-1">{data.name}</p>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{data.company}</p>
          <p className="text-rose-600 font-bold">{data.complaints} Complaints</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full col-span-1 lg:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Most Complained Products</h3>
          <p className="text-sm text-slate-500">Ranked by total complaints</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 font-medium">
            Showing {page * itemsPerPage + 1}-{Math.min((page + 1) * itemsPerPage, processedData.length)} of {processedData.length}
          </span>
          <div className="join">
            <button 
              className="join-item btn btn-sm" 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <FaChevronLeft />
            </button>
            <button 
              className="join-item btn btn-sm" 
              onClick={() => setPage(p => Math.min(maxPage, p + 1))}
              disabled={page === maxPage}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-grow w-full min-h-[350px]">
        {currentData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                angle={-45}
                textAnchor="end"
                interval={0}
                height={80}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip cursor={{ fill: '#f1f5f9' }} content={<CustomTooltip />} />
              <Bar dataKey="complaints" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={30}>
                {currentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index < 5 && page === 0 ? '#ef4444' : '#f43f5e'} opacity={index < 5 && page === 0 ? 1 : 0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            No product data available
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductIssuesPaginatedChart;
