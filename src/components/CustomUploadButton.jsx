"use client";
import "@uploadthing/react/styles.css";

import { UploadButton } from "@uploadthing/react";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export function CustomUploadButton({ onUploadComplete, onUploadError }) {
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={onUploadComplete}
      onUploadError={onUploadError}
    />
  );
}
