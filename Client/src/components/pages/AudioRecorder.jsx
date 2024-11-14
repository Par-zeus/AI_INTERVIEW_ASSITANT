// src/components/AudioRecorder.jsx
import { useState } from 'react';

const AudioRecorder = ({ onRecordComplete }) => {
    const [isRecording, setIsRecording] = useState(false);

    const handleRecord = () => {
        // Implement recording logic here
        setIsRecording(true);
        // Simulate recording with a timeout
        setTimeout(() => {
            setIsRecording(false);
            onRecordComplete("Recorded audio data...");
        }, 3000); // Simulate 3 seconds of recording
    };

    return (
        <div>
            <button 
                onClick={handleRecord} 
                className={`mt-4 w-full ${isRecording ? 'bg-red-500' : 'bg-teal-500'} text-white py-2 rounded-lg`}>
                {isRecording ? 'Recording...' : 'Start Recording'}
            </button>
        </div>
    );
};

export default AudioRecorder;
