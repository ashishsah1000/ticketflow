import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];

const CompaniesMostIssuesChart = ({ products }) => {
  const data = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    const companyMap = {};
    
    products.forEach(product => {
      // Parse complainCount safely, handling values like "23 Reviews" or "1k Reviews"
      let count = 0;
      if (product.complainCount && product.complainCount !== 'N/A') {
        // extract numbers
        const match = String(product.complainCount).match(/\d+/);
        if (match) {
          count = parseInt(match[0], 10);
        }
      }
      
      const storeName = product.store || 'Unknown';
      companyMap[storeName] = (companyMap[storeName] || 0) + count;
    });

    return Object.entries(companyMap)
      .map(([name, complaints]) => ({ name, complaints }))
      .sort((a, b) => b.complaints - a.complaints) // Highest first
      .slice(0, 10); // Top 10 companies
  }, [products]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">Most Problematic Companies</h3>
        <p className="text-sm text-slate-500">Top 10 brands by total reported complaints</p>
      </div>

      <div className="flex-grow w-full min-h-[250px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis 
                type="number" 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} 
                axisLine={false} 
                tickLine={false} 
                width={100}
              />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                formatter={(value) => [value, 'Total Complaints']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="complaints" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

export default CompaniesMostIssuesChart;
