"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  Button,
  Divider,
  Alert,
} from "@mui/material";

const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen",
];

const SEVERITY_LEVELS = [
  { range: [0, 4], label: "Minimal Anxiety", color: "#4caf50" },
  { range: [5, 9], label: "Mild Anxiety", color: "#ffeb3b" },
  { range: [10, 14], label: "Moderate Anxiety", color: "#ff9800" },
  { range: [15, 21], label: "Severe Anxiety", color: "#f44336" },
];

interface GAD7Response {
  question: string;
  score: number;
}

interface GAD7AssessmentProps {
  onComplete?: (score: number, responses: GAD7Response[]) => void;
  initialResponses?: GAD7Response[];
  readOnly?: boolean;
}

export default function GAD7Assessment({
  onComplete,
  initialResponses,
  readOnly = false,
}: GAD7AssessmentProps) {
  const [responses, setResponses] = useState<GAD7Response[]>(
    initialResponses ||
      GAD7_QUESTIONS.map((question) => ({
        question,
        score: -1,
      }))
  );
  
  const [totalScore, setTotalScore] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [severity, setSeverity] = useState<{
    label: string;
    color: string;
  } | null>(null);

  useEffect(() => {
    // Calculate total score
    const validResponses = responses.filter((r) => r.score >= 0);
    const newTotalScore = validResponses.reduce((sum, r) => sum + r.score, 0);
    setTotalScore(newTotalScore);
    
    // Check if assessment is complete
    setIsComplete(validResponses.length === GAD7_QUESTIONS.length);
    
    // Determine severity level
    if (validResponses.length === GAD7_QUESTIONS.length) {
      const level = SEVERITY_LEVELS.find(
        (level) => 
          newTotalScore >= level.range[0] && 
          newTotalScore <= level.range[1]
      );
      
      if (level) {
        setSeverity({
          label: level.label,
          color: level.color,
        });
      }
    }
  }, [responses]);

  const handleResponseChange = (questionIndex: number, value: number) => {
    if (readOnly) return;
    
    const newResponses = [...responses];
    newResponses[questionIndex].score = value;
    setResponses(newResponses);
  };

  const handleSubmit = () => {
    if (onComplete && isComplete) {
      onComplete(totalScore, responses);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        GAD-7 Anxiety Assessment
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Over the last 2 weeks, how often have you been bothered by the following problems?
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", mb: 2 }}>
          <Typography variant="body2" sx={{ flex: 1 }}></Typography>
          <Typography variant="body2" sx={{ width: 80, textAlign: "center" }}>Not at all</Typography>
          <Typography variant="body2" sx={{ width: 80, textAlign: "center" }}>Several days</Typography>
          <Typography variant="body2" sx={{ width: 80, textAlign: "center" }}>More than half the days</Typography>
          <Typography variant="body2" sx={{ width: 80, textAlign: "center" }}>Nearly every day</Typography>
        </Box>
        
        {responses.map((response, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" sx={{ flex: 1 }}>
                {index + 1}. {response.question}
              </Typography>
              
              <RadioGroup
                row
                value={response.score}
                onChange={(e) => handleResponseChange(index, parseInt(e.target.value))}
                sx={{ display: "flex", justifyContent: "space-between", width: 320 }}
              >
                <FormControlLabel
                  value={0}
                  control={<Radio size="small" disabled={readOnly} />}
                  label=""
                  sx={{ mx: 0, width: 80, justifyContent: "center" }}
                />
                <FormControlLabel
                  value={1}
                  control={<Radio size="small" disabled={readOnly} />}
                  label=""
                  sx={{ mx: 0, width: 80, justifyContent: "center" }}
                />
                <FormControlLabel
                  value={2}
                  control={<Radio size="small" disabled={readOnly} />}
                  label=""
                  sx={{ mx: 0, width: 80, justifyContent: "center" }}
                />
                <FormControlLabel
                  value={3}
                  control={<Radio size="small" disabled={readOnly} />}
                  label=""
                  sx={{ mx: 0, width: 80, justifyContent: "center" }}
                />
              </RadioGroup>
            </Box>
            <Divider sx={{ mt: 1 }} />
          </Box>
        ))}
      </Box>
      
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
        <Box>
          <Typography variant="subtitle1">
            Total Score: {isComplete ? totalScore : "Incomplete"}
          </Typography>
          
          {severity && (
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: severity.color,
                fontWeight: "bold",
                mt: 1
              }}
            >
              Severity: {severity.label}
            </Typography>
          )}
        </Box>
        
        {!readOnly && (
          <Button 
            variant="contained" 
            disabled={!isComplete}
            onClick={handleSubmit}
          >
            Save Assessment
          </Button>
        )}
      </Box>
      
      {isComplete && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Score Interpretation:</strong><br />
            0-4: Minimal anxiety<br />
            5-9: Mild anxiety<br />
            10-14: Moderate anxiety<br />
            15-21: Severe anxiety
          </Typography>
        </Alert>
      )}
    </Paper>
  );
}
