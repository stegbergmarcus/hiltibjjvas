export interface Video {
    id: string;
    title: string;
    originalTitle?: string;
    thumbnail: string;
    publishedAt: string;
    link: string;
    collections?: string[];
    tags?: string[];
}
