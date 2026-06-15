import * as express from "express";

import { DB_API } from "../../db/api";

import { Gallery } from "../../../shared/interfaces/Gallery";
import { Album } from "../../../shared/interfaces/Album";

const router: express.Router = express.Router();

router.get("/galleries", (_req: express.Request, res: express.Response): void => {
    res.json(DB_API.fetchDB().galleries);
});

router.get("/gallery/:id", (req: express.Request, res: express.Response): void => {
    const gallery: Gallery | undefined = DB_API.getGallery(req.params["id"] as string);

    if (!gallery) {
        res.status(404).json({ error: "gallery not found" });
        return;
    }

    res.json(gallery);
});

router.get("/album/:id", (req: express.Request, res: express.Response): void => {
    const album: Album | undefined = DB_API.getAlbum(req.params["id"] as string);

    if (!album) {
        res.status(404).json({ error: "album not found" });
        return;
    }

    res.json(album);
});

router.get("/about", (_req: express.Request, res: express.Response): void => {
    res.json(DB_API.fetchDB().about);
});

router.get("/pricing", (_req: express.Request, res: express.Response): void => {
    res.json(DB_API.fetchDB().pricing);
});

router.get("/social-media", (req: express.Request, res: express.Response): void => {
    res.json(DB_API.getSocialMedia());
});

export default router;
