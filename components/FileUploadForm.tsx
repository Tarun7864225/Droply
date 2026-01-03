"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Input } from "@heroui/input";
import {Upload,X,FileUp,AlertTriangle,FolderPlus,ArrowRight} from "lucide-react";
import {Modal,ModalContent,ModalHeader,ModalBody,ModalFooter} from "@heroui/modal";
import axios from "axios";
import { showCustomToast } from "./ui/customtoast";

interface FileUploadFormProps {
  userId: string;
  onUploadSuccess?: () => void;
  currentFolder?: string | null;
}

export default function FileUploadForm({
  userId,
  onUploadSuccess,
  currentFolder = null,
}: FileUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    if (currentFolder) formData.append("parentId", currentFolder);

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      await axios.post("/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      });

      showCustomToast("success", `${file.name} has been uploaded successfully.`);

      clearFile();
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file. Please try again.");
      showCustomToast("error", "We couldn't upload your file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      showCustomToast("error", "Please enter a valid folder name.");
      return;
    }
    try {
      await axios.post("/api/folder-create", {
        name: folderName.trim(),
        userId,
        parentId: currentFolder,
      });
      showCustomToast("success", `Folder "${folderName}" created successfully.`);
      setFolderName("");
      setFolderModalOpen(false);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error("Error creating folder:", error);
      showCustomToast("error", "We couldn't create the folder. Please try again.");
    } 
  };

  return (
    <div className="space-y-5 text-black">
      <div className="flex gap-3">
        <Button
          className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center justify-center gap-2"
          onClick={() => setFolderModalOpen(true)}
        >
          <FolderPlus className="h-5 w-5" />
          New Folder
        </Button>
        <Button
          className="flex-1 py-2 bg-blue-500   hover:bg-blue-600 rounded-lg flex items-center justify-center gap-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUp className="h-5 w-5" />
          Add Image
        </Button>
      </div>

      {/* File drop area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-200 ${
          error ? "border-red-400 bg-red-100" : file ? "border-blue-400 bg-blue-100" : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
        }`}
      >
        {!file ? (
          <div className="space-y-3">
            <FileUp className="h-14 w-14 mx-auto text-blue-400" />
            <div>
              <p className="text-gray-600 text-sm">
                Drag and drop your image here, or{" "}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-500 font-medium underline underline-offset-2 bg-transparent border-0 p-0"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-1">Images up to 5MB</p>
            </div>
            <Input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileUp className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold truncate max-w-[180px]">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {file.size < 1024
                      ? `${file.size} B`
                      : file.size < 1024 * 1024
                        ? `${(file.size / 1024).toFixed(1)} KB`
                        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                  </p>
                </div>
              </div>
              <Button isIconOnly className="text-gray-500 hover:text-gray-700" onClick={clearFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-100 text-red-500 rounded-lg">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {uploading && <Progress value={progress} className="rounded-full bg-blue-100 h-2" />}

            <Button
              className="w-full py-2 rounded-lg bg-blue-500   hover:bg-blue-600 flex items-center justify-center gap-2"
              onClick={handleUpload}
              disabled={!!error}
            >
              <Upload className="h-4 w-4" />
              {uploading ? `Uploading... ${progress}%` : "Upload Image"}
              {!uploading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>

      {/* Upload tips */}
      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
        <h4 className="font-medium mb-2">Tips</h4>
        <ul className="space-y-1 list-disc list-inside">
          <li>Images are private and only visible to you</li>
          <li>Supported formats: JPG, PNG, GIF, WebP</li>
          <li>Maximum file size: 5MB</li>
        </ul>
      </div>

      {/* Create Folder Modal */}
      <Modal
        isOpen={folderModalOpen}
        onOpenChange={setFolderModalOpen}
        hideCloseButton
        backdrop="blur"
        placement="center"
        classNames={{
          base: "border border-gray-300 bg-white rounded-xl",
          header: "border-b border-gray-300",
          footer: "border-t border-gray-300",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex items-center gap-1">
            <FolderPlus className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-black">New Folder</span>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Enter a name for your folder:</p>
              <Input type="text" className="text-black" placeholder=" Folder Name" value={folderName} onChange={(e) => setFolderName(e.target.value)} autoFocus classNames={{ input: [ "focus:outline-none" ] }}/>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-end gap-2">
            <Button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg" onClick={() => setFolderModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-500 py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              onClick={handleCreateFolder}
              disabled={!folderName.trim()}
            >
              Create <ArrowRight className="h-4 w-4" />
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
