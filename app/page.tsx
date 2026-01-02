import { Button } from "@heroui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";
import { CloudUpload, Shield, Folder, Image as ImageIcon, ArrowRight, InstagramIcon, TwitterIcon, GithubIcon, Linkedin, } from "lucide-react";
import Navbar from "@/components/Navbar";

export default async function Home() {
    await new Promise(res => setTimeout(res, 3000))
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-20 md:py-15 px-4 md:px-6 bg-white">
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                            Store your <span className="text-blue-600">images</span> and <span className="text-blue-600">files</span> securely
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600">
                            Simple. Secure. Fast. Access your files anywhere, anytime, on any device.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-6 justify-center lg:justify-start">
                            <SignedOut>
                                <Link href="/sign-up">
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow transition-all">
                                        Get Started
                                    </Button>
                                </Link>
                                <Link href="/sign-in">
                                    <Button size="lg" className="text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 transition-all">
                                        Sign In
                                    </Button>
                                </Link>
                            </SignedOut>
                            <SignedIn>
                                <Link href="/dashboard">
                                    <Button
                                        size="lg"
                                        className="bg-blue-600 hover:bg-blue-700 text-white shadow transition-all"
                                        endContent={<ArrowRight className="h-4 w-4" />}
                                    >
                                        Go to Dashboard
                                    </Button>
                                </Link>
                            </SignedIn>
                        </div>

                        <p className="mt-6 text-gray-500 max-w-md mx-auto lg:mx-0">
                            Droply is built for professionals. Store images, documents, and files in a secure cloud environment with ease and reliability.
                        </p>
                    </div>

                    <div className="flex justify-center">
                            <div className="inset-0 flex items-center justify-center">
                                <img src="./one.png" alt="two" width={400} className=" shadow-md" />
                            </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 md:py-28 px-4 md:px-6 bg-gray-50">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Droply?</h2>
                        <p className="text-gray-600 max-w-xl mx-auto text-lg md:text-xl">
                            Droply makes file management effortless. Upload, organize, and access your images and documents securely and quickly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        <Card className="bg-white shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 rounded-lg">
                            <CardBody className="p-6 text-center">
                                <CloudUpload className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Quick Uploads</h3>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Drag, drop, and you’re done. Upload multiple files quickly.
                                </p>
                            </CardBody>
                        </Card>

                        <Card className="bg-white shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 rounded-lg">
                            <CardBody className="p-6 text-center">
                                <Folder className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Smart Organization</h3>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Automatically categorize and find files in seconds.
                                </p>
                            </CardBody>
                        </Card>

                        <Card className="bg-white shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1 rounded-lg">
                            <CardBody className="p-6 text-center">
                                <Shield className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">Locked Down</h3>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Files are encrypted and private. Only you can access them.
                                </p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-28 px-4 md:px-6 bg-white border-t border-gray-200">
                <div className="container mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Ready to simplify your file storage?</h2>
                    <p className="text-gray-600 max-w-lg mx-auto mb-8 text-lg md:text-xl">
                        Join thousands of users who trust Droply to store and organize their files efficiently.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <SignedOut>
                            <Link href="/sign-up">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow transition-all" endContent={<ArrowRight className="h-4 w-4" />}>
                                    Let's Go
                                </Button>
                            </Link>
                        </SignedOut>
                        <SignedIn>
                            <Link href="/dashboard">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow transition-all" endContent={<ArrowRight className="h-4 w-4" />}>
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </SignedIn>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-200 py-16">
                <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-2">
                            <CloudUpload className="h-6 w-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-white">Droply</h2>
                        </div>
                        <p className="max-w-xs text-center md:text-left text-gray-400">
                            Securely store and manage your files and images, accessible anywhere.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <h3 className="font-semibold mb-2 text-white">Quick Links</h3>
                        <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
                        <Link href="/sign-in" className="hover:text-blue-600 transition-colors">Sign In</Link>
                        <Link href="/sign-up" className="hover:text-blue-600 transition-colors">Sign Up</Link>
                    </div>

                    <div className="flex flex-col gap-2 text-center md:text-left">
                        <h3 className="font-semibold mb-2 text-white">Get in Touch</h3>
                        <p>support@droply.com</p>
                        <div className="flex gap-4 mt-2 justify-center md:justify-start">
                            <InstagramIcon className="h-6 w-6 hover:text-blue-600 transition-colors" />
                            <Linkedin className="h-6 w-6 hover:text-blue-600 transition-colors" />
                            <TwitterIcon className="h-6 w-6 hover:text-blue-600 transition-colors" />
                            <GithubIcon className="h-6 w-6 hover:text-blue-600 transition-colors" />
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} Droply. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
