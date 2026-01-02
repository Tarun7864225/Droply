"use client";

import { useClerk, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { CloudUpload, ChevronDown, User, Menu, X } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { useState, useEffect, useRef } from "react";

interface SerializedUser {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string | null;
    username?: string | null;
    emailAddress?: string | null;
}

interface NavbarProps {
    user?: SerializedUser | null;
}

export default function Navbar({ user }: NavbarProps) {
    const { signOut } = useClerk();
    const router = useRouter();
    const pathname = usePathname();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const isOnDashboard = pathname === "/dashboard" || pathname?.startsWith("/dashboard/");

    /* Scroll shadow */
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 8);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* Close mobile menu on resize */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768)  setIsMobileMenuOpen(false);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /* Body scroll lock */
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    /* Click outside mobile menu */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if ( isMobileMenuOpen && mobileMenuRef.current &&!mobileMenuRef.current.contains(event.target as Node) ) {
                const target = event.target as HTMLElement;
                if (!target.closest('[data-menu-button="true"]')) setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileMenuOpen]);

    const userDetails = {
        initials: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim().split(" ").map((n) => n[0]).join("").toUpperCase() || "U": "U",
        displayName:user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || user?.username || user?.emailAddress || "User",
        email: user?.emailAddress || "",
    };

    return (
        <header className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow ${isScrolled ? "shadow-sm" : "" }`} >
            <div className="container mx-auto px-4 md:px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <CloudUpload className="h-6 w-6 text-blue-600" />
                        <span className="text-xl font-semibold text-gray-900">
                            Droply
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        <SignedOut>
                            <Button className="text-gray-700 hover:text-blue-600" onClick={() => router.push("/sign-in")}>
                                Sign In
                            </Button>
                            <Button className="bg-blue-600 text-white py-2 hover:bg-blue-700" onClick={() => router.push("/sign-up")}>
                                Get Started
                            </Button>
                        </SignedOut>

                        <SignedIn>
                            <Dropdown placement="top-end">
                                <DropdownTrigger>
                                    <Button className="flex items-center gap-2 px-2 hover:bg-gray-100" endContent={<ChevronDown className="h-4 w-4 text-gray-500" />}>
                                        <Avatar name={userDetails.initials} src={user?.imageUrl || undefined} className="h-6 w-6" fallback={<User className="h-6 w-6" />} />
                                        <span className="hidden sm:inline text-sm text-gray-700">
                                            {userDetails.displayName}
                                        </span>
                                    </Button>
                                </DropdownTrigger>

                                <DropdownMenu className="w-44 bg-white border border-gray-200 shadow-lg rounded-md text-black">
                                    <DropdownItem key="profile" className="pt-2" onClick={() => router.push("/dashboard?tab=profile")} >
                                        Profile
                                    </DropdownItem>
                                    {!isOnDashboard ? (
                                        <DropdownItem key="dashboard" className="pt-2" onClick={() => router.push("/dashboard") } >
                                            Dashboard
                                        </DropdownItem>
                                    ) : null }
                                    <DropdownItem key="files" className="pt-2" onClick={() => router.push("/dashboard")}>
                                        My Files
                                    </DropdownItem>
                                    <DropdownItem key="logout" className="text-red-600 py-2" onClick={() => signOut(() => router.push("/"))}>
                                        Sign Out
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </SignedIn>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        data-menu-button="true"
                        className="md:hidden p-2 rounded-md hover:bg-gray-100"
                        onClick={() =>setIsMobileMenuOpen((prev) => !prev)}>
                        {isMobileMenuOpen ? ( <X className="h-6 w-6 text-gray-700" /> ) : ( <Menu className="h-6 w-6 text-gray-700" />)}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div ref={mobileMenuRef} className={`fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-xl transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`} >
                <div className="p-6 space-y-6">
                    <SignedOut>
                        <Button fullWidth onClick={() => router.push("/sign-in")} >
                            Sign In
                        </Button>
                        <Button fullWidth className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => router.push("/sign-up")}>
                            Get Started
                        </Button>
                    </SignedOut>

                    <SignedIn>
                        <div className="border-b pb-4">
                            <p className="font-medium text-gray-900">
                                {userDetails.displayName}
                            </p>
                            <p className="text-sm text-gray-500">
                                {userDetails.email}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Link href="/dashboard" className="hover:text-blue-600" >
                                Dashboard
                            </Link>
                            <Link href="/dashboard?tab=profile" className="hover:text-blue-600" >
                                Profile
                            </Link>
                            <button className="text-left text-red-600" onClick={() => signOut(() => router.push("/")) } >
                                Sign Out
                            </button>
                        </div>
                    </SignedIn>
                </div>
            </div>
        </header>
    );
}
