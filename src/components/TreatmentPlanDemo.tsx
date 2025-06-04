"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

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
      progressNotes: [
        {
          id: "note-1",
          date: "2025-03-22",
          rating: 2,
          notes: "Initial GAD-7 score: 15. Patient reports high anxiety in social situations.",
        },
        {
          id: "note-2",
          date: "2025-03-29",
          rating: 3,
          notes: "Introduced breathing techniques. Patient practiced during one anxiety episode with moderate success.",
        },
        {
          id: "note-3",
          date: "2025-04-01",
          rating: 4,
          notes: "GAD-7 score: 12. Patient reports using mindfulness techniques daily with some improvement.",
        },
      ],
    },
    {
      id: "goal-2",
      title: "Improve sleep quality",
      description: "Establish consistent sleep schedule and improve sleep quality",
      measurementCriteria: "Increase average sleep duration to 7-8 hours with fewer than 2 awakenings",
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
      progressNotes: [
        {
          id: "note-4",
          date: "2025-03-22",
          rating: 2,
          notes: "Initial assessment: Patient reports 4-5 hours of disrupted sleep with 3-4 awakenings.",
        },
        {
          id: "note-5",
          date: "2025-03-29",
          rating: 3,
          notes: "Sleep log shows improvement to 5-6 hours with 2-3 awakenings after implementing evening routine.",
        },
        {
          id: "note-6",
          date: "2025-04-01",
          rating: 5,
          notes: "Sleep log shows 6-7 hours with 1-2 awakenings. Patient reports feeling more rested.",
        },
      ],
    },
    {
      id: "goal-3",
      title: "Develop social support network",
      description: "Increase social interactions and develop support system",
      measurementCriteria: "Attend at least 2 social events per week and establish 2-3 supportive relationships",
      targetDate: "2025-07-30",
      status: "not_started",
      progress: 0,
      interventions: [],
      progressNotes: [],
    },
  ],
};

