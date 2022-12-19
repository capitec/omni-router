import esbuildServe from "esbuild-serve";

esbuildServe(
	{
		logLevel: "info",
		entryPoints: ["src/AppShell.js"],
		bundle: true,
		outfile: "www/index.js",
	},
	{ root: "www" }
);