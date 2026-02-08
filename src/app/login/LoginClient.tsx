"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function LoginClient() {
    const { user, loading, signInWithGoogle } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push("/profile");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
            </div>
        );
    }

    return (
        <main className="flex min-h-[80vh] flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 rounded-3xl bg-white/5 p-8 border border-white/10 backdrop-blur-xl shadow-2xl text-center">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-white tracking-tighter">
                        HILTI <span className="text-indigo-400 font-light">BJJ</span>
                    </h1>
                    <p className="text-slate-400">Logga in för att spara dina favoriter och följa din utveckling.</p>
                </div>

                <button
                    onClick={signInWithGoogle}
                    className="w-full group relative flex items-center justify-center gap-3 bg-white text-slate-900 px-6 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95 shadow-lg shadow-white/5"
                >
                    <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5 opacity-80"
                    />
                    <span>Logga in med Google</span>
                </button>

                <p className="text-xs text-slate-600">
                    Genom att logga in godkänner du att vi sparar din e-postadress för att identifiera dig.
                </p>
            </div>
        </main>
    );
}
