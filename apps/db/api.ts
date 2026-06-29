import * as fs from "fs";
import * as path from "path";

import { IDMachine } from "./modules/IDMachine";

import { DB } from "../../shared/interfaces/DB";
import { Gallery } from "../../shared/interfaces/Gallery";
import { Album } from "../../shared/interfaces/Album";
import { Picture } from "../../shared/interfaces/Picture";

import { MDMetadata } from "../../shared/interfaces/MDMetadata";

import { Description } from "../../shared/interfaces/Description";
import { SocialMedia } from "../../shared/interfaces/SocialMedia";
import { Personals } from "../../shared/interfaces/Personals";

//

function createMDMetadata(topic: string): MDMetadata {
    const m: MDMetadata = {
        en: "",
        ru: "",
        ka: "",
    };

    ["en", "ru", "ka"].forEach(
        (l: string): void =>
            (m[l] = fs.readFileSync(
                path.join(__dirname, `./data/markdown/${topic}/${l}.md`),
                "utf-8",
            ) as any),
    );

    return m;
}

//

export class DB_API {
    private static db: DB | null = null;

    public static fetchDB(): DB {
        if (this.db === null) {
            return {
                ...JSON.parse(fs.readFileSync(path.join(__dirname, "./data/db.json"), "utf-8")),
                ...{
                    about: createMDMetadata("about"),
                    pricing: createMDMetadata("pricing"),
                    personals: JSON.parse(
                        fs.readFileSync(path.join(__dirname, "./data/personals.json"), "utf-8"),
                    ) satisfies Personals,
                },
            } satisfies DB;
        }
        return this.db;
    }

    private static overwriteDB(): void {
        fs.writeFileSync(
            path.join(__dirname, "./data/db.json"),
            JSON.stringify(DB_API.fetchDB()),
            "utf-8",
        );
    }

    public static getGallery(id: string): Gallery | undefined {
        return [...DB_API.fetchDB().galleries]
            .filter((gallery: Gallery): boolean => gallery.id === id)
            .at(0);
    }

    public static getAlbum(albumID: string): Album | undefined {
        const db: DB = DB_API.fetchDB();

        for (let i: number = 0; i < db.galleries.length; i++) {
            for (let j: number = 0; j < db.galleries[i].albums.length; j++) {
                if (db.galleries[i].albums[j].id === albumID) return db.galleries[i].albums[j];
            }
        }

        return undefined;
    }

    public static addGallery(name: string, description: Description): Gallery {
        const db: DB = DB_API.fetchDB();

        const newGallery: Gallery = {
            id: IDMachine.inc(),
            name: name,
            description: description,
            thumbnail: "",
            albums: [],
        };

        db.galleries.push(newGallery);

        this.overwriteDB();

        return newGallery;
    }

    public static addAlbum(name: string, description: Description, galleryID: string): Album {
        const newAlbum: Album = {
            id: IDMachine.inc(),
            name: name,
            description: description,
            thumbnail: "",
            pictures: [],
        };

        DB_API.getGallery(galleryID)?.albums.push(newAlbum);

        this.overwriteDB();

        return newAlbum;
    }

    public static addPicture(description: Description, albumID: string) {
        const id: string = IDMachine.inc();
        const newPicture: Picture = {
            id: id,
            file: `${id}.jpg`,
            description: description,
        };

        DB_API.getAlbum(albumID)?.pictures.push(newPicture);

        this.overwriteDB();

        return newPicture;
    }

    public static getSocialMedia(): SocialMedia[] {
        return [...DB_API.fetchDB().media];
    }

    public static addSocialMedia(platform: string, url: string, iconURL: string): SocialMedia {
        const newSM: SocialMedia = {
            platform: platform,
            url: url,
            iconURL: iconURL,
        };

        DB_API.fetchDB().media.push(newSM);

        this.overwriteDB();

        return newSM;
    }

    public static getPersonals(): Personals {
        return DB_API.fetchDB().personals;
    }

    public static updateGallery(
        galleryID: string,
        data: Partial<Omit<Gallery, "id" | "album">>,
    ): Gallery | undefined {
        const gallery: Gallery | undefined = this.fetchDB().galleries.find(
            (g: Gallery): boolean => g.id === galleryID,
        );

        if (!gallery) {
            return undefined;
        }

        Object.assign(gallery, data);
        this.overwriteDB();

        return gallery;
    }

    public static updateAlbum(
        albumID: string,
        data: Partial<Omit<Album, "id" | "pictures">>,
    ): Album | undefined {
        const album: Album | undefined = this.getAlbum(albumID);

        if (!album) {
            return undefined;
        }

        Object.assign(album, data);
        this.overwriteDB();

        return album;
    }

    public static updatePicture(
        pictureID: string,
        data: Partial<Omit<Picture, "id" | "file">>,
    ): Picture | undefined {
        const db: DB = this.fetchDB();

        for (const gallery of db.galleries) {
            for (const album of gallery.albums) {
                const picture: Picture | undefined = album.pictures.find(
                    (p: Picture): boolean => p.id === pictureID,
                );

                if (picture) {
                    Object.assign(picture, data);
                    this.overwriteDB();

                    return picture;
                }
            }
        }

        return undefined;
    }
}
