import { VideoCard } from "@/components/VideoCard";
import { CalendarFilter } from "@/components/CalendarFilter";

// Mock Data
const MOCK_VIDEOS = [
  {
    id: "1",
    title: "Armbar från Guard (Grund)",
    date: "2023-10-24",
    duration: "04:20",
    instructor: "Pelle",
    tags: ["Armbar", "Closed Guard", "Gi"],
  },
  {
    id: "2",
    title: "Triangle framifrån (Detaljer)",
    date: "2023-10-24",
    duration: "06:15",
    instructor: "Pelle",
    tags: ["Triangle", "Closed Guard", "Gi"],
  },
  {
    id: "3",
    title: "De la Riva sweep till mount",
    date: "2023-10-22",
    duration: "03:45",
    instructor: "Lisa",
    tags: ["Sweep", "Open Guard", "No-Gi"],
  },
  {
    id: "4",
    title: "Kimura från Side Control",
    date: "2023-10-20",
    duration: "05:00",
    instructor: "Kalle",
    tags: ["Kimura", "Side Control", "Submission"],
  },
  {
    id: "5",
    title: "Ryggtagning från Turtle",
    date: "2023-10-18",
    duration: "07:30",
    instructor: "David",
    tags: ["Back Take", "Turtle", "No-Gi"],
  },
  {
    id: "6",
    title: "Armbar från Mount",
    date: "2023-10-18",
    duration: "04:10",
    instructor: "David",
    tags: ["Submission", "Mount", "Gi"],
  },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q.toLowerCase() : "";
  const dateResult = typeof resolvedParams.date === 'string' ? resolvedParams.date : undefined;

  const filteredVideos = MOCK_VIDEOS.filter((video) => {
    const matchesQuery = !q ||
      video.title.toLowerCase().includes(q) ||
      video.tags.some(tag => tag.toLowerCase().includes(q)) ||
      video.instructor.toLowerCase().includes(q);

    const matchesDate = !dateResult || video.date === dateResult;

    return matchesQuery && matchesDate;
  });

  const isFiltering = q || dateResult;

  return (
    <main className="flex-1 flex flex-col p-4 lg:p-8 w-full pb-24 lg:pb-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
            {isFiltering ? "Sökresultat" : "Senaste passet"}
          </h1>
          {/* Mobile Calendar Filter */}
          <div className="lg:hidden">
            <CalendarFilter />
          </div>
        </div>
        <p className="text-slate-400 hidden lg:block text-lg">
          {isFiltering
            ? `Visar ${filteredVideos.length} träffar ${q ? `för "${q}"` : ""} ${dateResult ? `från ${dateResult}` : ""}`
            : "Här är det senaste vi har tränat på."}
        </p>
      </div>

      {filteredVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <p className="text-lg font-medium">Inga videos hittades.</p>
          <p className="text-sm">Prova att söka på något annat eller byt datum.</p>
        </div>
      ) : isFiltering ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      ) : (
        <>
          {/* Default View: Latest Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredVideos.slice(0, 2).map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>

          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-white/5 backdrop-blur-md px-4 py-1 rounded-full text-slate-400 font-bold border border-white/5">Tidigare</span>
            </div>
          </div>

          {/* Previous Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredVideos.slice(2).map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
