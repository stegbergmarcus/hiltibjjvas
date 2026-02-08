'use client';

import { useState } from 'react';
import { Search, Play, Calendar, Youtube } from 'lucide-react';
import Link from 'next/link';
import { Video } from '@/types';

interface VideoGridProps {
    videos: Video[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredVideos = videos.filter((video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    placeholder="Sök videos..."
                    className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl leading-5 bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm backdrop-blur-sm transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredVideos.map((video) => (
                        <Link
                            key={video.id}
                            href={`/video/${video.id}`}
                            className="group cursor-pointer rounded-2xl bg-white/5 border border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-red-500/10 hover:border-white/10 hover:-translate-y-1 transition-all flex flex-col h-full"
                        >
                            <div className="aspect-video bg-black/50 relative overflow-hidden">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                                    <div className="bg-red-600 text-white p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                        <Play size={24} fill="white" className="ml-1" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="text-white font-bold line-clamp-2 mb-2 group-hover:text-red-400 transition-colors">
                                    {video.title}
                                </h3>
                                <div className="mt-auto flex items-center gap-2 text-xs text-slate-400">
                                    <Calendar size={12} />
                                    <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-slate-500">
                    Inga videos matchade din sökning.
                </div>
            )}
        </div>
    );
}
