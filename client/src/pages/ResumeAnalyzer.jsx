import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, uploading, analyzing, success, error
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setErrorMsg('');
    if (selectedFile.type !== 'application/pdf') {
      setErrorMsg('Please upload a PDF file.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMsg('File size must be less than 5MB.');
      return;
    }
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    
    const formData = new FormData();
    formData.append('resume', file);

    try {
      // 1. Upload & Parse
      const uploadRes = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const resumeId = uploadRes.data._id;
      
      setStatus('analyzing');
      
      // 2. Analyze against jobs
      await api.post(`/analysis/${resumeId}`);
      
      setStatus('success');
      
      // Redirect to history/results after brief success message
      setTimeout(() => {
        navigate('/history');
      }, 1500);

    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMsg(error.response?.data?.message || 'Something went wrong during analysis.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analyze Your Resume</h1>
        <p className="text-slate-500 mt-1 font-medium">Upload your PDF resume to extract skills, discover ATS gaps, and auto-match with target job openings.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80">
        <div 
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
            isDragging 
              ? 'border-blue-500 bg-blue-50/70 shadow-md scale-[1.005]' 
              : 'border-slate-300/80 hover:border-blue-400 hover:bg-slate-50/60'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {status === 'idle' || status === 'error' ? (
            <>
              <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-blue-500/20">
                <UploadCloud size={38} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Drag & Drop your resume PDF here</h3>
              <p className="text-slate-500 mb-6 text-sm font-medium">Supports single PDF document, up to 5MB file size</p>
              
              <input 
                type="file" 
                id="resume-upload" 
                className="hidden" 
                accept="application/pdf"
                onChange={handleFileChange}
              />
              <label 
                htmlFor="resume-upload"
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-xl shadow-xs cursor-pointer inline-block transition-all hover:shadow-md"
              >
                Browse Resume File
              </label>
            </>
          ) : status === 'success' ? (
            <div className="py-8">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xs">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Analysis Complete!</h3>
              <p className="text-slate-500 font-medium">Redirecting you to match results & score history...</p>
            </div>
          ) : (
            <div className="py-12">
              <Loader2 size={48} className="animate-spin text-blue-600 mx-auto mb-6" />
              <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                {status === 'uploading' ? 'Uploading Resume...' : 'Extracting Skills & Matching Jobs...'}
              </h3>
              <p className="text-slate-500 font-medium">Our NLP text-parsing engine is processing your resume metadata.</p>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="mt-6 bg-red-50 text-red-700 p-4 rounded-xl flex items-start border border-red-200/80 shadow-2xs">
            <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <p className="font-semibold text-sm">{errorMsg}</p>
          </div>
        )}

        {file && status === 'idle' && (
          <div className="mt-8 bg-slate-50/80 p-6 rounded-2xl border border-slate-200/80">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Selected Document
            </h4>
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center flex-shrink-0 border border-red-100">
                  <span className="text-xs font-black">PDF</span>
                </div>
                <div className="truncate">
                  <p className="font-semibold text-slate-900 truncate text-sm">{file.name}</p>
                  <p className="text-xs font-medium text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="text-slate-400 hover:text-red-500 p-2 font-bold transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpload}
                className="bg-blue-600 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all hover:scale-[1.01]"
              >
                Run ATS Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
