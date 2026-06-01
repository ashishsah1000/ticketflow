import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FaUser, FaPhone, FaCalendarAlt, FaDesktop, FaExclamationTriangle, FaClock, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { BACKEND_URL } from '../../constant';
import ProductCatalog from '../product/ProductCatalog';

export const IssueForm = ({ onSuccess }) => {
  const { user, token } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    mobile_number: '',
    date_of_purchase: '',
    device: '',
    product_id: null,
    issue_with_device: '',
    date_of_issue: '',
    date_for_pickup: '',
    timeslot_for_pickup: '8-11am'
  });

  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: `${user.firstname || ''} ${user.lastname || ''}`.trim(),
        mobile_number: user.phone || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.mobile_number) {
        toast.error('Please complete contact details');
        return false;
      }
    } else if (step === 2) {
      if (!formData.device || !formData.date_of_purchase || !formData.date_of_issue || !formData.issue_with_device) {
        toast.error('Please complete product and issue details');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date_for_pickup || !formData.timeslot_for_pickup) {
      toast.error('Please complete pickup details');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(BACKEND_URL + '/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        toast.success('Support request submitted successfully!');
        if (onSuccess) {
          onSuccess();
        } else {
          // Fallback if onSuccess is not provided
          window.location.reload();
        }
      } else {
        const err = await response.json();
        toast.error(`Error: ${err.message || 'Failed to raise issue'}`);
      }
    } catch (error) {
      toast.error('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Stepper Header */}
      <div className="mb-10">
        <ul className="steps w-full font-semibold text-sm">
          <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Contact Info</li>
          <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Issue Details</li>
          <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Pickup Schedule</li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">

        {/* Step Indicator Top Bar */}
        <div className="h-2 w-full bg-slate-100 flex">
          <div className="bg-primary h-full transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-6">
            {step === 1 && 'Confirm Contact Information'}
            {step === 2 && 'What seems to be the problem?'}
            {step === 3 && 'Schedule Device Pickup'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* STEP 1: Contact Info */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold text-slate-700">Full Name</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaUser /></span>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input input-bordered w-full pl-11 bg-slate-50 focus:bg-white transition-colors" placeholder="Your Name" />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-bold text-slate-700">Mobile Number</span></label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaPhone /></span>
                    <input type="text" name="mobile_number" value={formData.mobile_number} readOnly className="input input-bordered w-full pl-11 bg-slate-100 text-slate-500 cursor-not-allowed" />
                  </div>
                  <label className="label"><span className="label-text-alt text-slate-400">Auto-filled from your secure profile</span></label>
                </div>
              </div>
            )}

            {/* STEP 2: Product & Issue */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold text-slate-700">Device / Product</span></label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaDesktop /></span>
                      <input
                        type="text"
                        name="device"
                        value={formData.device}
                        onChange={(e) => setFormData(prev => ({ ...prev, device: e.target.value, product_id: null }))}
                        required
                        className="input input-bordered w-full pl-11 bg-slate-50 focus:bg-white transition-colors"
                        placeholder="Enter manually or Browse Catalog"
                      />
                    </div>
                    <button type="button" className="btn btn-primary btn-outline" onClick={() => setIsCatalogModalOpen(true)}>Browse Catalog</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold text-slate-700">Date of Purchase</span></label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaCalendarAlt /></span>
                      <input type="date" name="date_of_purchase" value={formData.date_of_purchase} onChange={handleChange} required className="input input-bordered w-full pl-11 bg-slate-50 focus:bg-white transition-colors" />
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold text-slate-700">Issue Started On</span></label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaCalendarAlt /></span>
                      <input type="date" name="date_of_issue" value={formData.date_of_issue} onChange={handleChange} required className="input input-bordered w-full pl-11 bg-slate-50 focus:bg-white transition-colors" />
                    </div>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-bold text-slate-700">Describe the Issue</span></label>
                  <div className="relative">
                    <span className="absolute top-4 left-0 flex items-center pl-4 text-slate-400"><FaExclamationTriangle /></span>
                    <textarea name="issue_with_device" value={formData.issue_with_device} onChange={handleChange} required className="textarea textarea-bordered w-full pl-11 h-28 bg-slate-50 focus:bg-white transition-colors leading-relaxed" placeholder="Please provide specific details about what is wrong with the device..."></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Pickup Schedule */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-4 text-sm text-blue-800">
                  Our service agent will arrive at your registered address to collect the device. Please select a convenient time below.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold text-slate-700">Preferred Date</span></label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaCalendarAlt /></span>
                      <input type="date" name="date_for_pickup" value={formData.date_for_pickup} onChange={handleChange} required className="input input-bordered w-full pl-11 bg-slate-50 focus:bg-white transition-colors" />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold text-slate-700">Preferred Timeslot</span></label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"><FaClock /></span>
                      <select name="timeslot_for_pickup" value={formData.timeslot_for_pickup} onChange={handleChange} required className="select select-bordered w-full pl-11 bg-slate-50 focus:bg-white transition-colors font-medium">
                        <option value="8-11am">8:00 AM - 11:00 AM</option>
                        <option value="11-2pm">11:00 AM - 2:00 PM</option>
                        <option value="2-5pm">2:00 PM - 5:00 PM</option>
                        <option value="5-8pm">5:00 PM - 8:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center mt-8">
              {step > 1 ? (
                <button type="button" className="btn btn-ghost hover:bg-slate-100" onClick={prevStep}>
                  <FaArrowLeft className="mr-2" /> Back
                </button>
              ) : (
                <div></div> // Empty div for flex spacing
              )}

              {step < totalSteps ? (
                <button type="button" className="btn btn-primary px-8" onClick={nextStep}>
                  Continue <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <button type="submit" className="btn btn-primary px-8" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>Submit Request <FaCheck className="ml-2" /></>
                  )}
                </button>
              )}
            </div>

          </form>
        </div>
      </div>

      {/* Catalog Modal */}
      {isCatalogModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-50 w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl relative flex flex-col">
            <div className="bg-white p-4 border-b border-slate-200 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-slate-800 ml-2">Product Catalog</h3>
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost bg-slate-100 hover:bg-slate-200"
                onClick={() => setIsCatalogModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              <ProductCatalog
                onProductSelect={(product) => {
                  setFormData(prev => ({
                    ...prev,
                    device: product.name,
                    product_id: product.id
                  }));
                  setIsCatalogModalOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
