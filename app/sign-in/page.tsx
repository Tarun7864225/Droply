import SignInForm from "@/components/SignInForm";
import Navbar from "@/components/Navbar";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex justify-center items-center p-6">
                <SignInForm />
            </main>
            <footer className="bg-gray-900 text-white py-4">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} Droply. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}