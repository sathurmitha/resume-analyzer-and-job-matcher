import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, DollarSign, Filter, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { formatSalary } from '../utils/salary';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs/matches');
        setJobs(res.data.jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="md:flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Jobs</h1>
          <p className="text-slate-500 mt-1 font-medium">Find top engineering and technology opportunities tailored to your skills.</p>
        </div>
        <div className="mt-4 md:mt-0 text-sm font-semibold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200/60 shadow-2xs">
          Showing <span className="text-blue-600">{filteredJobs.length}</span> available roles
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search by job title, company, or skills (e.g., React, Python)..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50/80 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium text-slate-800 placeholder-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors">
          <Filter size={18} className="mr-2" /> Filters
        </button>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white p-6 rounded-2xl border border-slate-100 flex justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-6 w-1/3 bg-slate-200 rounded"></div>
                <div className="h-4 w-1/4 bg-slate-100 rounded"></div>
                <div className="flex space-x-2 mt-4">
                  <div className="h-8 w-20 bg-slate-100 rounded-full"></div>
                  <div className="h-8 w-20 bg-slate-100 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">No matching jobs found</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your search terms or search for general skills like JavaScript or Java.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map(job => (
            <Link 
              key={job._id} 
              to={`/jobs/${job._id}`}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 group flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <p className="text-slate-600 font-semibold mt-0.5">{job.company}</p>
                  </div>
                  {typeof job.matchPercentage === 'number' && (
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-xs ${
                      job.matchPercentage >= 70 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                      job.matchPercentage >= 40 ? 'bg-amber-50 text-amber-700 border border-amber-200/60' :
                      'bg-slate-100 text-slate-600 border border-slate-200/60'
                    }`}>
                      {job.matchPercentage}% match
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center text-sm font-medium text-slate-500 gap-y-2 gap-x-6 mt-4">
                  <span className="flex items-center"><MapPin size={16} className="mr-1.5 text-slate-400" /> {job.location}</span>
                  <span className="flex items-center"><Briefcase size={16} className="mr-1.5 text-slate-400" /> {job.jobType}</span>
                  <span className="flex items-center"><DollarSign size={16} className="mr-1.5 text-slate-400" /> {formatSalary(job.salary)}</span>
                  <span className="capitalize px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">{job.source || 'internal'}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {job.requiredSkills.slice(0, 5).map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-200/80 text-slate-700 rounded-lg text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 5 && (
                    <span className="px-3 py-1 text-slate-500 text-xs font-semibold bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      +{job.requiredSkills.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              <div className="md:border-l md:border-slate-100 md:pl-6 flex items-center justify-between md:flex-col md:items-end gap-4 shrink-0">
                <div className="hidden md:flex w-10 h-10 bg-slate-50 rounded-xl items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                  <ChevronRight size={20} />
                </div>
                <span className="text-xs font-medium text-slate-400">Posted {new Date(job.postedDate).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
