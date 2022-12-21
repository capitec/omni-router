import commandLineArgs from 'command-line-args';
import esbuild from 'esbuild';
import fs from 'fs-extra';
import { globby } from 'globby';

const { dir, verbose, format, target } = commandLineArgs([
	{ name: 'dir', type: String, defaultValue: 'dist' },
	{ name: 'format', type: String, defaultValue: 'esm' },
	{ name: 'target', type: String, defaultValue: 'es2017' },
	{ name: 'verbose', type: Boolean }
],
	{
		partial: true
	});

const outdir = dir;

fs.rmSync(outdir, { recursive: true, force: true });
fs.mkdirSync(outdir, { recursive: true });

(async () => {

	console.log('Copying static files and assets to output directory');

	const staticFiles = [
		...(await globby('./src/index.*')),
		...(await globby('./src/assets/*')),
	]
	staticFiles.forEach(f => {
		if (verbose) {
			console.log(`\t- ${f}`)
		}
		fs.copySync(f, f.replace('/src', '/dist'));
	});

	console.log(`Building for ${format.toUpperCase()} ${target.toUpperCase()}...`);

	const entryPoints = [
		'./src/AppShell.js'
	]
	if (verbose) {
		console.log('Targeting the following entrypoints: \n');
		entryPoints.forEach(e => console.log(`\t- ${e}`));
	}

	const buildResult = await esbuild
		.build({
			format: format,
			target: target,
			entryPoints: entryPoints,
			outdir,
			chunkNames: 'chunks-[ext]/[name].[hash]',
			incremental: false,
			define: {
				'process.env.NODE_ENV': '"production"'
			},
			bundle: true,
			splitting: true,
			plugins: [],
			logLevel: verbose ? 'debug' : 'info',
			minify: true,
			sourcemap: 'linked',
			sourcesContent: false
		})
		.catch(err => {
			console.error(err);
			process.exit(1);
		});

	console.log(`The build has been generated at ${outdir} \n`);

	// Cleanup on exit
	process.on('SIGTERM', () => buildResult.rebuild.dispose());
})();