import React, { useEffect, useState } from 'react';

// Enhanced transcript analysis function
const evaluateTranscript = async (responses) => {
  const fillerWords = ['um', 'uh', 'like', 'you know', 'kind of', 'uhh'];
  
  const metrics = { 
    speakingSkills: 0, 
    confidence: 0, 
    fluency: 0, 
    correctness: 0 
  };

  const feedback = [];

  const calculateCorrectnessScore = (question, answer) => {
    // If no specific keywords are defined, use a more generalized approach
    if (!question || !answer) return 5; // Default neutral score

    // Convert both question and answer to lowercase for case-insensitive matching
    const questionLower = question.toLowerCase();
    const answerLower = answer.toLowerCase();

    // Extract key nouns and important words from the question
    const extractKeywords = (text) => {
      // Remove common stop words and split into words
      const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'
      ]);
      
      return text
        .replace(/[?.,]/g, '') // Remove punctuation
        .toLowerCase()
        .split(/\s+/)
        .filter(word => 
          word.length > 2 && !stopWords.has(word)
        );
    };

    const questionKeywords = extractKeywords(questionLower);
    
    // Calculate keyword match
    const matchedKeywords = questionKeywords.filter(keyword => 
      answerLower.includes(keyword)
    );

    // Calculate score based on keyword coverage
    const keywordCoverage = questionKeywords.length > 0 
      ? matchedKeywords.length / questionKeywords.length 
      : 0;
    
    // Additional checks for answer quality
    const answerLength = answer.split(/\s+/).length;
    const lengthBonus = Math.min(1, answerLength / 30); // Bonus for more comprehensive answers

    // Combine keyword coverage with length bonus
    const score = Math.min(10, (keywordCoverage * 8 + lengthBonus * 2) * 10);

    return score;
  };

  const calculateComplexityScore = (text) => {
    // Analyze text complexity based on word variety and sentence structure
    const uniqueWords = new Set(text.toLowerCase().match(/\b\w+\b/g) || []);
    const sentenceCount = text.split(/[.!?]+/).length;
    return Math.min(5, uniqueWords.size / 50 + sentenceCount / 10);
  };

  const calculateConfidenceScore = (text, fillerWords) => {
    const textLower = text.toLowerCase();
    const fillerCount = fillerWords.reduce((count, word) => {
      const matches = textLower.match(new RegExp(`\\b${word}\\b`, 'g')) || [];
      return count + matches.length;
    }, 0);

    const totalWords = text.split(/\s+/).length;
    const fillerRatio = totalWords > 0 ? fillerCount / totalWords : 0;
    
    return Math.max(0, 10 - (fillerRatio * 100));
  };

  const calculateFluencyScore = (text) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const avgSentenceLength = sentences.length > 0 
      ? sentences.reduce((sum, sentence) => 
          sum + sentence.split(/\s+/).length, 0) / sentences.length 
      : 0;
    
    return Math.min(10, avgSentenceLength / 10 * 10);
  };

  const analyzeResponse = (response) => {
    const { question, answer } = response;

    // Speaking Skills Analysis (based on grammar and vocabulary)
    const wordsCount = answer.split(/\s+/).length;
    const complexityScore = calculateComplexityScore(answer);
    const speakingSkillsScore = Math.min(10, complexityScore * 2);

    // Confidence Analysis
    const confidenceScore = calculateConfidenceScore(answer, fillerWords);

    // Fluency Analysis
    const fluencyScore = calculateFluencyScore(answer);

    // Correctness Analysis
    const correctnessScore = calculateCorrectnessScore(question, answer);

    // Generate Feedback
    const responseFeedback = generateFeedback(
      speakingSkillsScore, 
      confidenceScore, 
      fluencyScore, 
      correctnessScore
    );

    return {
      speakingSkillsScore,
      confidenceScore, 
      fluencyScore,
      correctnessScore,
      responseFeedback
    };
  };

  const generateFeedback = (
    speakingSkillsScore, 
    confidenceScore, 
    fluencyScore, 
    correctnessScore
  ) => {
    const feedback = [];

    if (speakingSkillsScore < 7) {
      feedback.push("Work on expanding vocabulary and using more varied sentence structures.");
    }

    if (confidenceScore < 7) {
      feedback.push("Reduce filler words to improve perceived confidence.");
    }

    if (fluencyScore < 7) {
      feedback.push("Practice creating more concise and coherent responses.");
    }

    if (correctnessScore < 7) {
      feedback.push("Ensure responses include key details and demonstrate a clear understanding of the question.");
    }

    return feedback;
  };

  const calculateAverageMetric = (results, metricKey) => {
    const total = results.reduce((sum, result) => sum + result[metricKey], 0);
    return total / results.length;
  };

  const calculateOverallScore = (metrics) => {
    const { speakingSkills, confidence, fluency, correctness } = metrics;
    return Math.round((speakingSkills + confidence + fluency + correctness) / 4 * 10);
  };

  // Analyze each response
  const results = responses.map(analyzeResponse);

  // Aggregate metrics
  metrics.speakingSkills = calculateAverageMetric(results, 'speakingSkillsScore');
  metrics.confidence = calculateAverageMetric(results, 'confidenceScore');
  metrics.fluency = calculateAverageMetric(results, 'fluencyScore');
  metrics.correctness = calculateAverageMetric(results, 'correctnessScore');

  // Collect feedback
  results.forEach(result => 
    feedback.push(...result.responseFeedback)
  );

  // Calculate overall score
  const overallScore = calculateOverallScore(metrics);

  return { 
    overallScore, 
    metrics, 
    feedback 
  };
};

export default evaluateTranscript;