// Mock assessment data for charts
const mockAssessmentData = [
  { date: "2025-03-15", score: 15 },
  { date: "2025-03-22", score: 14 },
  { date: "2025-03-29", score: 12 },
  { date: "2025-04-01", score: 12 },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`treatment-tabpanel-${index}`}
      aria-labelledby={`treatment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface Intervention {
  id: string;
  title: string;
  description: string;
  frequency: string;
  duration: string;
  completed: number;
  total: number;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  measurementCriteria: string;
  targetDate: string;
  status: string;
  progress: number;
  interventions: Intervention[];
}

export default function TreatmentPlanDemo() {
  const [goals] = useState<Goal[]>(mockTreatmentPlan.goals);
  const [openGoalDialog, setOpenGoalDialog] = useState(false);
  const [openInterventionDialog, setOpenInterventionDialog] = useState(false);
  
  const handleOpenGoalDialog = () => {
    setOpenGoalDialog(true);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box>
              <Typography variant="h5" component="div" gutterBottom>
                {mockTreatmentPlan.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mockTreatmentPlan.description}
              </Typography>
            </Box>
            <Chip 
              label={mockTreatmentPlan.status === "active" ? "Active" : "Completed"} 
              color={mockTreatmentPlan.status === "active" ? "primary" : "success"}
            />
          </Box>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Start Date: {new Date(mockTreatmentPlan.startDate).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Target End Date: {new Date(mockTreatmentPlan.targetEndDate).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  Overall Progress:
                </Typography>
                <Box sx={{ width: "100%" }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={mockTreatmentPlan.progress} 
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {mockTreatmentPlan.progress}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={0} onChange={() => {}} aria-label="treatment plan tabs">
          <Tab label="Goals & Interventions" icon={<AssignmentIcon />} iconPosition="start" />
          <Tab label="Progress Tracking" icon={<TrendingUpIcon />} iconPosition="start" />
          <Tab label="Timeline" icon={<ExpandMoreIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      <TabPanel value={0} index={0}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenGoalDialog}
          >
            Add Goal
          </Button>
        </Box>

        {goals.map((goal) => (
          <Paper key={goal.id} sx={{ mb: 3, p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {goal.title}
                </Typography>
                <Typography variant="body2" paragraph>
                  {goal.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Measurement:</strong> {goal.measurementCriteria}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Target Date:</strong> {new Date(goal.targetDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Box>
                <Chip 
                  label={goal.status === "in_progress" ? "In Progress" : goal.status === "completed" ? "Completed" : "Not Started"} 
                  color={goal.status === "completed" ? "success" : goal.status === "in_progress" ? "primary" : "default"}
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={goal.progress} 
                    sx={{ width: 100, height: 8, borderRadius: 5 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {goal.progress}%
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Interventions
            </Typography>
            
            {goal.interventions.length > 0 ? (
              <List>
                {goal.interventions.map((intervention) => (
                  <ListItem 
                    key={intervention.id}
                    secondaryAction={
                      <IconButton edge="end" aria-label="edit">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      {intervention.completed === intervention.total ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={intervention.title}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {intervention.description}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="text.secondary">
                            Frequency: {intervention.frequency} • Duration: {intervention.duration} • 
                            Progress: {intervention.completed}/{intervention.total}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                No interventions added yet.
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<AddIcon />}
                onClick={handleOpenGoalDialog}
              >
                Add Intervention
              </Button>
            </Box>
          </Paper>
        ))}
      </TabPanel>

      <TabPanel value={0} index={1}>
        <Box sx={{ height: 400, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            GAD-7 Anxiety Assessment Scores
          </Typography>
          <Box sx={{ width: "100%", height: 300, p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
            {/* This would be a Chart.js or similar component in a real implementation */}
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <Box sx={{ display: "flex", height: "70%", alignItems: "flex-end" }}>
                {mockAssessmentData.map((data, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      width: `${100 / mockAssessmentData.length}%`, 
                      height: `${(data.score / 21) * 100}%`,
                      bgcolor: "primary.main",
                      mx: 1,
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4,
                      transition: "height 0.5s ease",
                      "&:hover": {
                        bgcolor: "primary.dark",
                      }
                    }} 
                  />
                ))}
              </Box>
              <Box sx={{ display: "flex", mt: 1, borderTop: "1px solid #e0e0e0", pt: 1 }}>
                {mockAssessmentData.map((data, index) => (
                  <Typography key={index} variant="caption" sx={{ width: `${100 / mockAssessmentData.length}%`, textAlign: "center" }}>
                    {new Date(data.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            GAD-7 Score Interpretation: 0-4 Minimal Anxiety, 5-9 Mild Anxiety, 10-14 Moderate Anxiety, 15-21 Severe Anxiety
          </Typography>
        </Box>
      </TabPanel>

      <TabPanel value={0} index={2}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Treatment Timeline
          </Typography>
          <Box sx={{ position: "relative", mt: 4, mb: 4 }}>
            <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, bgcolor: "grey.300" }} />
            
            {/* Start date marker */}
            <Box sx={{ position: "absolute", top: -8, left: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "primary.main" }} />
              <Typography variant="caption" sx={{ mt: 1 }}>
                Start: {new Date(mockTreatmentPlan.startDate).toLocaleDateString()}
              </Typography>
            </Box>
            
            {/* Today marker */}
            <Box sx={{ position: "absolute", top: -8, left: "35%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "secondary.main" }} />
              <Typography variant="caption" sx={{ mt: 1 }}>
                Today: {new Date().toLocaleDateString()}
              </Typography>
            </Box>
            
            {/* Goal 2 target date */}
            <Box sx={{ position: "absolute", top: -8, left: "50%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "info.main" }} />
              <Typography variant="caption" sx={{ mt: 1 }}>
                Sleep Goal: {new Date(mockTreatmentPlan.goals[1].targetDate).toLocaleDateString()}
              </Typography>
            </Box>
            
            {/* Goal 1 target date */}
            <Box sx={{ position: "absolute", top: -8, left: "70%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "info.main" }} />
              <Typography variant="caption" sx={{ mt: 1 }}>
                Anxiety Goal: {new Date(mockTreatmentPlan.goals[0].targetDate).toLocaleDateString()}
              </Typography>
            </Box>
            
            {/* End date marker */}
            <Box sx={{ position: "absolute", top: -8, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "success.main" }} />
              <Typography variant="caption" sx={{ mt: 1 }}>
                Target End: {new Date(mockTreatmentPlan.targetEndDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 8 }}>
            <Typography variant="subtitle1" gutterBottom>
              Upcoming Milestones
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Complete Sleep Hygiene Protocol" 
                  secondary={`Target: ${new Date(mockTreatmentPlan.goals[1].targetDate).toLocaleDateString()} (28 days remaining)`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Reduce GAD-7 Score Below 10" 
                  secondary={`Target: ${new Date("2025-05-15").toLocaleDateString()} (43 days remaining)`} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CalendarTodayIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Begin Social Support Network Development" 
                  secondary={`Target: ${new Date("2025-05-01").toLocaleDateString()} (29 days remaining)`} 
                />
              </ListItem>
            </List>
          </Box>
        </Box>
      </TabPanel>

      {/* Add Goal Dialog */}
      <Dialog open={openGoalDialog} onClose={() => setOpenGoalDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Treatment Goal</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="goal-title"
            label="Goal Title"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="goal-description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="goal-measurement"
            label="Measurement Criteria"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="goal-target-date"
            label="Target Date"
            type="date"
            fullWidth
            variant="outlined"
            defaultValue={new Date().toISOString().split("T")[0]}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel id="goal-status-label">Status</InputLabel>
            <Select
              labelId="goal-status-label"
              id="goal-status"
              label="Status"
              defaultValue="not_started"
            >
              <MenuItem value="not_started">Not Started</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenGoalDialog(false)}>Cancel</Button>
          <Button onClick={() => setOpenGoalDialog(false)} variant="contained">Add Goal</Button>
        </DialogActions>
      </Dialog>

      {/* Add Intervention Dialog */}
      <Dialog open={openInterventionDialog} onClose={() => setOpenInterventionDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Intervention</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="intervention-title"
            label="Intervention Title"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="intervention-description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                id="intervention-frequency"
                label="Frequency"
                type="text"
                fullWidth
                variant="outlined"
                placeholder="e.g., Daily, Weekly"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                id="intervention-duration"
                label="Duration"
                type="text"
                fullWidth
                variant="outlined"
                placeholder="e.g., 30 minutes"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                id="intervention-total"
                label="Total Sessions"
                type="number"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                id="intervention-completed"
                label="Completed Sessions"
                type="number"
                fullWidth
                variant="outlined"
                defaultValue={0}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInterventionDialog(false)}>Cancel</Button>
          <Button onClick={() => setOpenInterventionDialog(false)} variant="contained">Add Intervention</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
