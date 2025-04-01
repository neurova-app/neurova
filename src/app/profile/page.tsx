'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Alert,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { therapistOperations } from '@/utils/supabase-db';
import { useSnackbar } from 'notistack';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';

// Define the therapist profile form data structure
interface TherapistProfileForm {
  fullName: string;
  email: string;
  phone: string;
  specialty: string;
  bio: string;
  education: string;
  yearsExperience: number;
  licenseNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  languages: string[];
  profilePicture: string;
}

const specialties = [
  'Clinical Psychology',
  'Neuropsychology',
  'Child Psychology',
  'Cognitive Behavioral Therapy',
  'Family Therapy',
  'Trauma Therapy',
  'Addiction Counseling',
  'Geriatric Psychology',
  'Health Psychology',
  'Other'
];

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<TherapistProfileForm>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    specialty: '',
    bio: '',
    education: '',
    yearsExperience: 0,
    licenseNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    languages: ['English'],
    profilePicture: user?.avatar || '',
  });

  useEffect(() => {
    const fetchTherapistProfile = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const profile = await therapistOperations.getTherapistProfile(user.id);
        
        if (profile) {
          setFormData(prev => ({
            ...prev,
            fullName: user?.name || prev.fullName,
            email: user?.email || prev.email,
            phone: profile.phone_number || prev.phone,
            specialty: profile.specialty || prev.specialty,
            bio: profile.bio || prev.bio,
            education: profile.education || prev.education,
            yearsExperience: profile.years_of_experience || prev.yearsExperience,
            licenseNumber: profile.license_number || profile.licenses?.[0] || prev.licenseNumber,
            address: profile.address || prev.address,
            city: profile.city || prev.city,
            state: profile.state || prev.state,
            country: profile.country || prev.country,
            postalCode: profile.zip_code || prev.postalCode,
            languages: profile.languages_spoken || prev.languages,
            profilePicture: profile.profile_picture || user?.avatar || prev.profilePicture,
          }));
        }
      } catch (err) {
        console.error('Error fetching therapist profile:', err);
        setError('Failed to load your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTherapistProfile();
  }, [user]);

  const handleInputChange = (field: keyof TherapistProfileForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!user?.id) {
      enqueueSnackbar('You must be logged in to update your profile', { variant: 'error' });
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      // Convert from our form data structure to the database structure
      const profileData = {
        specialty: formData.specialty,
        bio: formData.bio,
        education: formData.education,
        years_of_experience: formData.yearsExperience,
        license_number: formData.licenseNumber,
        licenses: undefined,
        phone_number: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zip_code: formData.postalCode,
        languages_spoken: formData.languages,
        profile_picture: formData.profilePicture,
      };
      
      await therapistOperations.upsertTherapistProfile(user.id, profileData);
      
      // Update user's name in auth metadata
      if (formData.fullName !== user.name) {
        await updateUserProfile({
          name: formData.fullName
        });
      }
      
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update your profile. Please try again.');
      enqueueSnackbar('Error updating profile', { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Therapist Profile
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Update your professional information to help patients learn more about you.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Grid container spacing={3}>
          {/* Profile Picture and Basic Info */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <ProfilePictureUpload
              currentImageUrl={formData.profilePicture}
              fullName={formData.fullName}
              onImageUploaded={(url) => handleInputChange('profilePicture', url)}
            />
            <Typography variant="h6" gutterBottom>
              {formData.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {formData.email}
            </Typography>
          </Grid>

          {/* Personal Information */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" color="primary" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  disabled
                  helperText="Email cannot be changed"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Professional Information */}
            <Typography variant="h6" color="primary" gutterBottom>
              Professional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Specialty"
                  value={formData.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                >
                  {specialties.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="License Number"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Years of Experience"
                  value={formData.yearsExperience}
                  onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">years</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Education"
                  multiline
                  rows={2}
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder="e.g., Ph.D. in Clinical Psychology, Stanford University"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Professional Bio"
                  multiline
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Describe your approach to therapy and your professional experience"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Address Information */}
            <Typography variant="h6" color="primary" gutterBottom>
              Address Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="State/Province"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Postal Code"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Save Button */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : null}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
