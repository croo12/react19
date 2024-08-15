import fs from "node:fs/promises";
import express from "express";
import { ViteDevServer } from "vite";
import cluster from "cluster";
import { exec } from "node:child_process";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

// Cached production assets
const templateHtml = isProduction
	? await fs.readFile("./dist/client/index.html", "utf-8")
	: "";
const ssrManifest = isProduction
	? await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8")
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
}

if (cluster.isPrimary) {
	// Serve HTML
	app.use("*", async (req, res) => {
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
	});
}
