// src/components/ResultsDisplay.jsx
const ResultsDisplay = ({ scores }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 max-w-4xl">
            {Object.entries(scores).map(([parameter, score]) => (
                <AnalysisScore key={parameter} parameter={parameter} score={score} />
            ))}
        </div>
    );
};

const AnalysisScore = ({ parameter, score }) => (
    <div className="p-4 shadow-lg rounded-lg border border-gray-200 text-center">
        <p className="font-semibold text-gray-700">{parameter}</p>
        <p className="text-teal-600 text-xl">{score}</p>
    </div>
);

export default ResultsDisplay;
