import { Layers, Folder, ChevronRight, Youtube } from "lucide-react";
import { getSavedVideos } from "@/lib/youtube";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
    const youtubeVideos = await getSavedVideos();

    // Dynamic Collections based on Tags
    const collectionMap = new Map<string, { id: string, title: string, count: number, color: string }>();

    youtubeVideos.forEach(video => {
        if (video.collections) {
            video.collections.forEach(collectionTitle => {
                const id = collectionTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                if (!collectionMap.has(id)) {
                    // Assign a color based on the title keywords or random
                    let color = "bg-slate-500/10 text-slate-500 border-slate-500/20";

                    if (collectionTitle.includes("Måndag")) color = "bg-green-500/10 text-green-500 border-green-500/20";
                    else if (collectionTitle.includes("Tisdag")) color = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                    else if (collectionTitle.includes("Onsdag")) color = "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
                    else if (collectionTitle.includes("Torsdag")) color = "bg-teal-500/10 text-teal-500 border-teal-500/20";
                    else if (collectionTitle.includes("Fredag")) color = "bg-sky-500/10 text-sky-500 border-sky-500/20";
                    else if (collectionTitle.includes("Lördag")) color = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
                    else if (collectionTitle.includes("Söndag")) color = "bg-red-500/10 text-red-500 border-red-500/20";

                    else if (collectionTitle.includes("No-Gi")) color = "bg-orange-500/10 text-orange-500 border-orange-500/20";
                    else if (collectionTitle.includes("Gi")) color = "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
                    else if (collectionTitle.includes("Seminarier")) color = "bg-purple-500/10 text-purple-500 border-purple-500/20";

                    collectionMap.set(id, {
                        id,
                        title: collectionTitle,
                        count: 0,
                        color
                    });
                }

                const collection = collectionMap.get(id)!;
                collection.count++;
            });
        }
    });

    const collections = Array.from(collectionMap.values());

    // Add "Alla Pass" at the end or beginning? Currently beginning in code, let's keep it consistent.
    if (youtubeVideos.length > 0) {
        collections.unshift({
            id: "all",
            title: "Alla Pass",
            count: youtubeVideos.length,
            color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        });
    }

    return (
        <main className="p-4 lg:p-8 space-y-8 pb-24 lg:pb-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-white">Samlingar</h1>
                <p className="text-slate-400">Utforska våra curerade spellistor och serier.</p>
            </div>

            {collections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                    <Layers size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium">Inga samlingar än.</p>
                    <p className="text-sm">Ladda upp videos för att skapa automatiska samlingar.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((collection) => (
                        <Link
                            key={collection.id}
                            href={`/collections/${collection.id}`}
                            className="group cursor-pointer rounded-2xl bg-white/5 border border-white/5 p-6 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-white/10 hover:-translate-y-1 shadow-sm backdrop-blur-sm block"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl border ${collection.color}`}>
                                    {collection.id === "all" ? <Youtube size={24} /> : <Folder size={24} />}
                                </div>
                                <div className="bg-white/5 rounded-full px-3 py-1 text-xs font-medium text-slate-400 border border-white/5">
                                    {collection.count} videos
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                                {collection.title}
                            </h3>

                            <div className="flex items-center text-sm font-medium text-slate-400 group-hover:text-indigo-400 transition-colors">
                                <span>Visa samling</span>
                                <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
