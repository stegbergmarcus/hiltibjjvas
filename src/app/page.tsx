import { VideoCard } from "@/components/VideoCard";
import { CalendarFilter } from "@/components/CalendarFilter";
import { getVideosWithAutoSync } from "@/lib/youtube";
import { Video } from "lucide-react";
import { Video as VideoData } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q.toLowerCase() : "";
  const dateResult = typeof resolvedParams.date === 'string' ? resolvedParams.date : undefined;

  let youtubeVideos: VideoData[] = [];
  try {
    youtubeVideos = await getVideosWithAutoSync();
  } catch (error) {
    console.error("Failed to fetch videos for Home page:", error);
  }

  // Normalize YouTube videos to match the data structure
  const normalizedYoutubeVideos = youtubeVideos.map(v => ({
    id: v.id,
    title: v.title,
    date: (() => {
      try {
        return v.publishedAt ? new Date(v.publishedAt).toISOString().split('T')[0] : "";
      } catch (e) {
        return "";
      }
    })(),
    duration: "YouTube",
    instructor: "Hilti BJJ",
    tags: [...(v.collections || []), ...(v.tags || [])],
    thumbnailUrl: v.thumbnail
  }));

  const filteredVideos = normalizedYoutubeVideos.filter((video) => {
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
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Video size={20} />
            <h2 className="text-xl font-bold text-white">Nyligen Uppladdat</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
