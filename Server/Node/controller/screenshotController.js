const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const handleScreenshotUpload = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        console.log(`✅ Received ${req.files.length} images`);

        let emotions = [];

        for (const file of req.files) {
            const filepath = path.join(__dirname, '../uploads/screenshots', file.filename);
            const form = new FormData();
            form.append('image', fs.createReadStream(filepath));

            try {
                const response = await axios.post('http://localhost:5000/predict', form, {
                    headers: form.getHeaders(),
                });

                const emotion = response.data.emotion;
                console.log(`📸 ${file.filename} → 😐 ${emotion}`);
                emotions.push(emotion);
            } catch (err) {
                console.error(`❌ Failed to process ${file.filename}`, err);
            }

            // ✅ Delete file after it's been sent and processed
            fs.unlink(filepath, (err) => {
                if (err) {
                    console.error(`❌ Failed to delete ${file.filename}`, err);
                } else {
                    console.log(`🧹 Deleted ${file.filename}`);
                }
            });
        }

        // Emotion analysis
        const emotionCount = {};
        for (let emo of emotions) {
            emotionCount[emo] = (emotionCount[emo] || 0) + 1;
        }

        const mostCommon = Object.entries(emotionCount).reduce((a, b) => a[1] > b[1] ? a : b)[0];

        let confidence;
        if (mostCommon === 'happy') confidence = 5;
        else if (mostCommon === 'neutral') confidence = 4;
        else if (mostCommon === 'surprise') confidence = 3;
        else if (['angry', 'disgust'].includes(mostCommon)) confidence = 2;
        else confidence = 1;

        res.status(200).json({
            message: 'Emotions processed',
            mostCommonEmotion: mostCommon,
            confidence,
            emotionBreakdown: emotionCount
        });

    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ message: "Processing failed", error });
    }
};

module.exports = {
    handleScreenshotUpload
};
