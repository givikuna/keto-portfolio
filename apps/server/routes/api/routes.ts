import * as express from "express";
import * as multer from "multer";
import * as fs from "fs";
import * as path from "path";
import * as child_process from "child_process";
import * as util from "util";

import { DB_API } from "../../../db/api";

import { IDMachine } from "../../../db/modules/IDMachine";

import { Gallery } from "../../../../shared/interfaces/Gallery";
import { Album } from "../../../../shared/interfaces/Album";
import { Picture } from "../../../../shared/interfaces/Picture";
import { Description } from "../../../../shared/interfaces/Description";
import { MDMetadata } from "../../../../shared/interfaces/MDMetadata";

const upload: multer.Multer = multer.default({ dest: "apps/db/data/img" });

//

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

router.get("/social-media", (_req: express.Request, res: express.Response): void => {
    res.json(DB_API.getSocialMedia());
});

// To-Do
router.get("/cmd", (_req: express.Request, _res: express.Response): void => {
    //
});

router.post("/contact", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        if (!req.body["name"] || !req.body["email"] || !req.body["message"]) {
            res.status(400).json({ error: "name, email, and message are required" });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body["email"])) {
            res.status(400).json({ error: "invalid email address" });
            return;
        }
        const subject: string = `Portfolio contact from ${req.body["name"]}`.replace(/"/g, '\\"');
        const body: string = `
New Message:

Name: ${req.body["name"]}
Email: ${req.body["email"]}
Message:
${req.body["message"].trim()}
    `
            .replace(/"/g, '\\"')
            .trim();

        await util.promisify(child_process.exec)(
            `echo "${body}" | mail -s "${subject}" ${DB_API.getPersonals().email}`,
            { shell: "/bin/sh" },
        );
    } catch (e: unknown) {
        console.error("error sending mail:", e);
        res.status(500).json({ error: "failed to send email. please try again later" });
    }
});

router.post(
    "/upload",
    upload.single("image"),
    (req: express.Request, res: express.Response): void => {
        const id: string = IDMachine.inc();
        const name: string = `${id}{path.extname(req["file"]!["originalname"])}`;

        fs.renameSync(req["file"]!["path"], path.join("apps/db/img", name));

        res.json({ id: id, file: name });
    },
);

//

// CRUD

//

router.post("/gallery", (req: express.Request, res: express.Response): void => {
    const { name, description } = req.body as { name: string; description: Description };

    if (!name || !description) {
        res.status(400).json({ error: "name and description required" });
        return;
    }

    res.status(201).json(DB_API.addGallery(name, description));
});

router.put("/gallery/:id", (req: express.Request, res: express.Response): void => {
    const updated: Gallery | undefined = DB_API.updateGallery(String(req.params["id"]), req.body);

    if (!updated) {
        res.status(404).json({ error: "gallery not found" });
    }

    res.json(updated);
});

router.delete("/gallery/:id", (req: express.Request, res: express.Response): void => {
    const success: boolean = DB_API.deleteGallery(String(req.params["id"]));

    if (!success) {
        res.status(404).json({ error: "gallery not found" });
    }

    res.status(204).send();
});

// album stuff

router.post("/album", (req: express.Request, res: express.Response): void => {
    const { name, description, galleryID } = req.body as {
        name: string;
        description: Description;
        galleryID: string;
    };

    if (!name || !description || !galleryID) {
        res.status(400).json({ error: "name, description and galleryID required" });
        return;
    }

    res.status(201).json(DB_API.addAlbum(name, description, galleryID));
});

router.put("/album/:id", (req: express.Request, res: express.Response): void => {
    const updated: Album | undefined = DB_API.updateAlbum(String(req.params["id"]), req.body);

    if (!updated) {
        res.status(404).json({ error: "album not found" });
        return;
    }

    res.json(updated);
});

router.delete("/album/:id", (req: express.Request, res: express.Response): void => {
    const success: boolean = DB_API.deleteAlbum(String(req.params["id"]));

    if (!success) {
        res.status(404).json({ error: "album not found" });
        return;
    }

    res.status(204).send();
});

// picture stuff
router.post("/picture", (req: express.Request, res: express.Response): void => {
    const { description, albumID } = req.body as { description: Description; albumID: string };

    if (!description || !albumID) {
        res.status(400).json({ error: "description and albumID required" });
        return;
    }

    res.status(201).json(DB_API.addPicture(description, albumID));
});

router.put("/picture/:id", (req: express.Request, res: express.Response): void => {
    const updated: Picture | undefined = DB_API.updatePicture(String(req.params["id"]), req.body);

    if (!updated) {
        res.status(404).json({ error: "picture not found" });
        return;
    }

    res.json(updated);
});

router.delete("/picture/:id", (req: express.Request, res: express.Response): void => {
    const success: boolean = DB_API.deletePicture(String(req.params["id"]));

    if (!success) {
        res.status(404).json({ error: "picture not found" });
        return;
    }

    res.status(204).send();
});

// --- Move ---
router.put("/move/album", (req: express.Request, res: express.Response): void => {
    const { albumID, targetGalleryID } = req.body as { albumID: string; targetGalleryID: string };

    if (!albumID || !targetGalleryID) {
        res.status(400).json({ error: "albumId and targetGalleryId required" });
        return;
    }

    const success: boolean = DB_API.moveAlbum(albumID, targetGalleryID);

    if (!success) {
        res.status(404).json({ error: "album or target gallery not found" });
        return;
    }

    res.status(200).json({ message: "moved" });
});

router.put("/move/picture", (req: express.Request, res: express.Response): void => {
    const { pictureID, targetAlbumID } = req.body as { pictureID: string; targetAlbumID: string };

    if (!pictureID || !targetAlbumID) {
        res.status(400).json({ error: "pictureId and targetAlbumId required" });
        return;
    }

    const success: boolean = DB_API.movePicture(pictureID, targetAlbumID);

    if (!success) {
        res.status(404).json({ error: "picture or target album not found" });
        return;
    }

    res.status(200).json({ message: "moved" });
});

// re-ordering stuff
router.put("/reorder/albums", (req: express.Request, res: express.Response): void => {
    const { galleryID, orderedAlbumIDs } = req.body as {
        galleryID: string;
        orderedAlbumIDs: string[];
    };

    if (!galleryID || !orderedAlbumIDs) {
        res.status(400).json({ error: "galleryId and orderedAlbumIds required" });
        return;
    }
    const success: boolean = DB_API.reorderAlbums(galleryID, orderedAlbumIDs);

    if (!success) {
        res.status(404).json({ error: "gallery not found or invalid order" });
        return;
    }

    res.status(200).json({ message: "reordered" });
});

router.put("/reorder/pictures", (req: express.Request, res: express.Response): void => {
    const { albumID, orderedPictureIDs } = req.body as {
        albumID: string;
        orderedPictureIDs: string[];
    };

    if (!albumID || !orderedPictureIDs) {
        res.status(400).json({ error: "albumId and orderedPictureIds required" });
        return;
    }

    const success = DB_API.reorderPictures(albumID, orderedPictureIDs);

    if (!success) {
        res.status(404).json({ error: "album not found or invalid order" });
        return;
    }

    res.status(200).json({ message: "reordered" });
});

router.put("/about", (req: express.Request, res: express.Response): void => {
    const md: MDMetadata = req.body;

    if (!md.en || !md.ru || !md.ka) {
        res.status(400).json({ error: "en, ru, ka required" });
    }
});

export default router;
