// polyfill
import _ from './lib/polyfills.mjs'
// dependencies
import * as fileType from 'file-type';
import * as math from 'mathjs';
import * as uuid from 'uuid';
// features
import * as boxes from './lib/boxes.mjs';
import * as shot from './lib/shot.mjs';
import * as storage from './lib/storage.mjs';
import * as utillie from './lib/utillie.mjs';
import * as ben from './lib/ben.mjs';
import color from './lib/color.mjs';
import manifest from './lib/manifest.mjs';

const myCustomLog = (m) => {
    return console.log(m)
}

const myCustomLog2 = (m) => {
    return console.log(m)
}

// Export
export * as default from './lib/utillie.mjs';
export {
    // dependencies
    fileType, math, uuid,
    // features
    boxes, color, manifest, shot,
    storage, utillie, myCustomLog, ben, myCustomLog2
};

if (utillie.inBrowser() && !globalThis.utillie) {
    globalThis.utillie = {
        boxes, color, manifest, math, shot,
        storage, utillie, uuid, myCustomLog, ben,
        myCustomLog2
    };
    // top-level await workaround
    (async () => {
        utillie.log(
            `(${manifest.homepage}) is ready!`,
            `${(await utillie.which(manifest)).title}.*`
        );
    })();
}