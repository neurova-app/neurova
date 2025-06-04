import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Avatar,
  CircularProgress,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import { storage } from "@/utils/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useAuth } from "@/contexts/AuthContext";
import { useTherapistProfile } from "@/contexts/TherapistProfileContext";

interface ProfilePictureUploadProps {
  currentImageUrl: string;
  fullName: string;
  onImageUploaded: (url: string) => void;
}

export default function ProfilePictureUpload({
  currentImageUrl,
  fullName,
  onImageUploaded,
}: ProfilePictureUploadProps) {
  const { user } = useAuth();
  const { updateProfilePicture } = useTherapistProfile();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayImageUrl, setDisplayImageUrl] = useState(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  // Handle menu open
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Update local state when prop changes
  useEffect(() => {
    setDisplayImageUrl(currentImageUrl);
  }, [currentImageUrl]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError(null);

    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError(
        "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed."
      );
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("File size exceeds the 5MB limit");
      return;
    }

    // Create a temporary preview URL
    const objectUrl = URL.createObjectURL(file);
    setDisplayImageUrl(objectUrl);

    // Start upload immediately after validation
    setUploading(true);

    try {
      // Generate a unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      // Upload directly to Supabase Storage
      const storageRef = ref(storage, `profile-pics/${fileName}`);
      await uploadBytes(storageRef, file);
      const publicUrl = await getDownloadURL(storageRef);

      console.log("New profile picture URL:", publicUrl);
      
      // Try to delete the old profile picture if it exists
      if (currentImageUrl && currentImageUrl !== publicUrl) {
        try {
          // Extract the file path from the URL
          let oldFileName = decodeURIComponent(
            currentImageUrl.split('/o/')[1]?.split('?')[0] || ''
          );
          
          console.log("Attempting to delete old profile picture:", oldFileName);
          
          // Only attempt to delete if it looks like a valid filename
          if (oldFileName.includes(user.id)) {
            try {
              await deleteObject(ref(storage, `profile-pics/${oldFileName}`));
            } catch (err) {
              console.error('Error deleting old profile picture:', err);
            }
          }
        } catch (deleteError) {
          // Don't fail the whole operation if delete fails
          console.error("Error during old profile picture deletion:", deleteError);
        }
      }

      // Update the display image with the permanent URL
      setDisplayImageUrl(publicUrl);

      // Call the callback with the new image URL
      onImageUploaded(publicUrl);

      // Update the profile picture in the context (this will update all components using the context)
      await updateProfilePicture(publicUrl);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Revoke the temporary object URL to free memory
      URL.revokeObjectURL(objectUrl);
    } catch (error: unknown) {
      console.error("Error uploading profile picture:", error);
      setError(
        error instanceof Error ? error.message : "Failed to upload image"
      );
      // Reset to the original image if there's an error
      setDisplayImageUrl(currentImageUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    handleMenuClose();
    fileInputRef.current?.click();
  };
  
  const handleDeletePhoto = async () => {
    handleMenuClose();
    setError(null);
    
    if (!user?.id || !currentImageUrl) return;
    
    setUploading(true);
    
    try {
      let fileName = decodeURIComponent(
        currentImageUrl.split('/o/')[1]?.split('?')[0] || ''
      );
      
      // Only attempt to delete if it looks like a valid filename
      if (fileName.includes(user.id)) {
        await deleteObject(ref(storage, `profile-pics/${fileName}`));
        
        // Update the profile with empty profile picture
        await updateProfilePicture("");
        
        // Call the callback with empty string
        onImageUploaded("");
        
        // Update local state
        setDisplayImageUrl("");
      }
    } catch (error: unknown) {
      console.error("Error deleting profile picture:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete image"
      );
    } finally {
      setUploading(false);
    }
  };

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Box sx={{ textAlign: "center", position: "relative" }}>
      <Box 
        sx={{ 
          position: "relative", 
          width: 150, 
          height: 150, 
          mx: "auto", 
          mb: 2,
        }}
      >
        {/* Profile Picture */}
        <Box
          sx={{ 
            position: "relative",
            width: 150,
            height: 150,
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <Avatar
            src={displayImageUrl}
            sx={{
              width: 150,
              height: 150,
            }}
          >
            {initials}
          </Avatar>
        </Box>
        
        {/* Edit Icon Button */}
        {!uploading && (
          <Box
            onClick={handleMenuClick}
            sx={{
              position: "absolute",
              bottom: 5,
              right: 5,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "50%",
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 2,
              transition: "background-color 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <EditIcon sx={{ fontSize: 16, color: "white" }} />
          </Box>
        )}
      </Box>

      <input
        type="file"
        accept="image/jpeg, image/png, image/gif, image/webp"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      
      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleButtonClick}>
          <PhotoCameraIcon fontSize="small" sx={{ mr: 1 }} />
          Change Photo
        </MenuItem>
        <MenuItem 
          onClick={handleDeletePhoto}
          disabled={!displayImageUrl} // Disable if no image to delete
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete Photo
        </MenuItem>
      </Menu>

      {uploading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{ display: "block", mt: 1 }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
}
