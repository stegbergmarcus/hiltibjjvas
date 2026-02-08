'use server';

import { fetchChannelVideos, saveVideos } from '@/lib/youtube';
import { revalidatePath } from 'next/cache';

export async function syncYoutubeVideos() {
    try {
        const videos = await fetchChannelVideos();
        const success = await saveVideos(videos);

        if (success) {
            revalidatePath('/collections');
            revalidatePath('/admin');
            return { success: true, count: videos.length, videos: videos.slice(0, 5) };
        }
        return { success: false, error: 'Failed to save videos' };
    } catch (error) {
        console.error('Sync failed:', error);
        return { success: false, error: 'Sync failed' };
    }
}
