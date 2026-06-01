import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../../constant';

const CompanySelector = ({ onSelectionChange }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_URL}/companies`);
        if (!response.ok) {
          throw new Error('Failed to retrieve companies list');
        }
        const data = await response.json();
        setCompanies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleToggleSelect = (company) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(company.id)) {
      newSelectedIds.delete(company.id);
    } else {
      newSelectedIds.add(company.id);
    }
    setSelectedIds(newSelectedIds);

    // Call the parent callback prop with the selected company objects
    if (onSelectionChange) {
      const selectedCompanies = companies.filter((c) => newSelectedIds.has(c.id));
      onSelectionChange(selectedCompanies);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Loading Brands...
        </span>
        <div className="flex flex-wrap gap-2 animate-pulse">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="h-8 rounded-full bg-slate-200"
              style={{ width: `${Math.floor(Math.random() * 40) + 60}px` }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error bg-red-50 border-red-100 text-red-700 text-xs py-3.5 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error: {error}</span>
      </div>
    );
  }

  // Determine which companies to display based on the expansion state
  const displayedCompanies = expanded ? companies : companies.slice(0, 20);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          Filter by Brand
        </span>
        {selectedIds.size > 0 && (
          <span className="badge badge-primary bg-blue-50 border-blue-100 text-blue-600 font-bold text-xs py-2 px-2.5">
            {selectedIds.size} Selected
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 transition-all duration-300">
        {displayedCompanies.map((company) => {
          const isSelected = selectedIds.has(company.id);
          return (
            <div
              key={company.id}
              onClick={() => handleToggleSelect(company)}
              className={`badge badge-lg py-4 px-3.5 cursor-pointer select-none font-medium text-xs transition-all border ${
                isSelected
                  ? 'badge-primary bg-blue-600 border-blue-600 text-white font-semibold shadow-sm'
                  : 'badge-ghost border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {company.name}
            </div>
          );
        })}
      </div>

      {companies.length > 20 && (
        <div className="flex justify-start">
          <button
            onClick={() => setExpanded(!expanded)}
            className="btn btn-link btn-xs text-blue-600 p-0 hover:no-underline font-bold transition-all"
          >
            {expanded ? 'Show Less' : `Show All (${companies.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanySelector;
