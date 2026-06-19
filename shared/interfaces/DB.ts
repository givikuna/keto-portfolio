import { Gallery } from "./Gallery";
import { SocialMedia } from "./SocialMedia";
import { MDMetadata } from "./MDMetadata";
import { Personals } from "./Personals";

export interface DB {
    galleries: Gallery[];
    media: SocialMedia[];

    pricing: MDMetadata;
    about: MDMetadata;

    personals: Personals;
}
