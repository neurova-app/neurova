"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  LinearProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Paper,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import MoodIcon from "@mui/icons-material/Mood";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ClientRichTextEditor from "@/components/ClientRichTextEditor";
import GAD7Assessment from "@/components/GAD7Assessment";
import PHQ9Assessment from "@/components/PHQ9Assessment";
import { OutputData } from "@editorjs/editorjs";

// Mock data for the treatment plan
const mockTreatmentPlan = {
  id: "tp-1",
  title: "Anxiety Management Plan",
  description: "Comprehensive treatment plan for generalized anxiety disorder",
  startDate: "2025-03-15",
  targetEndDate: "2025-09-15",
  status: "active",
  progress: 35,
  goals: [
    {
      id: "goal-1",
      title: "Reduce anxiety symptoms",
      description: "Decrease overall anxiety levels as measured by GAD-7",
      measurementCriteria: "Reduce GAD-7 score from 15 to below 7",
      targetDate: "2025-06-15",
      status: "in_progress",
      progress: 40,
      interventions: [
        {
          id: "int-1",
          title: "Cognitive Behavioral Therapy",
          description: "Weekly CBT sessions focusing on thought restructuring",
          frequency: "Weekly",
          duration: "50 minutes",
          completed: 4,
          total: 12,
        },
        {
          id: "int-2",
          title: "Mindfulness Practice",
          description: "Daily mindfulness meditation exercises",
          frequency: "Daily",
          duration: "15 minutes",
          completed: 18,
          total: 60,
        },
      ],
    },
    {
      id: "goal-2",
      title: "Improve sleep quality",
      description:
        "Establish consistent sleep schedule and improve sleep quality",
      measurementCriteria:
        "Increase average sleep duration to 7-8 hours with fewer than 2 awakenings",
      targetDate: "2025-05-30",
      status: "in_progress",
      progress: 60,
      interventions: [
        {
          id: "int-3",
          title: "Sleep Hygiene Protocol",
          description: "Implementation of sleep hygiene practices",
          frequency: "Daily",
          duration: "N/A",
          completed: 15,
          total: 30,
        },
      ],
    },
  ],
};

// Mock data for previous session notes
const mockPreviousNotes = [
  {
    id: "note-1",
    title: "Initial Assessment",
    date: "2025-03-15",
    content: {
      time: 1711929600000,
      blocks: [
        {
          type: "header",
          data: {
            text: "Initial Assessment Session",
            level: 2,
          },
        },
        {
          type: "paragraph",
          data: {
            text: "Patient presents with symptoms of generalized anxiety disorder. GAD-7 score: 15 (severe). Discussed treatment options and developed initial treatment plan.",
          },
        },
      ],
    },
    relatedGoals: ["goal-1"],
    assessments: [
      {
        type: "GAD-7",
        score: 15,
        date: "2025-03-15",
        responses: [
          { question: "Feeling nervous, anxious, or on edge", score: 3 },
          { question: "Not being able to stop or control worrying", score: 2 },
          { question: "Worrying too much about different things", score: 3 },
          { question: "Trouble relaxing", score: 2 },
          {
            question: "Being so restless that it's hard to sit still",
            score: 1,
          },
          { question: "Becoming easily annoyed or irritable", score: 2 },
          {
            question: "Feeling afraid, as if something awful might happen",
            score: 2,
          },
        ],
      },
    ],
  },
  {
    id: "note-2",
    title: "Therapy Session",
    date: "2025-03-22",
    content: {
      time: 1711238400000,
      blocks: [
        {
          type: "header",
          data: {
            text: "Follow-up Session",
            level: 2,
          },
        },
        {
          type: "paragraph",
          data: {
            text: "Introduced breathing techniques and cognitive restructuring. Patient reports high stress at work. Assigned homework to practice mindfulness daily.",
          },
        },
      ],
    },
    relatedGoals: ["goal-1", "goal-2"],
    assessments: [
      {
        type: "GAD-7",
        score: 14,
        date: "2025-03-22",
        responses: [
          { question: "Feeling nervous, anxious, or on edge", score: 3 },
          { question: "Not being able to stop or control worrying", score: 2 },
          { question: "Worrying too much about different things", score: 2 },
          { question: "Trouble relaxing", score: 2 },
          {
            question: "Being so restless that it's hard to sit still",
            score: 1,
          },
          { question: "Becoming easily annoyed or irritable", score: 2 },
          {
            question: "Feeling afraid, as if something awful might happen",
            score: 2,
          },
        ],
      },
    ],
  },
  {
    id: "note-3",
    title: "Therapy Session",
    date: "2025-03-29",
    content: {
      time: 1711843200000,
      blocks: [
        {
          type: "header",
          data: {
            text: "Progress Session",
            level: 2,
          },
        },
        {
          type: "paragraph",
          data: {
            text: "Patient reports using mindfulness techniques with some success. Sleep has improved slightly. Continued work on cognitive distortions.",
          },
        },
      ],
    },
    relatedGoals: ["goal-1", "goal-2"],
    assessments: [
      {
        type: "GAD-7",
        score: 12,
        date: "2025-03-29",
        responses: [
          { question: "Feeling nervous, anxious, or on edge", score: 2 },
          { question: "Not being able to stop or control worrying", score: 2 },
          { question: "Worrying too much about different things", score: 2 },
          { question: "Trouble relaxing", score: 2 },
          {
            question: "Being so restless that it's hard to sit still",
            score: 1,
          },
          { question: "Becoming easily annoyed or irritable", score: 2 },
          {
            question: "Feeling afraid, as if something awful might happen",
            score: 1,
          },
        ],
      },
    ],
  },
];

