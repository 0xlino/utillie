import { basename, extname } from 'path';
import { readdir } from 'fs/promises';
import { storage, utillie } from './index.mjs';

// https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
import { makeBoxes } from './lib/modules/makeBoxes.mjs';
import { updateManifest } from './lib/modules/updateManifest.mjs';

// shared const
const [lib, _manifest, n, nn] = ['./lib', 'manifest.mjs', '\n', '\n\n'];

await makeBoxes(lib);
await updateManifest(lib, _manifest, nn);

const [ignore, DEFAULT, _NEED, fileTypes]
    = [new Set([_manifest]), 'default', '_NEED', ['.cjs', '.mjs']];
const concat = arr => arr.join('');
const extReg = new RegExp(fileTypes.map(RegExp.escape).join('|'), 'ig');
const getBasename = file => basename(file).replace(extReg, '');
const tr = arr => `${['', ...arr, ''].join(' | ')}${n}`;
const readme = [await storage.readFile('./template.md')];
const [alignedNone, alignedLeft, alignedCenter, alignedRight]
    = ['---', ':---', ':---:', '---:'];
const files = (await readdir(lib)).filter(
    f => fileTypes.includes(extname(f)) && !ignore.has(f)
);
const mdTableHead = concat([
    ['symbol', 'type', 'params / value'],
    [alignedLeft, alignedLeft, alignedLeft]
].map(tr));
for (let file of files) {
    const filename = `${lib}/${file}`;
    const m = utillie.analyzeModule(await import(filename));
    readme.push(
        `${n}### [${getBasename(file)}](${filename})${nn}${mdTableHead}`
        + concat([
            ...m[_NEED] ? [_NEED] : [],
            ...m[DEFAULT] ? [DEFAULT] : [],
            ...Object.keys(m).filter(k => ![_NEED, DEFAULT].includes(k))
        ].map(k => tr([k, m[k].type, m[k].params?.join(', ') || m[k].value])))
    );
};
await storage.writeFile('./README.md', concat(readme));
