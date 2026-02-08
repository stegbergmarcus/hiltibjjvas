import Link from "next/link";
import { ArrowLeft, User, Calendar, Tag, Play } from "lucide-react";
import { VideoCard } from "@/components/VideoCard";
import { getVideoById } from "@/lib/youtube";

export default async function VideoPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    let video = null;

    // Try to find in saved YouTube videos
    const youtubeVideo = await getVideoById(id);
    if (youtubeVideo) {
        video = {
            id: youtubeVideo.id,
            title: youtubeVideo.title,
            date: new Date(youtubeVideo.publishedAt).toISOString().split('T')[0],
            duration: "Video", // Generic placeholder
            instructor: "Hilti BJJ",
            tags: ["Teknik"], // Generic tag
            description: youtubeVideo.title, // Just the title as description for now
            youtubeId: youtubeVideo.id,
        };
    }

    if (!video) {
        // Fallback or 404
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <h2 className="text-xl font-bold mb-2">Video hittades inte</h2>
                <Link href="/" className="text-indigo-400 hover:text-white transition-colors">
                    Gå tillbaka till start
                </Link>
            </div>
        );
    }

    return (
        <main className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
            {/* Main Content (Video + Info) */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium">
                    <ArrowLeft size={20} />
                    <span>Tillbaka</span>
                </Link>

                {/* Video Player Container */}
                <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 group">
                    {video.youtubeId ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&modestbranding=1&rel=0`}
                            title={video.title}
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 hover:bg-white/30 transition-all border border-white/40 shadow-lg">
                                    <Play size={32} className="fill-white text-white ml-1" />
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                <div className="bg-red-600 h-1 w-[40%] rounded-full mb-2 shadow-sm"></div>
                                <div className="flex justify-between text-xs font-medium text-white/90">
                                    <span>{video.duration}</span>
                                    <span>10:00</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Video Details */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                        {video.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                            <User size={16} className="text-indigo-400" />
                            <span>{video.instructor}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                            <Calendar size={16} />
                            <span>{video.date}</span>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold text-white mb-2">Beskrivning</h3>
                        <p className="text-slate-300 leading-relaxed">
                            {video.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {video.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                                    <Tag size={12} />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar (Related Videos) - Scrollable independently */}
            <aside className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/5 bg-[#020617]/50 backdrop-blur-md p-4 lg:p-6 overflow-y-auto">
                <h2 className="text-xl font-bold text-white mb-6">Relaterat</h2>
                <div className="grid gap-6">
                    {/* Placeholder for related videos logic. For now, empty or fetch more */}
                    <p className="text-slate-500 text-sm">Fler klipp kommer snart!</p>
                </div>
            </aside>
        </main>
    );
}
