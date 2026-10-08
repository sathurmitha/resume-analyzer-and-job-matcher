import React, { useState, useEffect, useContext } from 'react';
import { User, Mail, Award, Book, Save, Loader2, Plus, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: [],
    certifications: []
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        skills: user.skills || [],
        certifications: user.certifications || []
      });
    }
  }, [user]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    
    try {
      const res = await api.put('/profile', formData);
      setUser(res.data);
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Your Profile</h1>
        <p className="text-slate-500 mt-2">Manage your personal information and skill set.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        {msg.text && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center ${
            msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100 flex items-center">
              <User className="mr-2 text-blue-600" /> Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100 flex items-center">
              <Award className="mr-2 text-blue-600" /> Skills
            </h3>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-sm font-medium">
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 hover:bg-blue-200 rounded-full p-0.5 transition-colors">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                placeholder="Add a new skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(e)}
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none text-sm"
              />
              <button 
                type="button" 
                onClick={handleAddSkill}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Save className="mr-2" size={20} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
