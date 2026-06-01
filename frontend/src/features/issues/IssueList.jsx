import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FaTimes, FaCopy, FaTicketAlt } from 'react-icons/fa';
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
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (token) {
      fetchIssues();
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

        // Simple default marker style (using an SVG pin or simple circle)
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

  const fetchIssues = async () => {
    try {
      const response = await fetch(BACKEND_URL + '/issues', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setIssues(data);
      } else {
        toast.error('Failed to load issues');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const getDaysSince = (dateString) => {
    const diffTime = Math.abs(new Date() - new Date(dateString));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const openSidebar = (issue) => {
    setSelectedIssue(issue);
    setIsDrawerOpen(true);
  };

  return (
    <div className="drawer drawer-end">
      <input id="issue-drawer" type="checkbox" className="drawer-toggle" checked={isDrawerOpen} onChange={(e) => setIsDrawerOpen(e.target.checked)} />

      <div className="drawer-content pt-2">
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <FaTicketAlt size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Tickets Yet</h3>
            <p className="text-slate-500 mt-2 max-w-md">You haven't logged any support requests. If you need help with a product, click on "New Request" above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map(issue => (
              <div
                key={issue.id}
                className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
                onClick={() => openSidebar(issue)}
              >
                <div className={`h-1.5 w-full ${issue.status === 'closed' ? 'bg-emerald-400' : 'bg-blue-500'}`}></div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-slate-800 truncate pr-2 w-full">{issue.device || issue.issue_with_device}</h3>
                    {issue.tokenId && (
                      <div
                        className="badge bg-blue-50 text-blue-700 border-blue-200 font-mono text-xs flex items-center gap-1 shrink-0 z-10 py-2.5 px-3 hover:bg-blue-100 transition-colors cursor-copy"
                        title="Copy Token ID"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(issue.tokenId);
                          toast.success('Token ID copied!');
                        }}
                      >
                        #{issue.tokenId} <FaCopy size={10} />
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">
                    {issue.issue_with_device}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${issue.status === 'closed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                      </span>
                      {issue.action && <span className="text-xs text-slate-400 font-medium border border-slate-200 px-2 py-0.5 rounded-full">{issue.action}</span>}
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                      {getDaysSince(issue.created_at)}d ago
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="drawer-side z-[100]">
        <label htmlFor="issue-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="p-0 w-full max-w-md min-h-full bg-slate-50 text-base-content flex flex-col shadow-2xl">
          {selectedIssue && (
            <>
              {/* Sidebar Header */}
              <div className="bg-white px-6 py-5 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800">Ticket Details</h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">ID: #{selectedIssue.tokenId || selectedIssue.id}</p>
                </div>
                <button className="btn btn-circle btn-ghost btn-sm bg-slate-100 hover:bg-slate-200" onClick={() => setIsDrawerOpen(false)}>
                  <FaTimes className="text-slate-600" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Device & Status */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="mb-4">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Product</span>
                    <p className="font-bold text-slate-800 text-lg">{selectedIssue.device}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Status</span>
                      <span className={`inline-block px-3 py-1 rounded-md text-sm font-bold ${selectedIssue.status === 'closed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {selectedIssue.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Resolution</span>
                      <p className="font-semibold text-slate-700 capitalize">{selectedIssue.action || 'Pending'}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Issue Description</span>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedIssue.issue_with_device}</p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Purchased On</span>
                    <p className="text-sm font-semibold text-slate-700">{new Date(selectedIssue.date_of_purchase).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Issue Started</span>
                    <p className="text-sm font-semibold text-slate-700">{new Date(selectedIssue.date_of_issue).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Pickup Info */}
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 rounded-full opacity-5 -mr-8 -mt-8"></div>
                  <span className="block text-[10px] uppercase font-bold text-blue-800/70 tracking-wider mb-2">Pickup Schedule</span>
                  <p className="text-base font-bold text-blue-900">
                    {new Date(selectedIssue.date_for_pickup).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium text-blue-800 mt-1">Time: {selectedIssue.timeslot_for_pickup}</p>
                </div>

                {/* Map */}
                <div className="bg-white  rounded-xl border border-slate-200 shadow-sm">
                  {/* <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-2 pt-2">Service Center Location</h4> */}
                  <div ref={mapRef} className="w-full h-48 rounded-lg overflow-hidden relative z-0"></div>
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
