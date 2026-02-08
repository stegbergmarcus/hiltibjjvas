/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle, Youtube, AlertCircle, Video } from "lucide-react";
import { syncYoutubeVideos } from "../actions";
import { Video as VideoData } from "@/types";

export const dynamic = "force-dynamic";

export default function AdminPage() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState("Aldrig");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [syncResult, setSyncResult] = useState<{ count: number, videos: VideoData[] } | null>(null);

    const handleSync = async () => {
        setIsSyncing(true);
        setStatus("idle");
        setSyncResult(null);

        try {
            const result = await syncYoutubeVideos();
            if (result.success) {
                setLastSynced(new Date().toLocaleString("sv-SE"));
                setStatus("success");
                setSyncResult({ count: result.count || 0, videos: result.videos || [] });
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <main className="p-4 lg:p-8 space-y-8 pb-24 lg:pb-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
                <p className="text-slate-400">Hantera integrationer och innehåll.</p>
            </div>

            {/* YouTube Integration Card */}
            <div className="rounded-3xl bg-white/5 border border-white/5 shadow-xl shadow-black/20 overflow-hidden backdrop-blur-sm">
                <div className="p-6 lg:p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 text-red-500">
                            <Youtube size={32} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold text-white">YouTube Sync</h2>
                            <p className="text-slate-400 text-sm max-w-md">
                                Systemet hämtar <strong>senaste videos</strong> från kanalen &quot;Hilti BJJ&quot; via RSS.
                                Inga API-nycklar behövs för denna test.
                            </p>
                            <div className="flex items-center gap-2 pt-2">
                                <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                                <span className="text-xs font-medium text-green-400">RSS-feed aktiv</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                    >
                        <RefreshCw size={20} className={isSyncing ? "animate-spin" : ""} />
                        {isSyncing ? "Synkar..." : "Synka Nu"}
                    </button>
                </div>

                <div className="bg-black/20 p-6 lg:p-8">
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-6">
                        <span>Senast synkad: {lastSynced}</span>
                        <span>Metod: <span className="text-green-500">RSS</span></span>
                    </div>

                    {status === "success" && syncResult && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <CheckCircle className="text-green-500" size={20} />
                            <span className="text-green-500 font-medium">Hittade {syncResult.count} videos! De ligger nu i biblioteket.</span>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="text-red-500" size={20} />
                            <span className="text-red-500 font-medium">Något gick fel vid synkroniseringen.</span>
                        </div>
                    )}

                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">logg</h3>
                    <div className="space-y-3">
                        {status === "success" && syncResult?.videos.map((video) => (
                            <div key={video.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5 shadow-sm">
                                <Video size={16} className="text-slate-400" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{video.title}</p>
                                    <p className="text-xs text-slate-500">ID: {video.id} • {new Date(video.publishedAt).toLocaleDateString()}</p>
                                </div>
                                <span className="text-xs font-mono text-slate-500">Just nu</span>
                            </div>
                        ))}

                        {status !== "success" && (
                            <div className="flex items-center gap-4 p-3 rounded-lg border border-transparent opacity-50">
                                <Video size={16} className="text-slate-500" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-500 truncate">Inga videos synkade än</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
