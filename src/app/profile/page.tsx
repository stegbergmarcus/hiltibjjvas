"use client";

import { User, Settings, Award, History, Heart, LogOut, Loader2, LogIn } from "lucide-react";
import { VideoCard } from "@/components/VideoCard";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Video } from "@/types";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        trainings: 0,
        saved: 0,
        competitions: 0,
        attendance: 0
    });
    const [savedVideos, setSavedVideos] = useState<Video[]>([]);
    const [fetchingData, setFetchingData] = useState(true);

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    useEffect(() => {
        async function fetchUserData() {
            if (!user) return;
            setFetchingData(true);
            try {
                // Fetch user stats from 'users/{uid}'
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setStats({
                        trainings: data.trainings || 0,
                        saved: data.favorites?.length || 0,
                        competitions: data.competitions || 0,
                        attendance: data.attendance || 0
                    });

                    // Here we would ideally fetch the full video objects for the favorites
                    // For now, left empty
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setFetchingData(false);
            }
        }

        if (!loading && user) {
            fetchUserData();
        }
    }, [user, loading]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
        );
    }

    if (!user) {
        return (
            <main className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center p-4">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Logga in för att se din profil</h2>
                    <p className="text-slate-400">Du behöver vara inloggad för att se statistik och favoriter.</p>
                </div>
                <Link
                    href="/login"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                    <LogIn size={20} />
                    Gå till Inloggning
                </Link>
            </main>
        );
    }

    return (
        <main className="p-4 lg:p-8 space-y-8 pb-24 lg:pb-8">
            {/* Profile Header */}
            <div className="relative rounded-3xl bg-white/5 border border-white/5 p-6 lg:p-10 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 flex gap-2 z-20">
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2"
                        title="Logga ut"
                    >
                        <LogOut size={20} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                        <Settings size={20} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 z-10 relative">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl ring-4 ring-white/10 overflow-hidden">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName || "User"} className="h-full w-full object-cover" />
                        ) : (
                            <span>{user.displayName?.charAt(0) || user.email?.charAt(0) || "?"}</span>
                        )}
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-3xl font-bold text-white">{user.displayName || "Användare"}</h1>
                        <p className="text-muted-foreground">{user.email}</p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                            <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/20">Member</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center hover:bg-white/10 transition-colors">
                    <div className="mx-auto bg-green-500/10 text-green-500 p-2 rounded-full w-fit mb-2">
                        <History size={20} />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.trainings}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Träningspass</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center hover:bg-white/10 transition-colors">
                    <div className="mx-auto bg-red-500/10 text-red-500 p-2 rounded-full w-fit mb-2">
                        <Heart size={20} />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.saved}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Sparade</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center hover:bg-white/10 transition-colors">
                    <div className="mx-auto bg-yellow-500/10 text-yellow-500 p-2 rounded-full w-fit mb-2">
                        <Award size={20} />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.competitions}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Tävlingar</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center hover:bg-white/10 transition-colors">
                    <div className="mx-auto bg-blue-500/10 text-blue-500 p-2 rounded-full w-fit mb-2">
                        <User size={20} />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.attendance}%</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Närvaro</div>
                </div>
            </div>

            {/* Saved Videos Content */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Heart size={20} className="text-red-500 fill-red-500" />
                    Sparade Videos
                </h2>

                {savedVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                        {savedVideos.map((video) => (
                            <VideoCard
                                key={video.id}
                                id={video.id}
                                title={video.title}
                                thumbnailUrl={video.thumbnail}
                                date={video.publishedAt ? new Date(video.publishedAt).toISOString().split('T')[0] : "Okänt datum"}
                                duration="YouTube"
                                instructor="Hilti"
                                tags={[]}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/5">
                        <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                            <Heart size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-white">Inga sparade videos</h3>
                        <p className="text-slate-400 max-w-sm mx-auto mt-2">Du har inte sparat några klipp än. Klicka på hjärtat på ett klipp för att spara det här.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
