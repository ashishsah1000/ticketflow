import React from 'react';

const RaiseTicketForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Simulated ticket created!');
  };

  return (
    <div className="card bg-base-50 border border-base-200">
      <div className="card-body p-6">
        <h3 className="font-bold text-slate-900 text-base mb-4">Raise a Support Ticket</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold text-slate-600 text-xs uppercase tracking-wider">Select Purchased Product</span>
            </label>
            <select className="select select-bordered w-full text-slate-800">
              <option>Smart Wireless Hub</option>
              <option>Supercharge Router v2</option>
              <option>Smart Sensor Suite</option>
            </select>
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold text-slate-600 text-xs uppercase tracking-wider">Describe the Issue</span>
            </label>
            <textarea
              rows="4"
              required
              className="textarea textarea-bordered w-full text-slate-800"
              placeholder="Please provide details about what is broken, purchase logs, or clarify the technical support needed..."
            ></textarea>
          </div>
          <div className="card-actions justify-start mt-2">
            <button type="submit" className="btn btn-primary bg-blue-600 hover:bg-blue-500 border-none text-white shadow shadow-blue-500/10 cursor-pointer">
              Submit Support Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicketForm;
