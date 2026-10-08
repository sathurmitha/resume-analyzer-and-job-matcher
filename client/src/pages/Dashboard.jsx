import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Briefcase, Bookmark, TrendingUp } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    resumeScore: 0,
    skillsFound: 0,
    jobsMatched: 0,
    savedJobs: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentAnalysis, setRecentAnalysis] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [historyRes, savedRes] = await Promise.all([
          api.get('/analysis/history'),
          api.get('/jobs/saved')
        ]);
        
        const history = Array.isArray(historyRes.data) ? historyRes.data : [];
        const savedJobs = Array.isArray(savedRes.data) ? savedRes.data : [];
        
        let score = 0;
        let skillsCount = 0;
        let matchedCount = 0;

        if (history.length > 0 && history[0]) {
          const latest = history[0];
          score = latest.resumeScore || 0;
          skillsCount = Array.isArray(latest.extractedSkills) ? latest.extractedSkills.length : 0;
          matchedCount = Array.isArray(latest.matchedJobs) ? latest.matchedJobs.length : 0;
          setRecentAnalysis(latest);
        }

        setStats({
          resumeScore: score,
          skillsFound: skillsCount,
          jobsMatched: matchedCount,
          savedJobs: savedJobs.length
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><div className="animate-pulse flex flex-col items-center"><div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div><div className="h-4 w-24 bg-slate-200 rounded"></div></div></div>;
  }

  const statCards = [
    { label: 'ATS Resume Score', value: `${stats.resumeScore}/100`, icon: <TrendingUp size={24} className="text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Skills Found', value: stats.skillsFound, icon: <FileText size={24} className="text-teal-600" />, bg: 'bg-teal-50' },
    { label: 'Jobs Matched', value: stats.jobsMatched, icon: <Briefcase size={24} className="text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Saved Jobs', value: stats.savedJobs, icon: <Bookmark size={24} className="text-amber-600" />, bg: 'bg-amber-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1 font-medium">Here is what's happening with your job search today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 flex items-center space-x-4">
            <div className={`w-14 h-14 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Analysis Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <FileText className="mr-2.5 text-emerald-600" size={22} /> Latest Resume Analysis
          </h2>
          
          {recentAnalysis ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Top Extracted Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {recentAnalysis.extractedSkills.slice(0, 10).map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                  {recentAnalysis.extractedSkills.length > 10 && (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                      +{recentAnalysis.extractedSkills.length - 10} more
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Top Job Matches</h3>
                <div className="space-y-3">
                  {recentAnalysis.matchedJobs
                    .filter(match => match && match.jobId)
                    .slice(0, 3)
                    .map((match, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                          <p className="font-semibold text-slate-900">{match.jobId.title || 'Job Listing'}</p>
                          <p className="text-sm text-slate-500">{match.jobId.company || 'Company'}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold ${
                            match.matchPercentage >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                            match.matchPercentage >= 50 ? 'bg-amber-50 text-amber-700 border border-amber-200/60' :
                            'bg-red-50 text-red-700 border border-red-200/60'
                          }`}>
                            {match.matchPercentage}% Match
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              <Link to="/jobs" className="inline-block w-full text-center py-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-colors">
                View All Job Matches
              </Link>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-slate-400" size={30} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No analysis found</h3>
              <p className="text-slate-500 text-sm mb-6">Upload your resume to get insights and job matches.</p>
              <Link to="/resume-analyzer" className="bg-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-emerald-700 transition-colors inline-block shadow-sm">
                Analyze Resume
              </Link>
            </div>
          )}
        </div>

        {/* Recommended Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 border-t-4 border-t-emerald-500">
            <h3 className="font-bold text-slate-900 mb-1">Improve Your Profile</h3>
            <p className="text-sm text-slate-500 mb-4">Add more skills and update your experience to get higher accuracy matches.</p>
            <Link to="/profile" className="text-sm font-bold text-emerald-600 hover:text-emerald-700">Update Profile &rarr;</Link>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-6 rounded-2xl shadow-md text-white">
            <h3 className="font-extrabold text-white mb-1">Looking for a specific role?</h3>
            <p className="text-sm text-emerald-100 mb-4 font-medium">Browse our curated list of engineering opportunities tailored for your skills.</p>
            <Link to="/jobs" className="text-sm font-bold text-slate-900 bg-white hover:bg-emerald-50 px-4 py-2 rounded-xl transition-colors inline-block shadow-xs">Explore Jobs</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
