"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/uploadFile";

interface ImageUploadProps {
  formData: {
    avatarUrl: string;
    firstName: string;
    lastName: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function ImageUpload({ formData, setFormData }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setStatusMessage(null);

    const result = await uploadImageToCloudinary(file, (p) => setProgress(p));

    setUploading(false);

    if (result.success && result.url) {
      setFormData((prev: any) => ({
        ...prev,
        avatarUrl: result.url!,
      }));
      setStatusMessage({ text: "Avatar updated successfully!", type: "success" });
    } else {
      setStatusMessage({ text: result.error || "Upload failed. Please try again.", type: "error" });
    }
  };

  return (
    <div className="flex items-center gap-5">
      <div className="relative group">
        <Avatar className="h-20 w-20 ring-2 ring-border/80 shadow-md relative overflow-hidden">
          <AvatarImage
            src={formData.avatarUrl || "/noAvatar.png"}
            alt="Profile Avatar"
            className="object-cover"
          />
          <AvatarFallback className="text-xl font-bold bg-secondary text-foreground">
            {formData.firstName?.[0]?.toUpperCase() ?? ""}
            {formData.lastName?.[0]?.toUpperCase() ?? ""}
          </AvatarFallback>

          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 rounded-full z-20">
              <Loader2 className="h-5 w-5 animate-spin text-primary mb-1" />
              <p className="text-[10px] text-white font-mono">{progress}%</p>
            </div>
          )}
        </Avatar>

        <label
          htmlFor="profile-upload"
          className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
        >
          <Camera className="h-5 w-5 text-white" />
        </label>
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      <div className="flex flex-col space-y-1">
        <p className="text-xs font-semibold text-foreground">
          Upload new photo
        </p>
        <p className="text-[11px] text-muted-foreground">
          Recommended: square JPG, PNG or WebP, up to 5MB.
        </p>

        {statusMessage && (
          <p
            className={`text-xs font-medium pt-1 ${
              statusMessage.type === "success"
                ? "text-emerald-400"
                : "text-destructive"
            }`}
          >
            {statusMessage.text}
          </p>
        )}
      </div>
    </div>
  );
}
