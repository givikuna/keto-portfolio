import { Album } from "../../../../shared/interfaces/Album";
import { Gallery } from "../../../../shared/interfaces/Gallery";
import { MDMetadata } from "../../../../shared/interfaces/MDMetadata";
import { SocialMedia } from "../../../../shared/interfaces/SocialMedia";

const API_BASE: string = "https://localhost:8081";

async function fetcher(APIPath: string): Promise<JSON> {
    return (await fetch(`${API_BASE}/api/${APIPath}`)).json();
}

export async function fetchGalleries(): Promise<Gallery[]> {
    return fetcher(`galleries`) as unknown as Promise<Gallery[]>;
}

export async function fetchGallery(id: string): Promise<Gallery> {
    return fetcher(`gallery/${id}`) as unknown as Promise<Gallery>;
}

export async function fetchAlbum(id: string): Promise<Album> {
    return fetcher(`album/${id}`) as unknown as Promise<Album>;
}

export async function fetchPricing(): Promise<MDMetadata> {
    return fetcher(`pricing`) as unknown as Promise<MDMetadata>;
}

export async function fetchAbout(): Promise<MDMetadata> {
    return fetcher(`about`) as unknown as Promise<MDMetadata>;
}

export async function fetchSocialMedia(): Promise<SocialMedia> {
    return fetcher(`about`) as unknown as Promise<SocialMedia>;
}
