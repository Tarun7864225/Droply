"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import {
    Mail,
    Lock,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
} from "lucide-react";
import { signUpSchema } from "@/schemas/signUpSchema";
import { Loader } from "./loader";

export default function SignUpForm() {
    const router = useRouter();
    const { signUp, isLoaded, setActive } = useSignUp();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [verifying, setVerifying] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirmation: "",
        },
    });

    while(isSubmitting) return <Loader/>;

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        if (!isLoaded) return;

        setIsSubmitting(true);
        setAuthError(null);

        try {
            await signUp.create({
                emailAddress: data.email,
                password: data.password,
            });

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            setVerifying(true);

        } catch (error: unknown) {
            const message = typeof error === "object" && error !== null && "errors" in error && Array.isArray((error as { errors?: { message?: string }[] }).errors)? (error as { errors: { message?: string }[] }).errors[0]?.message: undefined;
            setAuthError(message || "An error occurred during sign-in. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isLoaded || !signUp) return;
        setIsSubmitting(true);
        setVerificationError(null);

        try {
            const result = await signUp.attemptEmailAddressVerification({ code: verificationCode });
                
            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/dashboard");
            } else {
                setVerificationError("Verification could not be completed. Please try again.");
            }
        } catch (error: unknown) {
            const message = typeof error === "object" && error !== null && "errors" in error && Array.isArray((error as { errors?: { message?: string }[] }).errors)? (error as { errors: { message?: string }[] }).errors[0]?.message: undefined;
            setAuthError(message || "An error occurred during sign-in. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* =======================
        EMAIL VERIFICATION
    ======================= */

    if (verifying) {
        return (
            <Card className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-xl text-black">
                <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-4">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Verify your email
                    </h1>
                    <p className="text-sm text-gray-500 text-center max-w-xs">
                        Enter the verification code sent to your email address
                    </p>
                </CardHeader>

                <Divider />

                <CardBody className="py-8 px-6">
                    {verificationError && (
                        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <p>{verificationError}</p>
                        </div>
                    )}

                    <form onSubmit={handleVerificationSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="verificationCode" className="text-sm font-medium text-gray-700" >
                                Verification code
                            </label>
                            <Input id="verificationCode" type="text" placeholder="6-digit code" value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)} autoFocus
                                className="w-full" classNames={{ input: [ "focus:outline-none" ] }}
                            />
                        </div>

                        <Button type="submit" isLoading={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"   
                        >
                            {isSubmitting ? "Verifying..." : "Verify Email"}
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Didn&apos;t receive a code?{" "}
                        <button onClick={async () => {
                                if(signUp) await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
                            }} className="font-medium text-blue-600 hover:text-blue-700"
                        >
                            Resend code
                        </button>
                    </p>
                </CardBody>
            </Card>
        );
    }

    /* =======================
        SIGN UP FORM
    ======================= */

    return (
        <Card className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-xl text-black">
            <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Create your account
                </h1>
                <p className="text-sm text-gray-500 text-center max-w-xs">
                    Secure cloud storage for your files and images
                </p>
            </CardHeader>

            <Divider />

            <CardBody className="py-8 px-6">
                {authError && (
                    <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <p>{authError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                        >
                            Email address
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            startContent={
                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            }
                            isInvalid={!!errors.email}
                            errorMessage={errors.email?.message}
                            {...register("email")}
                            className="w-full" classNames={{ input: [ "focus:outline-none" ] }}
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
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
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
                                        setShowPassword((p) => !p)
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
                            className="w-full" classNames={{ input: [ "focus:outline-none" ] }}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label
                            htmlFor="passwordConfirmation"
                            className="text-sm font-medium text-gray-700"
                        >
                            Confirm password
                        </label>
                        <Input
                            id="passwordConfirmation"
                            type={
                                showConfirmPassword ? "text" : "password"
                            }
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
                                        setShowConfirmPassword((p) => !p)
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>
                            }
                            isInvalid={!!errors.passwordConfirmation}
                            errorMessage={
                                errors.passwordConfirmation?.message
                            }
                            {...register("passwordConfirmation")}
                            className="w-full" classNames={{ input: [ "focus:outline-none" ] }}
                        />
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <p>
                            By signing up, you agree to our Terms of Service and
                            Privacy Policy
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm"
                        isLoading={isSubmitting}
                    >
                        {isSubmitting
                            ? "Creating account..."
                            : "Create Account"}
                    </Button>
                </form>
            </CardBody>

            <Divider />

            <CardFooter className="flex justify-center py-6">
                <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href="/sign-in"
                        className="font-medium text-blue-600 hover:text-blue-700"
                    >
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
