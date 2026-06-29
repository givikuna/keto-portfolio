import * as express from "express";
import * as path from "path";
import * as cors from "cors";

import * as APIRoutes from "./routes/api/routes";

import { SERVER_PORT } from "../../shared/constants/constants";

//

const app: express.Application = express.default();

app.use(cors.default());
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "../db/data/img/")));

app.use("/api", APIRoutes.default);

app.listen(SERVER_PORT, (): void => console.log(`running on ${SERVER_PORT}`));
