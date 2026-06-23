import { Album } from "./Album";
import { Description } from "./Description";

//

export interface Gallery {
    id: string;
    name: string;
    description: Description;
    thumbnail: string; // picture id
    albums: Album[];
}
