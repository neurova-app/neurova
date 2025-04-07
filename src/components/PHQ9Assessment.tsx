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

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way"
];

const SEVERITY_LEVELS = [
  { range: [0, 4], label: "Minimal Depression", color: "#4caf50" },
  { range: [5, 9], label: "Mild Depression", color: "#ffeb3b" },
  { range: [10, 14], label: "Moderate Depression", color: "#ff9800" },
  { range: [15, 19], label: "Moderately Severe Depression", color: "#f57c00" },
  { range: [20, 27], label: "Severe Depression", color: "#f44336" },
];

interface PHQ9Response {
  question: string;
  score: number;
}

interface PHQ9AssessmentProps {
  onComplete?: (score: number, responses: PHQ9Response[]) => void;
  initialResponses?: PHQ9Response[];
  readOnly?: boolean;
}

export default function PHQ9Assessment({
  onComplete,
  initialResponses,
  readOnly = false,
}: PHQ9AssessmentProps) {
  const [responses, setResponses] = useState<PHQ9Response[]>(
    initialResponses ||
      PHQ9_QUESTIONS.map((question) => ({
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
    setIsComplete(validResponses.length === PHQ9_QUESTIONS.length);
    
    // Determine severity level
    if (validResponses.length === PHQ9_QUESTIONS.length) {
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
        PHQ-9 Depression Assessment
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
            0-4: Minimal depression<br />
            5-9: Mild depression<br />
            10-14: Moderate depression<br />
            15-19: Moderately severe depression<br />
            20-27: Severe depression
          </Typography>
        </Alert>
      )}
    </Paper>
  );
}
