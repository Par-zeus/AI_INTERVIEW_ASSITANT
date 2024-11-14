import React, { useState } from 'react';

const InterviewScheduler = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Interview Scheduled on ${date} at ${time}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Time
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-200"
      >
        Schedule Interview
      </button>
    </form>
  );
};

export default InterviewScheduler;
