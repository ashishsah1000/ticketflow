import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const TicketSearch = () => {
  const [ticketNumber, setTicketNumber] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (ticketNumber.trim()) {
      alert(`Searching for ticket: ${ticketNumber}`);
      // Future integration: fetch ticket data and route or display it
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md mx-auto relative">
      <div className="join w-full shadow-md rounded-full">
        <input
          type="text"
          className="input input-bordered join-item w-full bg-white text-slate-900 focus:outline-none focus:border-blue-500 rounded-l-full pl-6"
          placeholder="Enter complaint number (e.g. #TK-12345)"
          value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value)}
        />
        <button type="submit" className="btn btn-primary join-item rounded-r-full bg-blue-600 hover:bg-blue-700 border-none text-white px-8 flex items-center gap-2">
          <FiSearch className="text-lg" />
          Check Status
        </button>
      </div>
    </form>
  );
};

export default TicketSearch;
