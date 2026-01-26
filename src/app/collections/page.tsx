import { Layers, Folder, ChevronRight } from "lucide-react";

const COLLECTIONS = [
    {
        id: "1",
        title: "Grundkurs (Vårtermin)",
        count: 14,
        color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
        id: "2",
        title: "Tävlingsträning",
        count: 23,
        color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
        id: "3",
        title: "No-Gi Essentials",
        count: 8,
        color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    },
    {
        id: "4",
        title: "Leglock Game",
        count: 5,
        color: "bg-red-500/10 text-red-400 border-red-500/20",
    },
];

export default function CollectionsPage() {
    return (
        <main className="p-4 lg:p-8 space-y-8 pb-24 lg:pb-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold text-white">Samlingar</h1>
                <p className="text-slate-400">Utforska våra curerade spellistor och serier.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {COLLECTIONS.map((collection) => (
                    <div
                        key={collection.id}
                        className="group cursor-pointer rounded-2xl bg-white/5 border border-white/5 p-6 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-white/10 hover:-translate-y-1 shadow-sm backdrop-blur-sm"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl border ${collection.color}`}>
                                <Folder size={24} />
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
                    </div>
                ))}
            </div>
        </main>
    );
}
