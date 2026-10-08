import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Briefcase, DollarSign, Trash2, ExternalLink } from 'lucide-react';
import api from '../services/api';
import { formatSalary } from '../utils/salary';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await api.get('/jobs/saved');
        setSavedJobs(res.data);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await api.delete(`/jobs/${jobId}/save`);
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error('Failed to unsave job:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Saved Jobs</h1>
        <p className="text-slate-500 mt-2">Manage all the opportunities you've bookmarked.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-white rounded-2xl border border-slate-100 animate-pulse"></div>
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">No saved jobs yet</h3>
          <p className="text-slate-500 mb-6">Explore the jobs board to find and bookmark opportunities.</p>
          <Link to="/jobs" className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map(job => (
            <div key={job._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all overflow-hidden flex flex-col group">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {job.title}
                  </h3>
                  <button 
                    onClick={() => handleUnsave(job._id)}
                    className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-2 rounded-full transition-colors flex-shrink-0"
                    title="Remove saved job"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="font-medium text-blue-600 mb-4">{job.company}</p>
                
                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-slate-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <Briefcase size={16} className="mr-2 text-slate-400" />
                    {job.jobType}
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-2 text-slate-400" />
                    {formatSalary(job.salary)}
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
                <Link to={`/jobs/${job._id}`} className="text-sm font-semibold text-slate-700 hover:text-blue-600">
                  View Details
                </Link>
                <a 
                  href={job.applicationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  Apply <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
