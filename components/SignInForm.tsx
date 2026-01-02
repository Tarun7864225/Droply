"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";

export default function SignInForm() {
    const router = useRouter();
    const { signIn, isLoaded, setActive } = useSignIn();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        if (!isLoaded) return;

        setIsSubmitting(true);
        setAuthError(null);

        try {
            const result = await signIn.create({
                identifier: data.identifier,
                password: data.password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/dashboard");
            } else {
                setAuthError("Sign-in could not be completed. Please try again.");
            }
        } catch (error: any) {
            setAuthError(
                error.errors?.[0]?.message ||
                    "An error occurred during sign-in. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-xl">
            <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Welcome back
                </h1>
                <p className="text-sm text-gray-500 text-center max-w-xs">
                    Sign in to access your secure cloud storage
                </p>
            </CardHeader>

            <Divider />

            <CardBody className="py-8 px-6 text-black">
                {authError && (
                    <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <p>{authError}</p>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="identifier" className="text-sm font-medium text-gray-700" >
                            Email address
                        </label>
                        <Input
                            id="identifier"
                            type="email"
                            placeholder="example@mail.com"
                            startContent={
                                <Mail className="h-4 w-4 mr-2 text-gray-400 " />
                            }
                            isInvalid={!!errors.identifier}
                            errorMessage={errors.identifier?.message}
                            {...register("identifier")}
                            className="w-full"
                            classNames={{ input: [ "focus:outline-none" ] }}
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <Input id="password" type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            startContent={
                                <Lock className="h-4 w-4 mr-2 text-gray-400" />
                            }
                            endContent={
                                <Button
                                    isIconOnly
                                    variant="light"
                                    size="sm"
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>
                            }
                            isInvalid={!!errors.password}
                            errorMessage={errors.password?.message}
                            {...register("password")}
                            className="w-full"
                            classNames={{ input: [ "focus:outline-none" ] }}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                        isLoading={isSubmitting}
                    >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </CardBody>

            <Divider />

            <CardFooter className="flex justify-center py-6">
                <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/sign-up"
                        className="font-medium text-blue-600 hover:text-blue-700"
                    >
                        Sign up
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