export default function SessionWithTreatmentPlan() {
  const [editorContent, setEditorContent] = useState<OutputData | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [progressNotes, setProgressNotes] = useState<Record<string, string>>(
    {}
  );

  // Assessment states
  const [openGAD7Dialog, setOpenGAD7Dialog] = useState(false);
  const [openPHQ9Dialog, setOpenPHQ9Dialog] = useState(false);
  const [gad7Score, setGad7Score] = useState<number | null>(null);
  const [phq9Score, setPhq9Score] = useState<number | null>(null);
  const [gad7Completed, setGad7Completed] = useState(false);
  const [phq9Completed, setPhq9Completed] = useState(false);

  useEffect(() => {
    // Initialize editor with empty content
    setEditorContent({
      time: Date.now(),
      blocks: [
        {
          type: "header",
          data: {
            text: "Session Notes",
            level: 2,
          },
        },
        {
          type: "paragraph",
          data: {
            text: "",
          },
        },
      ],
    });
  }, []);

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleEditorChange = (content: OutputData) => {
    setEditorContent(content);
  };

  const handleProgressNoteChange = (goalId: string, note: string) => {
    setProgressNotes((prev) => ({
      ...prev,
      [goalId]: note,
    }));
  };

  const handleGAD7Complete = (
    score: number,
    responses: Array<{ question: string; score: number }>
  ) => {
    console.log(responses);
    setGad7Score(score);
    setGad7Completed(true);

    // Update the progress of the anxiety goal based on the new score
    console.log(`New GAD-7 score: ${score}`);
  };

  const handlePHQ9Complete = (
    score: number,
    responses: Array<{ question: string; score: number }>
  ) => {
    console.log(responses);
    setPhq9Score(score);
    setPhq9Completed(true);

    console.log(`New PHQ-9 score: ${score}`);
  };

  const handleSaveSession = () => {
    // This would normally save to the database
    const sessionData = {
      content: editorContent,
      relatedGoals: selectedGoals,
      progressNotes,
      assessments: [
        ...(gad7Completed
          ? [
              {
                type: "GAD-7",
                score: gad7Score,
                date: new Date().toISOString().split("T")[0],
              },
            ]
          : []),
        ...(phq9Completed
          ? [
              {
                type: "PHQ-9",
                score: phq9Score,
                date: new Date().toISOString().split("T")[0],
              },
            ]
          : []),
      ],
    };

    console.log("Saving session data:", sessionData);
    alert("Session saved successfully!");
  };

  // Calculate the progress for each goal based on assessment scores
  const calculateGoalProgress = (goalId: string) => {
    if (goalId === "goal-1") {
      // Anxiety goal
      // Get all GAD-7 assessments
      const assessments = mockPreviousNotes
        .flatMap((note) => note.assessments)
        .filter((assessment) => assessment.type === "GAD-7");

      if (assessments.length === 0) return 0;

      // Get the initial and most recent scores
      const initialScore = assessments[0].score;
      const currentScore = assessments[assessments.length - 1].score;

      // Calculate progress as percentage of improvement from initial to target (7)
      const targetScore = 7;
      const totalReduction = initialScore - targetScore;
      const actualReduction = initialScore - currentScore;

      // Ensure we don't exceed 100%
      return Math.min(
        Math.round((actualReduction / totalReduction) * 100),
        100
      );
    }

    // For other goals, return the mock progress
    return goalId === "goal-2" ? 60 : 0;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h5" gutterBottom>
                New Session - Emily Parker
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date().toLocaleDateString()} | Therapy Session
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Complete GAD-7 Anxiety Assessment">
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<PsychologyIcon />}
                  onClick={() => setOpenGAD7Dialog(true)}
                  sx={{ borderRadius: 4 }}
                >
                  GAD-7
                  {gad7Completed && (
                    <Chip
                      size="small"
                      label={gad7Score}
                      color="primary"
                      sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                    />
                  )}
                </Button>
              </Tooltip>
              <Tooltip title="Complete PHQ-9 Depression Assessment">
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<MoodIcon />}
                  onClick={() => setOpenPHQ9Dialog(true)}
                  sx={{ borderRadius: 4 }}
                >
                  PHQ-9
                  {phq9Completed && (
                    <Chip
                      size="small"
                      label={phq9Score}
                      color="secondary"
                      sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                    />
                  )}
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Session Notes Editor - Left Side */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1" gutterBottom>
              Session Content
            </Typography>
            <Box sx={{ height: 500, mb: 2 }}>
              {editorContent && (
                <ClientRichTextEditor
                  data={editorContent}
                  onChange={handleEditorChange}
                />
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Treatment Plan Integration - Right Side */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1" gutterBottom color="primary">
              Treatment Plan Integration
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Select the goals addressed in this session and provide progress
              notes.
            </Typography>

            <Box sx={{ maxHeight: 500, overflow: "auto", pr: 1 }}>
              <FormGroup>
                {mockTreatmentPlan.goals.map((goal) => (
                  <Accordion key={goal.id} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedGoals.includes(goal.id)}
                            onChange={() => handleGoalSelect(goal.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="subtitle2">
                              {goal.title}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mt: 0.5,
                              }}
                            >
                              <Box sx={{ width: 100, mr: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={calculateGoalProgress(goal.id)}
                                  sx={{ height: 8, borderRadius: 5 }}
                                />
                              </Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {calculateGoalProgress(goal.id)}%
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ width: "100%", m: 0 }}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" paragraph>
                        {goal.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        <strong>Measurement:</strong> {goal.measurementCriteria}
                      </Typography>

                      {selectedGoals.includes(goal.id) && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Progress Notes for this Goal:
                          </Typography>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Enter progress notes for this goal..."
                            value={progressNotes[goal.id] || ""}
                            onChange={(e) =>
                              handleProgressNoteChange(goal.id, e.target.value)
                            }
                          />

                          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                            Interventions Used:
                          </Typography>
                          <FormGroup>
                            {goal.interventions.map((intervention) => (
                              <FormControlLabel
                                key={intervention.id}
                                control={<Checkbox />}
                                label={intervention.title}
                              />
                            ))}
                          </FormGroup>
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </FormGroup>

              {selectedGoals.length > 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Selected goals will be linked to this session note, and
                  progress will be updated based on your notes and assessments.
                </Alert>
              )}

              {/* Assessment Results Summary */}
              {(gad7Completed || phq9Completed) && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Assessment Results
                  </Typography>
                  <Grid container spacing={2}>
                    {gad7Completed && (
                      <Grid item xs={12} sm={6}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2" color="primary">
                            GAD-7 Score: {gad7Score}
                          </Typography>
                          <Typography variant="body2">
                            {gad7Score && gad7Score < 5
                              ? "Minimal Anxiety"
                              : gad7Score && gad7Score < 10
                              ? "Mild Anxiety"
                              : gad7Score && gad7Score < 15
                              ? "Moderate Anxiety"
                              : "Severe Anxiety"}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                    {phq9Completed && (
                      <Grid item xs={12} sm={6}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="subtitle2" color="secondary">
                            PHQ-9 Score: {phq9Score}
                          </Typography>
                          <Typography variant="body2">
                            {phq9Score && phq9Score < 5
                              ? "Minimal Depression"
                              : phq9Score && phq9Score < 10
                              ? "Mild Depression"
                              : phq9Score && phq9Score < 15
                              ? "Moderate Depression"
                              : phq9Score && phq9Score < 20
                              ? "Moderately Severe Depression"
                              : "Severe Depression"}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<CheckCircleIcon />}
          onClick={handleSaveSession}
        >
          Save Session
        </Button>
      </Box>

      {/* GAD-7 Assessment Dialog */}
      <Dialog
        open={openGAD7Dialog}
        onClose={() => setOpenGAD7Dialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">GAD-7 Anxiety Assessment</Typography>
            <IconButton onClick={() => setOpenGAD7Dialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <GAD7Assessment
            onComplete={(score, responses) => {
              handleGAD7Complete(score, responses);
              setOpenGAD7Dialog(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* PHQ-9 Assessment Dialog */}
      <Dialog
        open={openPHQ9Dialog}
        onClose={() => setOpenPHQ9Dialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">PHQ-9 Depression Assessment</Typography>
            <IconButton onClick={() => setOpenPHQ9Dialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <PHQ9Assessment
            onComplete={(score, responses) => {
              handlePHQ9Complete(score, responses);
              setOpenPHQ9Dialog(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
