import React, { useState, useEffect } from 'react';
import { FileText, Calendar, CheckCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/analysis/history');
        setHistory(res.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Analysis History</h1>
        <p className="text-slate-500 mt-2">Review your past resume analyses and track your progress over time.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-100 animate-pulse"></div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No history found</h3>
          <p className="text-slate-500">You haven't analyzed any resumes yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((record) => (
            <div key={record._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Header / Summary */}
              <div 
                className="p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50"
                onClick={() => toggleExpand(record._id)}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      {record.resumeId?.fileName || 'Resume'}
                    </h3>
                    <p className="text-sm text-slate-500 flex items-center mt-1">
                      <Calendar size={14} className="mr-1" />
                      {new Date(record.createdAt).toLocaleDateString()} at {new Date(record.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ATS Score</p>
                    <p className="font-bold text-lg text-slate-900">{record.resumeScore}/100</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Skills Found</p>
                    <p className="font-bold text-lg text-slate-900">{record.extractedSkills.length}</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Matches</p>
                    <p className="font-bold text-lg text-slate-900">{record.matchedJobs.length}</p>
                  </div>
                  <button className="ml-auto md:ml-4 text-slate-400 hover:text-blue-600 p-2 bg-slate-50 hover:bg-blue-50 rounded-full transition-colors">
                    {expandedId === record._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === record._id && (
                <div className="border-t border-slate-100 p-6 bg-slate-50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Skills section */}
                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                        <CheckCircle size={18} className="mr-2 text-emerald-500" /> Extracted Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {record.extractedSkills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Top Job Matches */}
                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                        <Search size={18} className="mr-2 text-blue-500" /> Top Job Matches
                      </h4>
                      <div className="space-y-3">
                        {record.matchedJobs.slice(0, 3).map((match, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <span className="font-medium text-slate-900">{match.jobId?.title || 'Unknown Job'}</span>
                            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                              {match.matchPercentage}% Match
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
