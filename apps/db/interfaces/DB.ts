import { Gallery } from "./Gallery";

import { SocialMedia } from "./SocialMedia";

import { MDMetadata } from "./MDMetadata";

export interface DB {
    galleries: Gallery[];
    media: SocialMedia[];

    pricing: MDMetadata;
    about: MDMetadata;
}
