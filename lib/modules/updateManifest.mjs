import { writeFile } from '../storage.mjs'
import manifest from '../../package.json' assert { type: 'json' };

export const updateManifest = async (lib, _manifest, nn) => {
    delete manifest.scripts;
    const strManifest = [
        `const manifest = ${JSON.stringify(manifest, null, 4)};`,
        'export default manifest;',
    ].join(nn);
    await writeFile(`${lib}/${_manifest}`, strManifest);
};
