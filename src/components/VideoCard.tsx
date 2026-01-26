import { Play, Calendar, User } from "lucide-react";
import Link from "next/link";

interface VideoCardProps {
    id: string;
    title: string;
    thumbnailUrl?: string; // Optional for now
    date: string;
    duration: string;
    instructor: string;
    tags: string[];
}

export function VideoCard({ id, title, date, duration, instructor, tags }: VideoCardProps) {
    return (
        <Link href={`/video/${id}`} className="group relative flex flex-col bg-white/5 rounded-2xl overflow-hidden border border-white/5 shadow-sm hover:shadow-2xl hover:shadow-black/50 hover:border-white/10 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
            {/* Thumbnail Container */}
            <div className="relative aspect-video w-full overflow-hidden bg-white/5 text-slate-700">
                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    {/* Placeholder gradient when no image */}
                    <span className="sr-only">{title}</span>
                    <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10"></div>
                </div>

                {/* Overlay Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                    <div className="h-12 w-12 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all">
                        <Play size={20} className="fill-white text-white ml-1" />
                    </div>
                </div>

                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white border border-white/10">
                    {duration}
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4 space-y-3">
                <div className="space-y-1">
                    <h3 className="font-bold text-slate-100 line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                            <User size={12} /> {instructor}
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{date}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                            {tag}
                        </span>
                    ))}
                    {tags.length > 2 && (
                        <span className="text-[10px] font-medium px-2 py-1 rounded-md bg-white/5 text-slate-500 border border-white/5">
                            +{tags.length - 2}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
