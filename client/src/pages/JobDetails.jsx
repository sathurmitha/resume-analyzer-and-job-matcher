import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, BookmarkPlus, ExternalLink, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { formatSalary } from '../utils/salary';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleSaveJob = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      await api.post(`/jobs/${id}/save`);
      setSaveMsg('Job saved successfully!');
    } catch (error) {
      setSaveMsg(error.response?.data?.message || 'Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading job details...</div>;
  }

  if (!job) {
    return <div className="p-8 text-center text-red-600">Job not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/jobs" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to jobs
      </Link>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">{job.title}</h1>
            <p className="text-xl text-blue-600 font-semibold">{job.company}</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleSaveJob}
              disabled={saving}
              className="flex items-center justify-center px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-medium transition-colors"
            >
              <BookmarkPlus size={20} className="mr-2" /> {saving ? 'Saving...' : 'Save Job'}
            </button>
            <a 
              href={job.applicationUrl && !job.applicationUrl.includes('example.com') 
                ? job.applicationUrl 
                : `https://www.google.com/search?q=${encodeURIComponent(job.title + ' ' + job.company + ' careers apply')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-medium transition-colors shadow-sm shadow-blue-200"
            >
              Apply Now <ExternalLink size={18} className="ml-2" />
            </a>
          </div>
        </div>

        {saveMsg && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50 text-blue-700 font-medium border border-blue-100">
            {saveMsg}
          </div>
        )}

        <div className="flex flex-wrap gap-6 p-6 bg-slate-50 rounded-2xl mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm text-slate-400">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</p>
              <p className="font-medium text-slate-900">{job.location}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm text-slate-400">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Type</p>
              <p className="font-medium text-slate-900">{job.jobType}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm text-slate-400">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Salary</p>
              <p className="font-medium text-slate-900">{formatSalary(job.salary)}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm text-slate-400">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Experience</p>
              <p className="font-medium text-slate-900">{job.experienceLevel}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Job Description</h3>
            <div className="prose text-slate-600 max-w-none leading-relaxed">
              {job.description}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill, index) => (
                <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
