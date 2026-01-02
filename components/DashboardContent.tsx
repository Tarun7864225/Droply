"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { FileUp, FileText, User } from "lucide-react";
import FileUploadForm from "@/components/FileUploadForm";
import { useSearchParams } from "next/navigation";
import FileList from "./FileList";
import UserProfile from "./UserProfile";

interface DashboardContentProps {
    userId: string;
    userName: string;
}

export default function DashboardContent({ userId, userName }: DashboardContentProps) {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab");

    const [activeTab, setActiveTab] = useState<string>("files");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);

    // Sync active tab with URL param
    useEffect(() => {
        if (tabParam === "profile") setActiveTab("profile");
        else setActiveTab("files");
    }, [tabParam]);


    const handleFileUploadSuccess = useCallback(() => {
        setRefreshTrigger((prev) => prev + 1);
    }, []);

    const handleFolderChange = useCallback((folderId: string | null) => {
        setCurrentFolder(folderId);
    }, []);

    return (
        <div className="bg-white text-black">
            {/* Top bar: Greeting + Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                {/* Greeting */}
                <div>
                    <h2 className="text-4xl font-bold text-gray-900">
                        Hi,{" "}
                        <span className="text-blue-600">
                            {userName?.length > 10
                                ? `${userName.substring(0, 10)}...`
                                : userName?.split(" ")[0] || "there"}
                        </span>
                        !
                    </h2>
                    <p className="mt-2 text-lg text-gray-500">
                        Your images are waiting for you.
                    </p>
                </div>

                {/* Tabs */}
                <div className="mt-4 lg:mt-0">
                    <Tabs
                        aria-label="Dashboard Tabs"
                        color="primary"
                        variant="underlined"
                        selectedKey={activeTab}
                        onSelectionChange={(key) => setActiveTab(key as string)}
                        classNames={{
                            tabList: "gap-6 justify-end",
                            tab: "py-3 cursor-pointer",
                        }}
                    >
                        <Tab
                            key="files"
                            title={
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    <span className="font-medium">My Files</span>
                                </div>
                            }
                        />
                        <Tab
                            key="profile"
                            title={
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-600" />
                                    <span className="font-medium">Profile</span>
                                </div>
                            }
                        />
                    </Tabs>
                </div>
            </div>

            {/* Tab content */}
            {activeTab === "files" && (
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Upload Panel */}
                    <div className="lg:col-span-1">
                        <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md rounded-xl transition-shadow">
                            <CardHeader className="flex items-center gap-3 px-4 pt-4">
                                <FileUp className="h-5 w-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">Upload</h2>
                            </CardHeader>
                            <CardBody className="px-4 py-4">
                                <FileUploadForm
                                    userId={userId}
                                    onUploadSuccess={handleFileUploadSuccess}
                                    currentFolder={currentFolder}
                                />
                            </CardBody>
                        </Card>
                    </div>

                    {/* Files List */}
                    <div className="lg:col-span-2">
                        <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md rounded-xl transition-shadow">
                            <CardHeader className="flex items-center gap-3 px-4 pt-4">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Your Files
                                </h2>
                            </CardHeader>
                            <CardBody className="px-4 py-4">
                                <FileList
                                    userId={userId}
                                    refreshTrigger={refreshTrigger}
                                    onFolderChange={handleFolderChange}
                                />
                            </CardBody>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === "profile" && (
                <div className="mt-6">
                    <UserProfile />
                </div>
            )}
        </div>
    );
}
