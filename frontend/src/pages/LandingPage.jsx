import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-slate-950/50 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-slate-950">
                                LN
                            </div>
                            <span className="text-xl font-bold tracking-tight">Launch<span className="text-amber-500">Nepal</span></span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-sm font-medium hover:text-amber-500 transition-colors">Features</a>
                            <a href="#how-it-works" className="text-sm font-medium hover:text-amber-500 transition-colors">Methodology</a>
                            <Link to="/login" className="text-sm font-medium hover:text-amber-500 transition-colors">Login</Link>
                            <Link to="/register" className="premium-button btn-primary px-6 py-2 text-sm">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider mb-6 inline-block">
                                AI-Powered Ecosystem
                            </span>
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                                Connecting the <span className="gradient-text">Next Generation</span> <br />
                                of Nepali Innovation
                            </h1>
                            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                                LaunchNepal uses advanced hybrid matching to bridge the gap between visionary founders, top-tier talent, and strategic investors.
                            </p>
                            <div className="flex justify-center">
                                <Link to="/login" className="premium-button btn-primary px-10 py-4 text-lg">
                                    Join Us
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* AI Matching Showcase */}
            <section id="how-it-works" className="py-24 bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                The <span className="text-amber-500">Hybrid Intelligence</span> <br />
                                Behind Every Match
                            </h2>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                Our platform doesn't just search for keywords. We use semantic embeddings to understand the deep meaning behind bios, job roles, and investment theses.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 shrink-0 glass-card flex items-center justify-center border-amber-500/30">
                                        <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Keyword Precision (60%)</h4>
                                        <p className="text-sm text-slate-500">Direct mapping of technical skills and industries.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 shrink-0 glass-card flex items-center justify-center border-blue-500/30">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Semantic AI (40%)</h4>
                                        <p className="text-sm text-slate-500">Vector-based understanding of mission and potential.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="glass-card p-8 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="space-y-4">
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center">
                                        <span className="text-sm">Founder: "AI for Agriculture"</span>
                                        <span className="text-xs text-amber-500">Embedding vector stored</span>
                                    </div>
                                    <div className="flex justify-center py-4">
                                        <div className="w-0.5 h-12 bg-gradient-to-b from-amber-500 to-blue-500" />
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center">
                                        <span className="text-sm">Talent: "ML Engineer in Nepal"</span>
                                        <span className="text-xs text-blue-500 font-bold">94% Match Found</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Role Cards */}
            <section id="features" className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold">Built for the Entire Ecosystem</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Founders */}
                        <div className="glass-card p-8 hover:border-amber-500/30 transition-all duration-500">
                            <h3 className="text-xl font-bold mb-4">For Founders</h3>
                            <p className="text-slate-400 text-sm mb-6">Build your dream team and secure capital with AI-powered discovery that understands your vision.</p>
                            <ul className="space-y-3 mb-8 text-sm">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Automated matching</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Investor tracking</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Profile analytics</li>
                            </ul>
                        </div>

                        {/* Talent */}
                        <div className="glass-card p-8 hover:border-blue-500/30 transition-all duration-500">
                            <h3 className="text-xl font-bold mb-4">For Talent</h3>
                            <p className="text-slate-400 text-sm mb-6">Skip the resume black hole. Get matched directly with startups that value your specific skill set.</p>
                            <ul className="space-y-3 mb-8 text-sm">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Direct-to-Founder access</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Equity opportunities</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Skills verification</li>
                            </ul>
                        </div>

                        {/* Investors */}
                        <div className="glass-card p-8 hover:border-purple-500/30 transition-all duration-500">
                            <h3 className="text-xl font-bold mb-4">For Investors</h3>
                            <p className="text-slate-400 text-sm mb-6">Source high-potential startups using quantitative metrics and qualitative thesis matching.</p>
                            <ul className="space-y-3 mb-8 text-sm">
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Thesis-based matching</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Deal flow management</li>
                                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Sector insights</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
                    <p>© 2026 LaunchNepal. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
