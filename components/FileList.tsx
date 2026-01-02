"use client";

import { useEffect, useState, useMemo } from "react";
import { Folder, Star, Trash, X, ExternalLink } from "lucide-react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Divider } from "@heroui/divider";
import { Card } from "@heroui/card";
import { formatDistanceToNow, format } from "date-fns";
import axios from "axios";
import type { File as FileType } from "@/lib/db/schema";

import ConfirmationModal from "@/components/ui/ConfirmationModal";
import FileEmptyState from "@/components/FileEmptyState";
import FileIcon from "@/components/FileIcon";
import FileActions from "@/components/FileActions";
import FileLoadingState from "@/components/FileLoadingState";
import FileActionButtons from "./FileActionsButtons";
import FolderNavigation from "./FolderNavigation";
import FileTabs from "./FileTabs";
import { showCustomToast } from "./ui/customtoast";

interface FileListProps {
  userId: string;
  refreshTrigger?: number;
  onFolderChange?: (folderId: string | null) => void;
}

export default function FileList({
  userId,
  refreshTrigger = 0,
  onFolderChange,
}: FileListProps) {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [emptyTrashModalOpen, setEmptyTrashModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

  // Fetch files
  const fetchFiles = async () => {
    setLoading(true);
    try {
      let url = `/api/files?userId=${userId}`;
      if (currentFolder) url += `&parentId=${currentFolder}`;

      const response = await axios.get(url);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      showCustomToast("error", "Processing your request...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [userId, refreshTrigger, currentFolder]);

  const filteredFiles = useMemo(() => {
    switch (activeTab) {
      case "starred":
        return files.filter((file) => file.isStarred && !file.isTrash);
      case "trash":
        return files.filter((file) => file.isTrash);
      case "all":
      default:
        return files.filter((file) => !file.isTrash);
    }
  }, [files, activeTab]);

  const trashCount = useMemo(
    () => files.filter((file) => file.isTrash).length,
    [files]
  );

  const starredCount = useMemo(
    () => files.filter((file) => file.isStarred && !file.isTrash).length,
    [files]
  );

  const handleStarFile = async (fileId: string) => {
    try {
      await axios.patch(`/api/files/${fileId}/star`);

      // Update local state
      setFiles(
        files.map((file) =>
          file.id === fileId ? { ...file, isStarred: !file.isStarred } : file
        )
      );

      // Show toast
      const file = files.find((f) => f.id === fileId);
      showCustomToast("working", file?.isStarred ? "Removed from Starred" : "Added to Starred");
    } catch (error) {
      console.error("Error starring file:", error);
      showCustomToast("error", "We couldn't update the star status. Please try again.");
    }
  };

  const handleTrashFile = async (fileId: string) => {
    try {
      const response = await axios.patch(`/api/files/${fileId}/trash`);
      const responseData = response.data;

      // Update local state
      setFiles(
        files.map((file) =>
          file.id === fileId ? { ...file, isTrash: !file.isTrash } : file
        )
      );

      // Show toast
      const file = files.find((f) => f.id === fileId);
      showCustomToast("working", responseData.isTrash ? "Moved to Trash" : "Restored from Trash");
    } catch (error) {
      console.error("Error trashing file:", error);
      showCustomToast("error", "We couldn't update the file status. Please try again.");
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      // Store file info before deletion for the toast message
      const fileToDelete = files.find((f) => f.id === fileId);
      const fileName = fileToDelete?.name || "File";

      // Send delete request
      const response = await axios.delete(`/api/files/${fileId}/delete`);

      if (response.data.success) {
        // Remove file from local state
        setFiles(files.filter((file) => file.id !== fileId));
        showCustomToast("success", `"${fileName}" has been permanently removed`);
        setDeleteModalOpen(false);
      } else {
        throw new Error(response.data.error || "Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      showCustomToast("error", "We couldn't delete the file. Please try again later.");
    }
  };

  const handleEmptyTrash = async () => {
    try {
      await axios.delete(`/api/files/empty-trash`);

      // Remove all trashed files from local state
      setFiles(files.filter((file) => !file.isTrash));
      showCustomToast("success", `All ${trashCount} items have been permanently deleted`);

      // Close modal
      setEmptyTrashModalOpen(false);
    } catch (error) {
      console.error("Error emptying trash:", error);
      showCustomToast("error", "We couldn't empty the trash. Please try again later.");
    }
  };

  // Add this function to handle file downloads
  const handleDownloadFile = async (file: FileType) => {
    try {
      showCustomToast("error",`Getting "${file.name}" ready for download...`);

      // For images, we can use the ImageKit URL directly with optimized settings
      if (file.type.startsWith("image/")) {
        // Create a download-optimized URL with ImageKit
        // Using high quality and original dimensions for downloads
        const downloadUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-100,orig-true/${file.path}`;

        // Fetch the image first to ensure it's available
        const response = await fetch(downloadUrl);
        if (!response.ok) {
          throw new Error(`Failed to download image: ${response.statusText}`);
        }

        // Get the blob data
        const blob = await response.blob();

        // Create a download link
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = file.name;
        document.body.appendChild(link);
        showCustomToast("success", `"${file.name}" is ready to download.`);

        // Trigger download
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } else {
        // For other file types, use the fileUrl directly
        const response = await fetch(file.fileUrl);
        if (!response.ok) {
          showCustomToast("error", `Failed to download file: ${response.statusText}`);
          throw new Error(`Failed to download file: ${response.statusText}`);
        }

        // Get the blob data
        const blob = await response.blob();

        // Create a download link
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = file.name;
        document.body.appendChild(link);

        showCustomToast("success",`"${file.name}" is ready to download.`);

        // Trigger download
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      showCustomToast("error", "We couldn't download the file. Please try again later.");
    }
  };

  const openImageViewer = (file: FileType) => {
    if (file.type.startsWith("image/")) {
      const optimizedUrl = `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-90,w-1600,h-1200,fo-auto/${file.path}`;
      window.open(optimizedUrl, "_blank");
    }
  };

  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolder(folderId);
    setFolderPath([...folderPath, { id: folderId, name: folderName }]);
    onFolderChange?.(folderId);
  };

  const navigateUp = () => {
    if (folderPath.length > 0) {
      const newPath = [...folderPath];
      newPath.pop();
      setFolderPath(newPath);
      const newFolderId = newPath.length > 0 ? newPath[newPath.length - 1].id : null;
      setCurrentFolder(newFolderId);
      onFolderChange?.(newFolderId);
    }
  };

  const navigateToPathFolder = (index: number) => {
    if (index < 0) {
      setCurrentFolder(null);
      setFolderPath([]);
      onFolderChange?.(null);
    } else {
      const newPath = folderPath.slice(0, index + 1);
      setFolderPath(newPath);
      setCurrentFolder(newPath[newPath.length - 1].id);
      onFolderChange?.(newPath[newPath.length - 1].id);
    }
  };

  const handleItemClick = (file: FileType) => {
    if (file.isFolder) navigateToFolder(file.id, file.name);
    else if (file.type.startsWith("image/")) openImageViewer(file);
  };

  if (loading) return <FileLoadingState />;

return (
  <section className="flex flex-col gap-6 text-gray-900">
    {/* ───────────── Top Controls ───────────── */}
    <header className="flex flex-col gap-4">
      <FileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        files={files}
        starredCount={starredCount}
        trashCount={trashCount}
      />

      <div className="flex items-center justify-between">
        <FileActionButtons
          activeTab={activeTab}
          trashCount={trashCount}
          folderPath={folderPath}
          onRefresh={fetchFiles}
          onEmptyTrash={() => setEmptyTrashModalOpen(true)}
        />
      </div>

      {activeTab === "all" && (
        <div className="flex justify-end items-end border-gray-200 bg-white">
          <FolderNavigation
            folderPath={folderPath}
            navigateUp={navigateUp}
            navigateToPathFolder={navigateToPathFolder}
          />
        </div>
      )}
    </header>

    <Divider className="bg-gray-200" />

    {/* ───────────── Content Area ───────────── */}
    <main className="flex flex-col gap-4">
      {filteredFiles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16">
          <FileEmptyState activeTab={activeTab} />
        </div>
      ) : (
        <Card
          shadow="none"
          className="rounded-xl border border-gray-200 bg-white"
        >
          <div className="relative overflow-x-auto">
            <Table
              aria-label="Files table"
              isStriped
              selectionMode="none"
              classNames={{
                base: "min-w-full",
                th: "bg-gray-50 text-gray-600 text-sm font-semibold border-b border-gray-200",
                td: "py-4 text-sm border-b border-gray-100",
              }}
            >
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn className="hidden sm:table-cell">
                  Type
                </TableColumn>
                <TableColumn className="hidden md:table-cell">
                  Size
                </TableColumn>
                <TableColumn className="hidden sm:table-cell">
                  Added
                </TableColumn>
                <TableColumn width={220}>Actions</TableColumn>
              </TableHeader>

              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow
                    key={file.id}
                    className={
                      file.isFolder || file.type.startsWith("image/")
                        ? "cursor-pointer"
                        : ""
                    }
                    onClick={() => handleItemClick(file)}
                  >
                    {/* Name */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <FileIcon file={file} />

                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2 font-medium text-gray-900">
                            <span className="max-w-[280px] truncate">
                              {file.name}
                            </span>

                            {file.isStarred && (
                              <Star className="h-4 w-4 text-blue-500" />
                            )}
                            {file.isFolder && (
                              <Folder className="h-3.5 w-3.5 text-gray-400" />
                            )}
                            {file.type.startsWith("image/") && (
                              <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                            )}
                          </div>

                          <span className="text-xs text-gray-500 sm:hidden">
                            {formatDistanceToNow(
                              new Date(file.createdAt),
                              { addSuffix: true }
                            )}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Type */}
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-xs text-gray-500">
                        {file.isFolder ? "Folder" : file.type}
                      </span>
                    </TableCell>

                    {/* Size */}
                    <TableCell className="hidden md:table-cell">
                      <span className="font-medium text-gray-700">
                        {file.isFolder
                          ? "-"
                          : file.size < 1024
                          ? `${file.size} B`
                          : file.size < 1024 * 1024
                          ? `${(file.size / 1024).toFixed(1)} KB`
                          : `${(
                              file.size /
                              (1024 * 1024)
                            ).toFixed(1)} MB`}
                      </span>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex flex-col">
                        <span className="text-gray-800">
                          {formatDistanceToNow(
                            new Date(file.createdAt),
                            { addSuffix: true }
                          )}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(
                            new Date(file.createdAt),
                            "MMMM d, yyyy"
                          )}
                        </span>
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell
                      onClick={(e) => e.stopPropagation()}
                      className=""
                    >
                      <FileActions 
                        file={file}
                        onStar={handleStarFile}
                        onTrash={handleTrashFile}
                        onDelete={(file) => {
                          setSelectedFile(file);
                          setDeleteModalOpen(true);
                        }}
                        onDownload={handleDownloadFile}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </main>

    {/* ───────────── Modals ───────────── */}
    <ConfirmationModal
      isOpen={deleteModalOpen}
      onOpenChange={setDeleteModalOpen}
      title="Confirm Permanent Deletion"
      description="Are you sure you want to permanently delete this file?"
      icon={X}
      iconColor="text-red-600"
      confirmText="Delete Permanently"
      confirmColor="danger"
      onConfirm={() =>
        selectedFile && handleDeleteFile(selectedFile.id)
      }
      isDangerous
      warningMessage={`"${selectedFile?.name}" will be permanently removed.`}
    />

    <ConfirmationModal
      isOpen={emptyTrashModalOpen}
      onOpenChange={setEmptyTrashModalOpen}
      title="Empty Trash"
      description="Are you sure you want to empty the trash?"
      icon={Trash}
      iconColor="text-red-600"
      confirmText="Empty Trash"
      confirmColor="danger"
      onConfirm={handleEmptyTrash}
      isDangerous
      warningMessage={`All ${trashCount} items will be permanently deleted.`}
    />
  </section>
);

}
