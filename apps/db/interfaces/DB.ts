import { Gallery } from "./Gallery";
import { SocialMedia } from "../types/SocialMedia";

export interface DB {
    galleries: Gallery[];
    media: SocialMedia[];

    pricing: string;
    about: string;
}
