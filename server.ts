import fs from "node:fs/promises";
import express from "express";
import cors from "cors";
import { ViteDevServer } from "vite";
import cluster from "cluster";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { extractTypeFromJSON } from "./src/server";
import {
	getLogList,
	insertLog,
	connectDb,
	closeConnection
} from "./src/shared/db";

export const endpoint = process.env.NODE_END_POINT || "http://localhost:5173";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname);

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

// Cached production assets
const templateHtml = isProduction
	? await fs.readFile("dist/client/index.html", "utf-8")
	: "";
const ssrManifest = isProduction
	? await fs.readFile("dist/client/.vite/ssr-manifest.json", "utf-8")
	: undefined;

if (cluster.isPrimary) {
	console.log(`Primary process id: ${process.pid}`);

	cluster.on("exit", (worker, code, signal) => {
		console.log(`${worker.process.pid} worker exit`);
		console.log("code", code, "signal", signal);
	});
}

// Create http server
const app = express();

// Add Vite or respective production middlewares
let vite: ViteDevServer;
if (!isProduction) {
	console.log(`is Dev`);

	if (cluster.isPrimary) {
		const { createServer } = await import("vite");
		vite = await createServer({
			server: { middlewareMode: true },
			appType: "custom",
			base
		});
		app.use(vite.middlewares);
	} else {
		// console.log("짜잔", cluster.);
		console.log("!cluster.isPrimary === 암것도 안함 ㅅㄱ");
	}
} else {
	console.log(`is Production`);
}

if (cluster.isPrimary) {
	if (isProduction) {
		app.use("/dist", express.static(join(__dirname)));
	}

	app.use(cors());
	app.use(express.json());

	app.get("/log", async (req, res) => {
		try {
			const result = await getLogList();

			if (result?.length === 0) {
				return res.status(204).json({ log: [] });
			}

			return res.status(200).json({ log: result });
		} catch (error) {
			console.error("Fail to get log:", error);
			res.status(500).json({ error: "Failed to get Logs" });
		}
	});

	// Add type extraction endpoint
	app.post("/extract-type", (req, res) => {
		try {
			const { jsonContent } = req.body;
			if (!jsonContent) {
				return res.status(400).json({ error: "JSON content is required" });
			}

			const extractedType = extractTypeFromJSON(jsonContent);

			insertLog({
				input: jsonContent,
				output: extractedType
			});

			res.json({ type: extractedType });
		} catch (error) {
			console.error("Error extracting type:", error);
			res.status(500).json({ error: "Failed to extract type" });
		}
	});

	// Serve HTML
	app.use("*", async (req, res, next) => {
		// console.log(req);

		try {
			const url = req.originalUrl.replace(base, "");

			let template: string;
			let render: (
				arg0: string,
				arg1: string | undefined
			) => { html: string; head?: string };
			if (!isProduction) {
				// Always read fresh template in development
				template = await fs.readFile("./index.html", "utf-8");
				template = await vite.transformIndexHtml(url, template);
				render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
			} else {
				template = templateHtml;
				const newLocal = "./server/entry-server.js";
				render = (await import(newLocal)).render;
			}

			const rendered = render(url, ssrManifest);

			const html = template
				.replace(`<!--app-head-->`, rendered.head ?? "")
				.replace(`<!--app-html-->`, rendered.html ?? "");

			res.status(200).set({ "Content-Type": "text/html" }).send(html);
		} catch (e) {
			const error = e as Error;
			vite?.ssrFixStacktrace(error);
			console.log(error.stack);
			res.status(500).end(error.stack);
		}
	});

	// Start http server
	app.listen(port, () => {
		console.log(`Server started at http://localhost:${port}`);
		connectDb();
	});

	process.on("close", () => {
		closeConnection();
	});
}
