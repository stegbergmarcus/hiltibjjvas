import { getSavedVideos } from "@/lib/youtube";
import { Video as VideoData } from "@/types";
import { Youtube, ArrowLeft, Video, Folder, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import VideoGrid from "@/components/VideoGrid";

// Mock data for static collections (should be shared or in a DB ideally)
const STATIC_COLLECTIONS = [
    {
        id: "1",
        title: "Grundkurs (Vårtermin)",
        description: "Alla tekniker från terminens grundkurs.",
    },
    {
        id: "2",
        title: "Tävlingsträning",
        description: "Avancerade tekniker och sparringkoncept.",
    },
    {
        id: "3",
        title: "No-Gi Essentials",
        description: "De viktigaste teknikerna för grappling utan dräkt.",
    },
    {
        id: "4",
        title: "Leglock Game",
        description: "Systematisk attack av benlås.",
    },
];

export default async function CollectionDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    let title = "";
    let description = "";
    let videos: VideoData[] = [];
    let isYoutube = false;

    const allVideos = await getSavedVideos();

    if (id === "all") {
        videos = allVideos;
        title = "Alla Pass";
        description = "Hela arkivet från klubben.";
        isYoutube = true;
    } else {
        // Dynamic lookup based on collections OR tags
        videos = allVideos.filter(v =>
            v.collections?.some(c => c.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id) ||
            v.tags?.some(t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id)
        );

        if (videos.length > 0) {
            isYoutube = true;
            // Get the proper title from the first video's collection list OR tags list
            const collectionTitle = videos[0].collections?.find(c =>
                c.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id
            ) || videos[0].tags?.find(t =>
                t.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id
            );

            title = collectionTitle || id;
            if (title === id) title = title.charAt(0).toUpperCase() + title.slice(1);

            description = `Samling med ${videos.length} videos.`;

            // Custom descriptions based on keywords
            if (title.includes("Måndag")) description = "Pass körda på måndagar.";
            else if (title.includes("Tisdag")) description = "Pass körda på tisdagar.";
            else if (title.includes("Onsdag")) description = "Pass körda på onsdagar.";
            else if (title.includes("Torsdag")) description = "Pass körda på torsdagar.";
            else if (title.includes("Fredag")) description = "Pass körda på fredagar.";
            else if (title.includes("Lördag")) description = "Pass körda på lördagar.";
            else if (title.includes("Söndag")) description = "Pass körda på söndagar.";
            else if (title.includes("Gi") && !title.includes("No")) description = "Tekniker och sparring med dräkt.";
            else if (title.includes("No-Gi")) description = "Grappling utan dräkt (Submission Wrestling).";
            else if (title.includes("Grund")) description = "Grundkursens tekniker.";
            else if (!collectionTitle && videos[0].tags?.some(t => t === title)) description = `Videos taggade med "${title}"`;
        }
    }

    if (!isYoutube) {
        const collection = STATIC_COLLECTIONS.find((c) => c.id === id);
        if (collection) {
            title = collection.title;
            description = collection.description;
        } else {
            // Not found in static either
            title = "Okänd Samling";
        }
    }

    return (
        <main className="p-4 lg:p-8 space-y-8 pb-24 lg:pb-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-6 mb-8">
                    <Link
                        href="/collections"
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Tillbaka till samlingar</span>
                    </Link>

                    <div className="flex items-start gap-4">
                        <div className={`p-4 rounded-2xl border ${isYoutube ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
                            {isYoutube ? <Video size={32} /> : <Folder size={32} />}
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold text-white">{title}</h1>
                            <p className="text-slate-400 text-lg">{description}</p>
                        </div>
                    </div>
                </div>

                {/* Video Grid */}
                {videos.length > 0 ? (
                    <VideoGrid videos={videos} />
                ) : (
                    <div className="rounded-3xl bg-white/5 border border-white/5 p-12 text-center">
                        <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Video size={32} className="text-slate-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Inga videos här än</h3>
                        <p className="text-slate-400">Den här samlingen är tom just nu.</p>
                        {!isYoutube && (
                            <p className="text-slate-500 text-sm mt-4">Detta är en platshållare för statiska samlingar.</p>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
