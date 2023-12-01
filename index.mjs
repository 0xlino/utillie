/**
██╗░░░░░██╗███╗░░██╗░█████╗░
██║░░░░░██║████╗░██║██╔══██╗
██║░░░░░██║██╔██╗██║██║░░██║
██║░░░░░██║██║╚████║██║░░██║
███████╗██║██║░╚███║╚█████╔╝
╚══════╝╚═╝╚═╝░░╚══╝░╚════╝░
 */
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
import * as smoldash from './lib/smoldash.mjs';
import * as fflip from './lib/fflip.mjs';
import * as shopify from './lib/shopify.mjs';
import * as date from './lib/date.mjs';
import { LeakyBucket } from "./lib/leaky.mjs";

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
    storage, utillie, myCustomLog, ben, myCustomLog2, 
    smoldash, fflip, shopify, date, LeakyBucket
};

if (utillie.inBrowser() && !globalThis.utillie) {
    globalThis.utillie = {
        boxes, color, manifest, math, shot,
        storage, utillie, uuid, myCustomLog, ben,
        smoldash, shopify, date, LeakyBucket
    };
    // top-level await workaround
    (async () => {
        utillie.log(
            `(${manifest.homepage}) is ready!`,
            `${(await utillie.which(manifest)).title}.*`
        );
    })();
}
