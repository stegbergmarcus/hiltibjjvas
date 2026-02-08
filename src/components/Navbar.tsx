"use client";

import { Link as LinkIcon, Menu, Search, User as UserIcon, X, LogIn } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navItems = [
        { href: "/", label: "Hem" },
        { href: "/collections", label: "Samlingar" },
        { href: "/profile", label: "Profil" },
    ];

    const currentQuery = searchParams.get("q") || "";

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        router.push(`/?${params.toString()}`);
    };

    return (
        <>
            <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl lg:hidden">
                <div className="flex h-16 items-center justify-between px-4">
                    {/* Hamburger */}
                    <button onClick={toggleMenu} className="text-slate-400 hover:text-white">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex items-baseline gap-1">
                        <span className="font-black text-xl tracking-tighter text-white">HILTI</span>
                        <span className="font-light text-xl tracking-tight text-indigo-400">BJJ</span>
                    </Link>

                    {/* User Profile / Login */}
                    {user ? (
                        <Link href="/profile">
                            <div className="h-8 w-8 rounded-full overflow-hidden border border-white/10">
                                <img
                                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`}
                                    alt="User"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <UserIcon size={24} className="text-slate-400" />
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="fixed inset-0 z-50 bg-[#020617] pt-20 px-6 animate-in slide-in-from-top-10 duration-200">
                        {/* Search in Menu */}
                        <div className="relative mb-8">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Sök teknik..."
                                defaultValue={currentQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>

                        <ul className="space-y-4">
                            {navItems.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={toggleMenu}
                                        className={clsx(
                                            "text-2xl font-bold tracking-tight block py-2",
                                            pathname === item.href
                                                ? "text-indigo-400"
                                                : "text-slate-400 hover:text-white"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                            {!user && (
                                <li>
                                    <Link
                                        href="/login"
                                        onClick={toggleMenu}
                                        className="text-2xl font-bold tracking-tight block py-2 text-slate-400 hover:text-white"
                                    >
                                        Logga In
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </nav>
        </>
    );
}
