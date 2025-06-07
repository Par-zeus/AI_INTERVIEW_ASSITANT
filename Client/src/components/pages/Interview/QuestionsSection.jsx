import React from 'react';
import { Lightbulb, Volume2, Info, MessageCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const QuestionsSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            const speech = new SpeechSynthesisUtterance(text);
            speech.rate = 0.9; // Slightly slower for better clarity
            window.speechSynthesis.speak(speech);
            
            toast.info(
                <div className="flex items-center gap-2">
                    <Volume2 className="text-blue-500 w-4 h-4" />
                    <span>Reading question aloud</span>
                </div>, 
                {
                    position: "bottom-left",
                    autoClose: 2000,
                    hideProgressBar: true,
                }
            );
        } else {
            toast.error('Sorry, your browser does not support text to speech');
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.5,
                staggerChildren: 0.1 
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        mockInterviewQuestion && (
            <motion.div 
                className="bg-slate-800/60 shadow-xl rounded-2xl p-6 border border-slate-700/50 backdrop-blur-md overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="relative">
                    {/* Question Indicator */}
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
                        variants={containerVariants}
                    >
                        {mockInterviewQuestion.map((question, index) => (
                            <motion.div 
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                    rounded-xl px-3 py-2 text-center text-xs md:text-sm 
                                    transition-all duration-300 ease-in-out cursor-pointer
                                    ${activeQuestionIndex === index 
                                        ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-blue-500/20' 
                                        : 'bg-slate-700/50 text-indigo-200 hover:bg-slate-600/50 hover:text-indigo-100'
                                    }
                                `}
                            >
                                Q{index + 1}
                            </motion.div>
                        ))}
                    </motion.div>
                    
                    {/* Question Box */}
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gradient-to-br from-slate-800/80 to-indigo-900/30 rounded-xl p-5 mb-6 shadow-inner border border-indigo-800/30 space-y-4"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium shadow-md shadow-blue-500/20">
                                        {activeQuestionIndex + 1}
                                    </div>
                                    <h2 className="text-indigo-300 text-sm font-medium">Question</h2>
                                </div>
                                <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Volume2
                                        className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer w-6 h-6"
                                        onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
                                    />
                                </motion.div>
                            </div>
                            
                            <motion.div
                                className="relative"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                            >
                                <div className="absolute -left-1 top-0 w-1 h-full bg-indigo-500 rounded-full"></div>
                                <h2 className="text-md md:text-lg text-indigo-100 font-medium leading-relaxed pl-3">
                                    {mockInterviewQuestion[activeQuestionIndex]?.question}
                                </h2>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                    
                    {/* Information Box */}
                    <motion.div 
                        className='border-l-4 border-blue-500 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 p-4 rounded-r-lg backdrop-blur-sm'
                        variants={itemVariants}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className='flex items-center gap-3 mb-2'>
                            <Info className="text-blue-400" />
                            <strong className="text-blue-300">How it works</strong>
                        </div>
                        <p className='text-sm text-indigo-200/80 leading-relaxed'>
                            Click on "Record Answer" when you're ready to respond. After the interview, 
                            you'll receive detailed feedback on your answers, along with suggestions 
                            for improvement.
                        </p>
                    </motion.div>
                </div>
                
                {/* Bottom Tips */}
                <motion.div 
                    className="mt-6 pt-4 border-t border-slate-700/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-start gap-3">
                        <div className="bg-amber-500/20 p-2 rounded-lg">
                            <Lightbulb className="text-amber-400 w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-indigo-200">Pro Tip</h3>
                            <p className="text-xs text-indigo-300/70 mt-1">
                                Structure your answers using the STAR method: <span className="text-indigo-300">Situation, Task, Action, Result</span>. This helps 
                                interviewers clearly understand your experiences and abilities.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )
    );
};

export default QuestionsSection;