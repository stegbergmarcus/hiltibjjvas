import { Search } from "lucide-react";
import Link from "next/link";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4 max-w-md mx-auto w-full gap-4">
                <Link href="/" className="font-bold text-xl tracking-tighter text-primary">
                    HILTI BJJ
                </Link>
                <div className="flex-1 relative">
                    {/* Placeholder for future global search or just a visual indicator */}
                    <div className="bg-muted text-muted-foreground px-3 py-2 rounded-full text-sm flex items-center gap-2">
                        <Search size={16} />
                        <span>Sök teknik...</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
