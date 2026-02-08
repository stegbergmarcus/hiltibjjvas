import Link from "next/link";
import { Home } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center p-4">
            <h2 className="text-4xl font-black text-white">404</h2>
            <p className="text-slate-400 max-w-md">
                Hoppsan! Sidan du letar efter verkar ha gått vilse på mattan.
            </p>
            <Link
                href="/"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full font-bold transition-all"
            >
                <Home size={20} />
                <span>Gå till startsidan</span>
            </Link>
        </div>
    );
}
