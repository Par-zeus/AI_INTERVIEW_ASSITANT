import React, { useState } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { 
  PlusCircle, 
  LoaderCircle, 
  Sparkles, 
  Target, 
  Briefcase, 
  Clock,
  ArrowRight
} from 'lucide-react';
import useAuth from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AddNewInterview = ({ role }) => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobPos, setJobPos] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [jobExp, setJobExp] = useState('');
    const [loading, setLoading] = useState(false);
    
    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosPrivate.post('/api/interview/generate-interview', {
                jobPos, 
                jobDesc, 
                jobExp, 
                userId: auth?._id,  
            });

            console.log('Interview generated:', response.data);
            const interviewId = response.data.interview._id;
            navigate(`/interview/${interviewId}`);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error generating interview:', error);
        } finally {
            setLoading(false);
        }
    };

    const fadeIn = (delay = 0) => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { 
            duration: 0.5, 
            delay: delay,
            ease: [0.22, 1, 0.36, 1]
        }
    });

    return (
        <motion.div 
            className="max-w-4xl mx-auto mb-16"
            {...fadeIn(0.2)}
        >
            <motion.div 
                className="bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl border border-indigo-800/40
                         hover:border-indigo-600/70 transition-all duration-300
                         hover:shadow-lg hover:shadow-indigo-600/10 cursor-pointer"
                whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
            >
                <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0 bg-indigo-900/70 p-4 rounded-xl">
                        <PlusCircle className="w-10 h-10 text-indigo-400" />
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-2xl font-semibold text-indigo-100 mb-2">
                            Create New AI Interview
                        </h3>
                        <p className="text-indigo-200/80">
                            Set up a personalized interview session tailored to your target position
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="p-2 bg-indigo-700/50 hover:bg-indigo-600/70 rounded-full transition-all duration-300">
                            <ArrowRight className="w-6 h-6 text-indigo-200" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {isModalOpen && (
                <motion.div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm cursor-pointer" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setIsModalOpen(false);
                    }}
                >
                    <motion.div 
                        className="bg-slate-800 w-[600px] rounded-2xl shadow-2xl border border-indigo-700/50 overflow-hidden cursor-default"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 30 
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-r from-indigo-800 to-indigo-900 p-6">
                            <h3 className="text-2xl font-bold text-white flex items-center">
                                <Sparkles className="mr-3 text-indigo-300" />
                                Interview Setup Wizard
                            </h3>
                        </div>
                        
                        <form onSubmit={onSubmit} className="p-8 space-y-6">
                            <motion.div
                                {...fadeIn(0.1)}
                                className="space-y-6"
                            >
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-indigo-200 flex items-center">
                                        <Briefcase className="w-4 h-4 mr-2 text-indigo-400" />
                                        Job Position
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="e.g., Senior Software Engineer"
                                        required
                                        className="w-full p-4 bg-slate-700/70 border border-indigo-700/50 rounded-xl
                                                text-indigo-100 placeholder-indigo-400/70
                                                focus:ring-4 focus:ring-indigo-600/30 focus:border-indigo-500/70
                                                transition-all duration-300"
                                        value={jobPos}
                                        onChange={(e) => setJobPos(e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-indigo-200 flex items-center">
                                        <Target className="w-4 h-4 mr-2 text-indigo-400" />
                                        Job Description & Tech Stack
                                    </label>
                                    <textarea 
                                        placeholder="e.g., React, Node.js, AWS, GraphQL"
                                        required
                                        rows={4}
                                        className="w-full p-4 bg-slate-700/70 border border-indigo-700/50 rounded-xl
                                                text-indigo-100 placeholder-indigo-400/70
                                                focus:ring-4 focus:ring-indigo-600/30 focus:border-indigo-500/70
                                                transition-all duration-300 resize-none"
                                        value={jobDesc}
                                        onChange={(e) => setJobDesc(e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-indigo-200 flex items-center">
                                        <Clock className="w-4 h-4 mr-2 text-indigo-400" />
                                        Years of Experience
                                    </label>
                                    <input 
                                        type="number"
                                        placeholder="Years of professional experience"
                                        max="50"
                                        required
                                        className="w-full p-4 bg-slate-700/70 border border-indigo-700/50 rounded-xl
                                                text-indigo-100 placeholder-indigo-400/70
                                                focus:ring-4 focus:ring-indigo-600/30 focus:border-indigo-500/70
                                                transition-all duration-300"
                                        value={jobExp}
                                        onChange={(e) => setJobExp(e.target.value)}
                                    />
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                className="flex justify-end space-x-4 pt-4"
                                {...fadeIn(0.4)}
                            >
                                <button 
                                    type="button" 
                                    className="px-6 py-3 text-indigo-300 hover:bg-slate-700/70 
                                              rounded-xl transition-colors cursor-pointer"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit" 
                                    className="px-7 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 
                                              text-white rounded-xl hover:from-indigo-600 hover:to-blue-600
                                              transition-all duration-300 
                                              disabled:opacity-50 disabled:cursor-not-allowed 
                                              flex items-center shadow-md hover:shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <LoaderCircle className="animate-spin mr-2" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            Start Interview
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default AddNewInterview;