import { execSync } from 'child_process';
import * as fs from 'fs/promises';
import commandLineArgs from 'command-line-args';
import packageJson from 'package-json';

let { version, tag } = commandLineArgs([
    { name: 'version', type: String },
    { name: 'tag', type: String }
]);

(async () => {

    try {
        const packageFile = JSON.parse(await fs.readFile('package.json'));
        const packageNpm = await packageJson(packageFile.name, { allVersions: true });

        if (!version) {
            version = packageFile.version;
        }

        if (tag) {
            version = `${version}-${tag}`;
        }

        const newVersion = !Object.keys(packageNpm.versions).find(v => v.includes(version)) && true;

        if (!newVersion) {
            console.log('Bumping patch version');
            execSync('npm version patch -git-tag-version false -allow-same-version true');
        }
    } catch (error) {
        console.warn(error);
    }

})();