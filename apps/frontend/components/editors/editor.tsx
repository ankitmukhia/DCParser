"use client";

import { useState, useCallback, useEffect } from "react";
import { UploadStatus } from "./file-uploader";
import { FileUploader } from "./file-uploader";
import { useRouter } from "next/navigation";
import { generateUUID } from "@/lib/utils";
// import { SAMPLE_MARKDOWN } from '@/constants/content'

export const Editor = () => {
  const router = useRouter();
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [fileName, setFileName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileSelect = useCallback(
    async (file: File) => {
      setFileName(file.name);
      setUploadStatus("uploading");
      setErrorMessage("");

			console.log("file: ", file)

      try {
        const documentId = generateUUID();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("id", documentId);

        const response = await fetch("http://localhost:3001/api/upload", {
          method: "POST",
          body: formData,
					credentials: "include"
        });

				console.log("response: ", response)

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const document = await response.json();

				console.log("document: ", document)

        setUploadStatus("success");
        router.push(`/editor/${documentId}`);
      } catch (error) {
        setUploadStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Upload failed",
        );
      }
    },
    [router, fileName, uploadStatus, errorMessage],
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <FileUploader
        onFileSelect={handleFileSelect}
        uploadStatus={uploadStatus}
        fileName={fileName}
        errorMessage={errorMessage}
      />
    </div>
  );
};
