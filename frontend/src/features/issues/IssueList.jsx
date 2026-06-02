import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FaTimes, FaCopy, FaTicketAlt, FaClock, FaCalendarAlt, FaBoxOpen, FaInfoCircle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { BACKEND_URL } from '../../constant';

export const IssueList = () => {
  const { token } = useAuth();
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 100;
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (token) {
      fetchIssues(0);
    }
  }, [token]);

  useEffect(() => {
    if (isDrawerOpen && mapRef.current) {
      if (!mapInstance.current) {
        // Mumbai Coordinates
        const mumbaiCoords = fromLonLat([72.8777, 19.0760]);

        const marker = new Feature({
          geometry: new Point(mumbaiCoords),
        });

        const markerStyle = new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
            scale: 0.05
          })
        });
        marker.setStyle(markerStyle);

        const vectorSource = new VectorSource({ features: [marker] });
        const markerLayer = new VectorLayer({ source: vectorSource });

        mapInstance.current = new Map({
          target: mapRef.current,
          layers: [
            new TileLayer({ source: new OSM() }),
            markerLayer
          ],
          view: new View({
            center: mumbaiCoords,
            zoom: 12
          })
        });
      } else {
        mapInstance.current.updateSize();
      }
    }

    return () => {
      if (!isDrawerOpen && mapInstance.current) {
        mapInstance.current.setTarget(undefined);
        mapInstance.current = null;
      }
    };
  }, [isDrawerOpen]);

  const fetchIssues = async (currentOffset) => {
    try {
      const response = await fetch(`${BACKEND_URL}/issues?limit=${LIMIT}&offset=${currentOffset}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (currentOffset === 0) {
          setIssues(data);
        } else {
          setIssues(prev => [...prev, ...data]);
        }

        if (data.length < LIMIT) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        toast.error('Failed to load issues');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const loadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    fetchIssues(newOffset);
  };

  const getPendingText = (dateString) => {
    const diffTime = Math.abs(new Date() - new Date(dateString));
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Created today';
    return `${days} day${days > 1 ? 's' : ''} pending`;
  };

  const openSidebar = (issue) => {
    setSelectedIssue(issue);
    setIsDrawerOpen(true);
  };

  return (
    <div className="drawer drawer-end bg-slate-50/50 min-h-screen">
      <input id="issue-drawer" type="checkbox" className="drawer-toggle" checked={isDrawerOpen} onChange={(e) => setIsDrawerOpen(e.target.checked)} />

      <div className="drawer-content pt-4 px-4 sm:px-8">
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm text-center max-w-2xl mx-auto mt-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
            <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 shadow-inner relative z-10">
              <FaTicketAlt size={32} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight relative z-10">No Tickets Yet</h3>
            <p className="text-slate-500 mt-3 max-w-md font-medium leading-relaxed relative z-10">You haven't logged any support requests. If you need help with a product, click on "New Request" above to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {issues.map(issue => (
              <div
                key={issue.id}
                className="group relative w-[350px] bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
                onClick={() => openSidebar(issue)}
              >
                {/* Decorative background blob */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500 opacity-20 ${issue.status === 'closed' ? 'bg-emerald-200' : issue.status === 'processing' ? 'bg-blue-200' : 'bg-amber-200'
                  }`}></div>

                <div className="relative z-10 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    {issue.tokenId ? (
                      <div
                        className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-full text-xs font-mono font-medium transition-colors border border-slate-200 hover:border-blue-300 z-20"
                        title="Copy Token ID"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(issue.tokenId);
                          toast.success('Token ID copied!');
                        }}
                      >
                        #{issue.tokenId} <FaCopy className="w-3 h-3 opacity-70" />
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-xs font-medium border border-slate-100">No Token</span>
                    )}

                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase shadow-sm ${issue.status === 'closed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                      issue.status === 'processing' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}>
                      {issue.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors mb-2 pr-2">
                    {issue.device || issue.issue_with_device}
                  </h3>

                  <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-grow font-medium leading-relaxed">
                    {issue.issue_with_device}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100">
                      <FaClock className="text-slate-400 w-3 h-3" />
                      <span>{getPendingText(issue.created_at)}</span>
                    </div>
                    {issue.action && (
                      <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100 font-bold capitalize text-slate-600">
                        {issue.action}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {issues.length > 0 && hasMore && (
          <div className="flex justify-center mt-8 pb-8">
            <button
              onClick={loadMore}
              className="px-6 py-2.5 bg-white border border-slate-200 shadow-sm rounded-full text-sm font-bold text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-md transition-all active:scale-95"
            >
              Load More Issues
            </button>
          </div>
        )}
      </div>

      <div className="drawer-side z-[100]">
        <label htmlFor="issue-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="p-0 w-full max-w-md min-h-full bg-slate-50/95 backdrop-blur-xl text-base-content flex flex-col shadow-2xl border-l border-white/20">
          {selectedIssue && (
            <>
              {/* Sidebar Header */}
              <div className="bg-white/80 backdrop-blur-md px-6 py-5 border-b border-slate-200 flex justify-between items-center sticky top-0 z-20 shadow-sm">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Ticket Details</h3>
                  <p className="text-[11px] text-slate-500 font-mono mt-1.5 font-bold bg-slate-100 inline-block px-2 py-0.5 rounded border border-slate-200">
                    ID: #{selectedIssue.tokenId || selectedIssue.id}
                  </p>
                </div>
                <button className="btn btn-circle btn-ghost btn-sm bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-sm" onClick={() => setIsDrawerOpen(false)}>
                  <FaTimes className="text-slate-600" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Device & Status */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 -mr-6 -mt-6 ${selectedIssue.status === 'closed' ? 'bg-emerald-500' : selectedIssue.status === 'processing' ? 'bg-blue-500' : 'bg-amber-500'
                    }`}></div>

                  <div className="mb-5 relative z-10">
                    <div className="flex items-center gap-2 mb-1.5">
                      <FaBoxOpen className="text-slate-400" />
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Product</span>
                    </div>
                    <p className="font-extrabold text-slate-800 text-xl leading-tight">{selectedIssue.device}</p>
                  </div>

                  <div className="flex gap-4 relative z-10 pt-4 border-t border-slate-100">
                    <div className="flex-1">
                      <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">Status</span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider border ${selectedIssue.status === 'closed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        selectedIssue.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                        {selectedIssue.status === 'closed' ? <FaCheckCircle /> : selectedIssue.status === 'processing' ? <FaInfoCircle /> : <FaExclamationCircle />}
                        {selectedIssue.status}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">Resolution</span>
                      <p className="font-bold text-slate-700 capitalize inline-block bg-slate-50 px-3 py-1 rounded-md border border-slate-200 text-xs">{selectedIssue.action || 'Pending'}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-3">Issue Description</span>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">{selectedIssue.issue_with_device}</p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <FaCalendarAlt className="text-slate-300 mb-2 w-5 h-5" />
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Purchased</span>
                    <p className="text-sm font-bold text-slate-700">{new Date(selectedIssue.date_of_purchase).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <FaExclamationCircle className="text-red-300 mb-2 w-5 h-5" />
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Issue Started</span>
                    <p className="text-sm font-bold text-slate-700">{new Date(selectedIssue.date_of_issue).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>

                {/* Pickup Info */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border border-blue-200 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full opacity-5 -mr-10 -mt-10 blur-xl"></div>
                  <span className="block text-[10px] uppercase font-bold text-blue-800/60 tracking-widest mb-2">Pickup Schedule</span>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/60 p-2.5 rounded-xl border border-blue-200/50 text-blue-600">
                      <FaCalendarAlt className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-blue-900 tracking-tight">
                        {new Date(selectedIssue.date_for_pickup).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-sm font-semibold text-blue-800/80 mt-0.5">Time: {selectedIssue.timeslot_for_pickup}</p>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div ref={mapRef} className="w-full h-48 rounded-xl overflow-hidden relative z-0 border border-slate-100"></div>
                </div>

                {/* padding at bottom */}
                <div className="pb-4"></div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueList;
