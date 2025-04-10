const { spawnSync } = require("child_process");
const path = require("path");

function analyzeResume(filePath) {
  const scriptPath = path.join(__dirname, "resumeAnalyzer.py"); // Ensure correct path

  console.log("Running Python script:", scriptPath, "with file:", filePath);

  const pythonProcess = spawnSync("python", [scriptPath, filePath], { encoding: "utf8" });

  // Log Python process errors
  if (pythonProcess.error) {
    console.error("Error executing Python script:", pythonProcess.error);
    throw new Error("Failed to run resume analysis script.");
  }

  // Log stderr output from Python
  if (pythonProcess.stderr) {
    console.error("Python stderr:", pythonProcess.stderr);
  }

  // Log raw stdout output from Python
  console.log("Raw Python Output:", pythonProcess.stdout);

  if (!pythonProcess.stdout) {
    throw new Error("No output received from Python script.");
  }

  try {
    const output = JSON.parse(pythonProcess.stdout.trim());
    // console.log(output);
    return {
      suggestedRole: output.suggestedRoles,
      resumeScore: output.resumeScore,
      improvements: output.improvements,
    };
  } catch (error) {
    console.error("Error parsing Python output:", pythonProcess.stdout);
    throw new Error("Invalid JSON output from resume analysis.");
  }
}

module.exports = { analyzeResume };
