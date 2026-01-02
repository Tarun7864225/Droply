"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Avatar } from "@heroui/avatar";
import { Divider } from "@heroui/divider";
import { useRouter } from "next/navigation";
import { Mail, User, LogOut, Shield, ArrowRight } from "lucide-react";
import Badge from "./ui/Badge";

export default function UserProfile() {
    const { isLoaded, isSignedIn, user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();

    if (!isLoaded) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Spinner size="lg" color="primary" />
                <p className="mt-4 text-sm text-gray-500">
                    Loading your profile…
                </p>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <Card className="max-w-md mx-auto bg-white border border-gray-200 shadow-md rounded-xl">
                <CardHeader className="flex items-center gap-3 px-6 pt-6">
                    <User className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                        User Profile
                    </h2>
                </CardHeader>

                <Divider />

                <CardBody className="py-10 px-6 text-center">
                    <Avatar
                        name="Guest"
                        size="lg"
                        className="mx-auto mb-4 h-24 w-24"
                    />
                    <p className="text-lg font-medium text-gray-900">
                        Not signed in
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        Please sign in to access your profile
                    </p>

                    <Button
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        size="lg"
                        endContent={<ArrowRight className="h-4 w-4" />}
                        onClick={() => router.push("/sign-in")}
                    >
                        Sign In
                    </Button>
                </CardBody>
            </Card>
        );
    }

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const email = user.primaryEmailAddress?.emailAddress || "";
    const initials = fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    const userRole = user.publicMetadata.role as string | undefined;

    return (
        <Card className="max-w-md mx-auto bg-white border border-gray-200 shadow-md rounded-xl">
            <CardHeader className="flex items-center gap-3 px-6 pt-6">
                <User className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                    User Profile
                </h2>
            </CardHeader>

            <Divider />

            <CardBody className="px-6 py-8">
                {/* Identity */}
                <div className="flex flex-col items-center text-center">
                    <Avatar
                        src={user.imageUrl || undefined}
                        name={initials}
                        size="lg"
                        className="h-24 w-24 mb-4"
                    />

                    <h3 className="text-xl font-semibold text-gray-900">
                        {fullName}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="h-4 w-4" />
                        <span>{email}</span>
                    </div>

                    {userRole && (
                        <Badge
                            color="primary"
                            variant="flat"
                            className="mt-3"
                        >
                            {userRole}
                        </Badge>
                    )}
                </div>

                <Divider className="my-6" />

                {/* Account details */}
                <div className="space-y-4 text-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Shield className="h-5 w-5 text-blue-600/70" />
                            <span className="font-medium">
                                Account status
                            </span>
                        </div>
                        <Badge color="success" variant="flat">
                            Active
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="h-5 w-5 text-blue-600/70" />
                            <span className="font-medium">
                                Email verification
                            </span>
                        </div>
                        <Badge
                            color={
                                user.emailAddresses?.[0]?.verification
                                    ?.status === "verified"
                                    ? "success"
                                    : "warning"
                            }
                            variant="flat"
                        >
                            {user.emailAddresses?.[0]?.verification
                                ?.status === "verified"
                                ? "Verified"
                                : "Pending"}
                        </Badge>
                    </div>
                </div>
            </CardBody>

            <Divider />

            <CardFooter className="px-6 py-4">
                <Button
                    variant="flat"
                    color="danger"
                    startContent={<LogOut className="h-4 w-4" />}
                    onClick={() =>
                        signOut(() => {
                            router.push("/");
                        })
                    }
                >
                    Sign Out
                </Button>
            </CardFooter>
        </Card>
    );
}
