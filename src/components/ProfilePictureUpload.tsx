import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Avatar,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { supabase } from "@/utils/supabase";
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
      const { error: uploadError } = await supabase.storage
        .from("profile-pics")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-pics").getPublicUrl(fileName);

      console.log("New profile picture URL:", publicUrl);
      
      // Try to delete the old profile picture if it exists
      if (currentImageUrl && currentImageUrl !== publicUrl) {
        try {
          // Extract the file path from the URL
          const storageUrl = supabase.storage.from("profile-pics").getPublicUrl("").data.publicUrl;
          let oldFileName = currentImageUrl;
          
          // Remove the storage URL part to get just the file path
          if (oldFileName.startsWith(storageUrl)) {
            oldFileName = oldFileName.substring(storageUrl.length);
          }
          
          // If the filename starts with a slash, remove it
          if (oldFileName.startsWith("/")) {
            oldFileName = oldFileName.substring(1);
          }
          
          console.log("Attempting to delete old profile picture:", oldFileName);
          
          // Only attempt to delete if it looks like a valid filename
          if (oldFileName.includes(user.id)) {
            const { error: deleteError } = await supabase.storage
              .from("profile-pics")
              .remove([oldFileName]);
              
            if (deleteError) {
              console.error("Error deleting old profile picture:", deleteError);
            } else {
              console.log("Successfully deleted old profile picture");
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
    fileInputRef.current?.click();
  };

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Box sx={{ textAlign: "center" }}>
      <Avatar
        src={displayImageUrl}
        sx={{
          width: 150,
          height: 150,
          mx: "auto",
          mb: 2,
        }}
      >
        {initials}
      </Avatar>

      <input
        type="file"
        accept="image/jpeg, image/png, image/gif, image/webp"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileSelect}
      />

      {!uploading ? (
        <Button
          variant="outlined"
          size="small"
          onClick={handleButtonClick}
          sx={{ mt: 1 }}
        >
          Change Photo
        </Button>
      ) : (
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
