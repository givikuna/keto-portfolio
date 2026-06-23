export namespace STILL_DB {
    export interface PICTURE {
        id: string;
        file: string;
        description: string;
        albumID: string;
    }

    export interface ALBUM {
        id: string;
        name: string;
        description: string;
        thumbnail: string; // picture id
        galleryID: string;
    }

    export interface GALLERY {
        id: string;
        name: string;
        thumbnail: string; // picture id
    }

    export interface DB {
        pictures: PICTURE[];
        albums: ALBUM[];
        galleries: GALLERY[];
    }
}
