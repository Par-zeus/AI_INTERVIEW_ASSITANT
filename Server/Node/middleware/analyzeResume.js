const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function analyzeResume(filePath) {
  try {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    const response = await axios.post("http://localhost:5000/analyze", form, {
      headers: form.getHeaders(),
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error calling Flask analyzer:", error.message);
    return {
      error: "Failed to analyze resume via Flask.",
    };
  }
}

module.exports = { analyzeResume };