import { SERVER_PORT } from "../../../../shared/constants/constants";
import { Gallery } from "../../../../shared/interfaces/Gallery";
import { Album } from "../../../../shared/interfaces/Album";
import { Picture } from "../../../../shared/interfaces/Picture";
import { Description } from "../../../../shared/interfaces/Description";
import { MDMetadata } from "../../../../shared/interfaces/MDMetadata";

const API_BASE = `http://localhost:${SERVER_PORT}/api`;

async function fetcher<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
    }
    return res.json();
}

//

// fetch methods

//

export function fetchGalleries(): Promise<Gallery[]> {
    return fetcher<Gallery[]>("/galleries");
}

export function fetchGallery(id: string): Promise<Gallery> {
    return fetcher<Gallery>(`/gallery/${id}`);
}

export function fetchAlbum(id: string): Promise<Album> {
    return fetcher<Album>(`/album/${id}`);
}

export function fetchAbout(): Promise<MDMetadata> {
    return fetcher<MDMetadata>("/about");
}

export function fetchPricing(): Promise<MDMetadata> {
    return fetcher<MDMetadata>("/pricing");
}

//

// gallery CRUD

//

export function createGallery(name: string, description: Description): Promise<Gallery> {
    return fetcher<Gallery>("/gallery", {
        method: "POST",
        body: JSON.stringify({ name, description }),
    });
}

export function updateGallery(
    id: string,
    data: Partial<Omit<Gallery, "id" | "albums">>,
): Promise<Gallery> {
    return fetcher<Gallery>(`/gallery/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export function deleteGallery(id: string): Promise<void> {
    return fetcher<void>(`/gallery/${id}`, { method: "DELETE" });
}

//

// album CRUD

//

export function createAlbum(
    name: string,
    description: Description,
    galleryID: string,
): Promise<Album> {
    return fetcher<Album>("/album", {
        method: "POST",
        body: JSON.stringify({ name, description, galleryID }),
    });
}

export function updateAlbum(
    id: string,
    data: Partial<Omit<Album, "id" | "pictures">>,
): Promise<Album> {
    return fetcher<Album>(`/album/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export function deleteAlbum(id: string): Promise<void> {
    return fetcher<void>(`/album/${id}`, { method: "DELETE" });
}

//

// picture CRUD

//

export function createPicture(description: Description, albumID: string): Promise<Picture> {
    return fetcher<Picture>("/picture", {
        method: "POST",
        body: JSON.stringify({ description, albumID }),
    });
}

export function updatePicture(
    id: string,
    data: Partial<Omit<Picture, "id" | "file">>,
): Promise<Picture> {
    return fetcher<Picture>(`/picture/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export function deletePicture(id: string): Promise<void> {
    return fetcher<void>(`/picture/${id}`, { method: "DELETE" });
}

//

// moving methods

//

export function moveAlbum(albumID: string, targetGalleryID: string): Promise<void> {
    return fetcher<void>("/move/album", {
        method: "PUT",
        body: JSON.stringify({ albumID, targetGalleryID }),
    });
}

export function movePicture(pictureID: string, targetAlbumID: string): Promise<void> {
    return fetcher<void>("/move/picture", {
        method: "PUT",
        body: JSON.stringify({ pictureID, targetAlbumID }),
    });
}

//

// re-ordering methods

//

export function reorderAlbums(galleryID: string, orderedAlbumIDs: string[]): Promise<void> {
    return fetcher<void>("/reorder/albums", {
        method: "PUT",
        body: JSON.stringify({ galleryID, orderedAlbumIDs }),
    });
}

export function reorderPictures(albumID: string, orderedPictureIDs: string[]): Promise<void> {
    return fetcher<void>("/reorder/pictures", {
        method: "PUT",
        body: JSON.stringify({ albumID, orderedPictureIDs }),
    });
}

//

// markdown text file updates

//

export function updateAbout(md: MDMetadata): Promise<void> {
    return fetcher<void>("/about", {
        method: "PUT",
        body: JSON.stringify(md),
    });
}

export function updatePricing(md: MDMetadata): Promise<void> {
    return fetcher<void>("/pricing", {
        method: "PUT",
        body: JSON.stringify(md),
    });
}

//

// upload

//

export async function uploadImage(file: File): Promise<{ id: string; file: string }> {
    const formData: FormData = new FormData();
    formData.append("image", file);

    const res: Response = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Upload failed");
    }

    return res.json();
}
