import { Description } from "./Description";
import { Picture } from "./Picture";

export interface Album {
    id: string;
    name: string;
    description: Description;
    thumbnail: string; // picture id
    pictures: Picture[];
}
