import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Briefcase, Zap, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10">
        <div className="text-2xl font-black text-blue-600 tracking-tighter">
          ResumeAI
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Login</Link>
          <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-24 pb-32 text-center relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Turn Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Resume</span><br />
          Into Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Opportunity</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
          Analyze your resume with advanced NLP, discover your hidden strengths, identify crucial skill gaps, and match instantly with top job openings.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/register" className="bg-blue-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
            Analyze My Resume <Zap className="ml-2 w-5 h-5" />
          </Link>
          <Link to="/login" className="bg-white text-slate-800 border border-slate-200 px-8 py-4 rounded-full text-base font-semibold hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center">
            Explore Jobs <Briefcase className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-24 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Everything you need to optimize your application and land your dream job.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: 'AI Skill Extraction', desc: 'Automatically identify and categorize your technical and soft skills from your PDF.', icon: <FileText className="w-6 h-6 text-blue-600" /> },
              { title: 'Smart Job Matching', desc: 'Compare your extracted profile against real job descriptions to find your perfect fit.', icon: <Zap className="w-6 h-6 text-purple-600" /> },
              { title: 'Skill Gap Analysis', desc: 'Discover exactly which required skills you are missing for specific roles.', icon: <CheckCircle className="w-6 h-6 text-emerald-600" /> }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm">
        <div className="container mx-auto px-6">
          <div className="text-xl font-black text-white mb-6 tracking-tighter">ResumeAI</div>
          <p className="mb-6">Built for the future of recruitment.</p>
          <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
