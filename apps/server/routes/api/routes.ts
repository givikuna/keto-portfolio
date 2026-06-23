import * as express from "express";
import * as child_process from "child_process";
import * as util from "util";

import { DB_API } from "../../../db/api";

import { Gallery } from "../../../../shared/interfaces/Gallery";
import { Album } from "../../../../shared/interfaces/Album";

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

export default router;
