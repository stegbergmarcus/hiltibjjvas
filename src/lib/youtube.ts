import { db } from './firebase-admin';
import { Video } from '@/types';


// YouTube API Response Interfaces
interface Source {
    url: string;
    width: number;
    height: number;
}

interface Thumbnails {
    default: Source;
    medium: Source;
    high: Source;
    standard?: Source;
    maxres?: Source;
}

interface Snippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Thumbnails;
    channelTitle: string;
    playlistId: string;
    position: number;
    resourceId: {
        kind: string;
        videoId: string;
    };
    videoOwnerChannelTitle: string;
    videoOwnerChannelId: string;
}

interface PlaylistItem {
    kind: string;
    etag: string;
    id: string;
    snippet: Snippet;
}

interface PlaylistResponse {
    kind: string;
    etag: string;
    nextPageToken?: string;
    items: PlaylistItem[];
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
}

// Constants
const SYNC_COOLDOWN_MS = 1000 * 60 * 60; // 1 hour

const COLLECTION_TAGS: Record<string, string> = {
    'måndag': 'Måndagspass',
    'tisdag': 'Tisdagspass',
    'onsdag': 'Onsdagspass',
    'torsdag': 'Torsdagspass',
    'fredag': 'Fredagspass',
    'lördag': 'Lördagspass',
    'söndag': 'Söndagspass',
    'gi': 'Gi (Dräkt)',
    'nogi': 'No-Gi',
    'no-gi': 'No-Gi',
    'seminarium': 'Seminarier',
};

export async function fetchChannelVideos(): Promise<Video[]> {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID;

    if (!API_KEY || !PLAYLIST_ID || API_KEY.startsWith("dummy") || PLAYLIST_ID.startsWith("dummy")) {
        console.warn("YouTube API Key or Playlist ID missing or invalid (dummy). Skipping fetch.");
        return [];
    }

    let videos: Video[] = [];
    let nextPageToken: string | undefined = undefined;

    try {
        do {
            const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
            url.searchParams.append('part', 'snippet');
            url.searchParams.append('playlistId', PLAYLIST_ID);
            url.searchParams.append('maxResults', '50');
            url.searchParams.append('key', API_KEY);

            if (nextPageToken) {
                url.searchParams.append('pageToken', nextPageToken);
            }

            const response = await fetch(url.toString(), { cache: 'no-store' }); // Don't cache API calls during sync

            if (!response.ok) {
                // console.error(`YouTube API Error: ${response.status} ${response.statusText}`, errorText);
                // Fail silently or throw, but for now just log minimal
                throw new Error(`YouTube API Error: ${response.status}`);
            }

            const data: PlaylistResponse = await response.json();

            const pageVideos = data.items.map(item => {
                const rawTitle = item.snippet.title;

                // Parse Title for Tags
                // specific format: "Title, Tag1, Tag2"
                // Strategy: First part is ALWAYS the title. Rest are tags/collections.
                const parts = rawTitle.split(',').map(p => p.trim());

                let finalTitle = parts[0];
                // Capitalize first letter of title
                if (finalTitle) {
                    finalTitle = finalTitle.charAt(0).toUpperCase() + finalTitle.slice(1);
                }

                const collections: string[] = [];
                const tags: string[] = [];

                // Process remaining parts as tags
                for (let i = 1; i < parts.length; i++) {
                    const part = parts[i];
                    if (!part) continue;

                    const lowerPart = part.toLowerCase();

                    // Check if it's a known collection (Day, Gi/NoGi)
                    if (COLLECTION_TAGS[lowerPart]) {
                        collections.push(COLLECTION_TAGS[lowerPart]);
                    } else {
                        // Otherwise it's a content tag (e.g. "Armbar", "Mount")
                        // Capitalize tags nicely
                        const cleanTag = part.charAt(0).toUpperCase() + part.slice(1);
                        tags.push(cleanTag);
                    }
                }

                return {
                    id: item.snippet.resourceId.videoId,
                    title: finalTitle || rawTitle,
                    originalTitle: rawTitle,
                    thumbnail: item.snippet.thumbnails.maxres?.url ||
                        item.snippet.thumbnails.high?.url ||
                        item.snippet.thumbnails.medium?.url ||
                        "",
                    publishedAt: item.snippet.publishedAt,
                    link: `https://youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                    collections: [...new Set(collections)], // Remove duplicates
                    tags: [...new Set(tags)], // Remove duplicates
                };
            });

            // Filter out deleted/private videos
            const validVideos = pageVideos.filter(v => v.title !== "Private video" && v.title !== "Deleted video");

            videos = [...videos, ...validVideos];
            nextPageToken = data.nextPageToken;

        } while (nextPageToken && videos.length < 200);

        return videos;

    } catch (error) {
        console.error('Error fetching YouTube videos via API:', error);
        return [];
    }
}

export async function saveVideos(newVideos: Video[]) {
    try {
        const batch = db.batch();

        newVideos.forEach(video => {
            const docRef = db.collection('videos').doc(video.id);
            batch.set(docRef, video, { merge: true });
        });

        // Update sync timestamp
        const syncRef = db.collection('system').doc('youtube_sync');
        batch.set(syncRef, { lastSynced: Date.now() }, { merge: true });

        await batch.commit();

        // Invalidate cache
        // revalidateTag('videos');

        return true;
    } catch (error) {
        console.error('Error saving videos to Firestore:', error);
        return false;
    }
}

// Cached getter for videos
export const getSavedVideos = async (): Promise<Video[]> => {
    try {
        if (!db) return [];
        const snapshot = await db.collection('videos')
            .orderBy('publishedAt', 'desc')
            .get();

        return snapshot.docs.map(doc => doc.data() as Video);
    } catch (error) {
        console.error('Error fetching videos from Firestore:', error);
        return [];
    }
};

export async function getVideoById(id: string): Promise<Video | null> {
    const videos = await getSavedVideos();
    return videos.find((v) => v.id === id) || null;
}

export async function getVideosWithAutoSync(): Promise<Video[]> {
    // 1. Get current videos first (fastest, cached)
    let videos = await getSavedVideos();

    // 2. Check last sync time from Firestore
    try {
        let lastSynced = 0;
        const syncDoc = await db.collection('system').doc('youtube_sync').get();
        if (syncDoc.exists) {
            lastSynced = syncDoc.data()?.lastSynced || 0;
        }

        const now = Date.now();
        const shouldSync = (now - lastSynced) > SYNC_COOLDOWN_MS;

        // If we have no videos, enforce sync regardless of cooldown?
        // Maybe. For start up, yes.
        const mustSync = videos.length === 0;

        if (shouldSync || mustSync) {
            console.log("Auto-sync triggered: Cache expired or empty.");
            const newVideos = await fetchChannelVideos();
            if (newVideos.length > 0) {
                await saveVideos(newVideos);
                videos = [...newVideos];
            }
        }
    } catch (error) {
        console.error("Auto-sync failed:", error);
    }

    return videos;
}
