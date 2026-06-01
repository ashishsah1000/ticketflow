import React, { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = {
  raised: '#3b82f6', // blue
  inprogress: '#f59e0b', // amber
  closed: '#10b981', // emerald
  default: '#94a3b8' // slate
};

const IssueStatusPieChart = ({ issues }) => {
  const data = useMemo(() => {
    if (!issues || issues.length === 0) return [];
    
    const counts = {};
    issues.forEach(issue => {
      const status = issue.status ? issue.status.toLowerCase().replace(' ', '') : 'unknown';
      counts[status] = (counts[status] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ 
        name: name.charAt(0).toUpperCase() + name.slice(1), 
        value 
      }))
      .sort((a, b) => b.value - a.value);
  }, [issues]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-xl border border-slate-100">
          <p className="font-bold text-slate-800 text-sm mb-1">{payload[0].name}</p>
          <p className="text-blue-600 font-bold">{payload[0].value} Tickets</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">Status Distribution</h3>
        <p className="text-sm text-slate-500">Current state of all tickets</p>
      </div>

      <div className="flex-grow w-full min-h-[250px] flex items-center justify-center">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name.toLowerCase()] || COLORS.default} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueStatusPieChart;
