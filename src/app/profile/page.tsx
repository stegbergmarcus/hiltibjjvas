import { User, Settings, Award, History, Heart } from "lucide-react";
import { VideoCard } from "@/components/VideoCard";

// Reuse Mock Data for favorites
const FAVORITES = [
    {
        id: "2",
        title: "Triangle framifrån (Detaljer)",
        date: "2023-10-24",
        duration: "06:15",
        instructor: "Pelle",
        tags: ["Triangle", "Closed Guard", "Gi"],
    },
    {
        id: "5",
        title: "Ryggtagning från Turtle",
        date: "2023-10-18",
        duration: "07:30",
        instructor: "David",
        tags: ["Back Take", "Turtle", "No-Gi"],
    },
];

export default function ProfilePage() {
    return (
        <main className="p-4 lg:p-8 space-y-8 pb-24 lg:pb-8">
            {/* Profile Header */}
            <div className="relative rounded-3xl bg-white/5 border border-white/5 p-6 lg:p-10 overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <button className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                        <Settings size={20} />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 z-10 relative">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-white shadow-2xl ring-4 ring-white/10">
                        M
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-3xl font-bold text-white">Marcus</h1>
                        <p className="text-muted-foreground">Blått bälte • Medlem sedan 2021</p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">Competitor</span>
                            <span className="bg-white/5 text-zinc-400 px-3 py-1 rounded-full text-xs font-medium border border-white/10">Gi Specialist</span>
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
                    <div className="text-2xl font-bold text-white">124</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Träningspass</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center hover:bg-white/10 transition-colors">
                    <div className="mx-auto bg-red-500/10 text-red-500 p-2 rounded-full w-fit mb-2">
                        <Heart size={20} />
                    </div>
                    <div className="text-2xl font-bold text-white">28</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Sparade</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center hover:bg-white/10 transition-colors">
                    <div className="mx-auto bg-yellow-500/10 text-yellow-500 p-2 rounded-full w-fit mb-2">
                        <Award size={20} />
                    </div>
                    <div className="text-2xl font-bold text-white">3</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Tävlingar</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-center hover:bg-white/10 transition-colors">
                    <div className="mx-auto bg-blue-500/10 text-blue-500 p-2 rounded-full w-fit mb-2">
                        <User size={20} />
                    </div>
                    <div className="text-2xl font-bold text-white">92%</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Närvaro</div>
                </div>
            </div>

            {/* Saved Videos Content */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Heart size={20} className="text-red-500 fill-red-500" />
                    Sparade Videos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {FAVORITES.map((video) => (
                        <VideoCard key={video.id} {...video} />
                    ))}
                </div>
            </div>
        </main>
    );
}
