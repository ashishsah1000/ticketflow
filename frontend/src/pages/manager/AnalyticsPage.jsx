import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BACKEND_URL } from '../../constant';
import { FaChartLine } from 'react-icons/fa';
import IssuesPerDayChart from '../../features/analytics/IssuesPerDayChart';
import CompaniesMostIssuesChart from '../../features/analytics/CompaniesMostIssuesChart';
import ProductIssuesPaginatedChart from '../../features/analytics/ProductIssuesPaginatedChart';
import IssueStatusPieChart from '../../features/analytics/IssueStatusPieChart';

const AnalyticsPage = () => {
  const { token, user } = useAuth();
  
  const [issues, setIssues] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // We only want managers or admins accessing this page. 
  // (Assuming route guards handle this, but we can have an extra check).

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all issues globally
        const issuesRes = await fetch(`${BACKEND_URL}/issues/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const issuesData = await issuesRes.json();
        if (issuesRes.ok) setIssues(issuesData);

        // Fetch products. Since ProductCatalog paginates, we can fetch a large limit here
        // or a specific endpoint if the backend supported it. We'll fetch 1000 items to get a good dataset.
        const productsRes = await fetch(`${BACKEND_URL}/products?page=1&limit=1000`);
        const productsData = await productsRes.json();
        if (productsRes.ok) setProducts(productsData.data || []);

      } catch (error) {
        console.error("Failed to load analytics data", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-[500px]">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
              <FaChartLine className="text-blue-600" /> Manager Analytics
            </h1>
            <p className="text-slate-500 mt-2 text-sm md:text-base">
              Comprehensive overview of product reliability and ticket resolution metrics.
            </p>
          </div>
        </div>

        {/* 2x2 Grid for Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Component 1: Issues per day */}
          <IssuesPerDayChart issues={issues} />

          {/* Component 2: Companies with most issues */}
          <CompaniesMostIssuesChart products={products} />

          {/* Component 4: Custom pie chart (fits nicely in half width) */}
          <IssueStatusPieChart issues={issues} />

          {/* Component 3: Paginated products (made full width for better readability on desktop) */}
          <ProductIssuesPaginatedChart products={products} />
          
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;
