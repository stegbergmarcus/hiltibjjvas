"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Home, Search, Layers, User, Calendar as CalendarIcon, LogOut, Settings } from "lucide-react";
import { CalendarWidget } from "./CalendarWidget";
import { format } from "date-fns";
import { clsx } from "clsx";

interface SidebarProps {
    activeDates?: string[];
}

export function Sidebar({ activeDates = [] }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentDate = searchParams.get("date") ? new Date(searchParams.get("date")!) : undefined;
    const currentQuery = searchParams.get("q") || "";

    const handleDateSelect = (date: Date | undefined) => {
        const params = new URLSearchParams(searchParams.toString());
        if (date) {
            params.set("date", format(date, "yyyy-MM-dd"));
        } else {
            params.delete("date");
        }
        router.push(`/?${params.toString()}`);
    };

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        router.push(`/?${params.toString()}`);
    };

    const navItems = [
        { href: "/", label: "Hem", icon: Home },
        { href: "/collections", label: "Samlingar", icon: Layers },
        { href: "/profile", label: "Profil", icon: User },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-80 h-screen sticky top-0 border-r border-white/5 bg-[#020617]/50 backdrop-blur-2xl p-5 gap-6 z-20 shadow-xl">
            {/* Brand */}
            <div className="flex items-center gap-2 px-2 mb-4">
                <Link href="/" className="flex items-baseline gap-1 group">
                    <span className="font-black text-2xl tracking-tighter text-white group-hover:text-indigo-200 transition-colors">HILTI</span>
                    <span className="font-light text-2xl tracking-tight text-indigo-400">BJJ</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 ml-0.5 animate-pulse"></div>
                </Link>
            </div>

            {/* Global Search Input */}
            <div className="relative px-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Sök teknik..."
                    defaultValue={currentQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all shadow-sm"
                />
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
                <span className="text-[11px] font-bold text-slate-500 px-3 uppercase tracking-wider mb-1">Meny</span>
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href && href !== "/" ? true : pathname === href && !currentQuery && !currentDate;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95",
                                isActive
                                    ? "bg-white/10 text-indigo-400 shadow-md shadow-black/20 ring-1 ring-white/5"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon
                                size={20}
                                className={clsx(
                                    "transition-colors duration-200",
                                    isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-white"
                                )}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className={clsx("transition-colors", !isActive && "group-hover:text-white")}>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Calendar Widget */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Filtrera Datum</span>
                    {currentDate && (
                        <button onClick={() => handleDateSelect(undefined)} className="text-xs text-indigo-400 font-semibold hover:underline">
                            Rensa
                        </button>
                    )}
                </div>
                {/* Custom Calendar Widget with glass effect */}
                <div className="bg-white/5 rounded-3xl p-1 border border-white/5 shadow-inner">
                    <CalendarWidget selected={currentDate} onSelect={handleDateSelect} activeDates={activeDates} />
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-white/5 space-y-1">
                <Link href="/admin" className={clsx(
                    "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 hover:bg-white/5 text-slate-400 hover:text-white",
                    pathname === "/admin" && "bg-white/5 text-indigo-400"
                )}>
                    <Settings size={18} className="group-hover:text-white transition-colors" />
                    <span className="group-hover:text-white transition-colors">Inställningar</span>
                </Link>
                <button className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 active:scale-95 hover:bg-white/5 text-slate-400 hover:text-white w-full text-left">
                    <LogOut size={18} className="group-hover:text-white transition-colors" />
                    <span className="group-hover:text-white transition-colors">Logga ut</span>
                </button>
            </div>
        </aside>
    );
}
