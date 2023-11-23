const manifest = {
    "name": "utillie",
    "description": "Utility library system for Node & Browser",
    "version": "0.0.2",
    "private": false,
    "main": "index.mjs",
    "type": "module",
    "homepage": "www.github.com/0xlino/utillie",
    "engines": {
        "node": ">=20.x"
    },
    "author": "Ben Line <ben@benline.co.uk>",
    "license": "MIT",
    "repository": {
        "type": "git",
        "url": "https://github.com/0xlino/utillie.git"
    },
    "dependencies": {
        "file-type": "^18.7.0",
        "mathjs": "^12.1.0",
        "uuid": "^9.0.1"
    },
    "devDependencies": {
        "@mozilla/readability": "^0.4.4",
        "browserify-fs": "^1.0.0",
        "buffer": "^6.0.3",
        "jsdom": "^22.1.0",
        "mime-types": "^2.1.35",
        "node-polyfill-webpack-plugin": "^2.0.1",
        "smoldash": "^0.11.0",
        "url": "github:Leask/node-url",
        "webpack-cli": "^5.1.4"
    }
};

export default manifest;