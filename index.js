import express from "express";
const app = express();
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import indexRouter from "./routes/index.js";
import { neon } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));

const sql = neon(
  `postgresql://db_project_owner:npg_drQ8iVwKfHg3@ep-divine-glitter-a8ezq9pf-pooler.eastus2.azure.neon.tech/db_project?sslmode=require&channel_binding=require`
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", indexRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(4500, console.log(`Server is listening on http://localhost:4500`));
