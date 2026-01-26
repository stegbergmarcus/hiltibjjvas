"use client";

import { Home, Search, Layers, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/", label: "Hem", icon: Home },
        { href: "/search", label: "Sök", icon: Search },
        { href: "/collections", label: "Samlingar", icon: Layers },
        { href: "/profile", label: "Profil", icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background pb-safe">
            <div className="flex h-16 items-center justify-around max-w-md mx-auto w-full">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
