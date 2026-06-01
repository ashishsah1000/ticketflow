import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { format, parseISO, startOfDay, startOfMonth, startOfYear } from 'date-fns';

const IssuesPerDayChart = ({ issues }) => {
  const [timeRange, setTimeRange] = useState('day'); // 'day', 'month', 'year'

  const data = useMemo(() => {
    if (!issues || issues.length === 0) return [];
    
    const counts = {};
    
    issues.forEach(issue => {
      const date = parseISO(issue.created_at);
      let key;
      if (timeRange === 'day') {
        key = format(startOfDay(date), 'yyyy-MM-dd');
      } else if (timeRange === 'month') {
        key = format(startOfMonth(date), 'yyyy-MM');
      } else {
        key = format(startOfYear(date), 'yyyy');
      }
      
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [issues, timeRange]);

  const formatDate = (dateStr) => {
    if (timeRange === 'day') return format(parseISO(dateStr), 'MMM dd');
    if (timeRange === 'month') return format(parseISO(dateStr + '-01'), 'MMM yyyy');
    return dateStr;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Issues Volume Trend</h3>
          <p className="text-sm text-slate-500">Tickets raised over time</p>
        </div>
        <select 
          className="select select-sm select-bordered bg-slate-50 font-medium text-slate-600"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="day">By Day</option>
          <option value="month">By Month</option>
          <option value="year">By Year</option>
        </select>
      </div>

      <div className="flex-grow w-full min-h-[250px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                minTickGap={20}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip 
                labelFormatter={(label) => formatDate(label)}
                formatter={(value) => [value, 'Issues Raised']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" activeDot={{ r: 6, fill: '#1d4ed8', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
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

export default IssuesPerDayChart;
