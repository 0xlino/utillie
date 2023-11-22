// import { distillHtml } from './web.mjs';
import { fileTypeFromBuffer } from 'file-type';
import { join } from 'path';
import { promises as fs } from 'fs';
import { sha256 } from './encryption.mjs';

import {
    ensureString, extract, ignoreErrFunc, inBrowser, parseJson, parseVersion,
    throwError, which
} from './utillie.mjs';

import {
    encodeBase64DataURL, exists, mapFilename, readJson, touchPath, writeJson
} from './storage.mjs';

const TMPDIR = process.env.TMPDIR ? join(process.env.TMPDIR, 'shot') : null;
const buf2utf = buf => buf.toString('utf8');
const [_JSON, _PARSED] = ['JSON', 'PARSED'];
const getJson = async (u, o) => await get(u, { encode: _JSON, ...o || {} });
const getParsedHtml = async (u, o) => await get(u, { encode: _PARSED, ...o || {} });

const defFetchOpt = {
    redirect: 'follow', follow: 3, timeout: 1000 * 10, headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
            + 'AppleWebKit/605.1.15 (KHTML, like Gecko) '
            + 'Version/17.0 Safari/605.1.15',
    },
};

const getVersionOnNpm = async (packName) => {
    assert(packName, 'Package name is required.', 400);
    const url = `https://registry.npmjs.org/-/package/${packName}/dist-tags`;
    const rp = (await get(url, { encode: _JSON }))?.content;
    assert(rp, 'Error fetching package info.', 500);
    assert(rp !== 'Not Found' && rp.latest, 'Package not found.', 404);
    return parseVersion(rp.latest);
};

const distillHtml = async (html, options) => {
    const lib = await Promise.all([need('jsdom'), need('@mozilla/readability')]);
    const [JSDOM, Readability] = [lib[0].JSDOM, lib[1].Readability];
    const _doc = new JSDOM(html)?.window?.document;
    assert(_doc, 'Failed to parse HTML.', 500);
    const content = new Readability(_doc).parse();
    assert(content, 'Failed to distill HTML.', 500);
    if (!options?.raw) {
        content.textContent = content.textContent.trim(
        ).split('\n').map(x => x.trim());
        for (let i = content.textContent.length - 1; i >= 0; i--) {
            if ((i < content.textContent.length - 1)
                && content.textContent[i] === ''
                && content.textContent[i + 1] === '') {
                content.textContent.splice(i, 1);
            }
        }
        content.textContent = content.textContent.join('\n');
    }
    return {
        byline: content.byline, data: {}, html: content.html,
        lang: content.lang, provider: content.siteName,
        text: content.textContent, thumbnail: null,
        title: content.title, type: 'WEBPAGE',
    };
};

const checkVersion = async (pack) => {
    const objPack = await which(pack);
    const curVersion = objPack.versionNormalized;
    const newVersion = await getVersionOnNpm(objPack.name);
    return {
        name: objPack.name, curVersion, newVersion,
        updateAvailable: newVersion.normalized > curVersion.normalized,
    }
};

const getCurrentIp = async (options) => {
    const resp = await get(
        'https://ifconfig.me/all.json', { encode: _JSON, ...options || {} }
    );
    assert(resp?.content?.ip_addr, 'Error detecting IP address.', 500);
    return options?.raw ? resp : resp.content.ip_addr;
};

const getCurrentPosition = async () => {
    const url = 'https://geolocation-db.com/json/';
    const rp = await fetch(url).then(res => res.json());
    assert(rp, 'Network is unreachable.', 500);
    assert(rp.country_code, 'Error detecting geolocation.', 500);
    return rp;
};

const get = async (url, options) => {
    assert(url, 'URL is required.', 400);
    options = options || {};
    options.encode = ensureString(options.encode, { case: 'UP' });
    const urlHash = inBrowser() ? null : sha256(url);
    const tmp = urlHash ? (options.cache?.tmp || TMPDIR) : null;
    const base = tmp ? join(tmp, mapFilename(urlHash)) : null;
    const [cacheMeta, cacheCont] = base ? ['meta', 'content'].map(
        x => join(base, `${urlHash}.${x}`)
    ) : [];
    if (options?.fuzzy && await exists(cacheMeta) && await exists(cacheCont)) {
        return { cache: { meta: cacheMeta, content: cacheCont } };
    }
    const meta = options?.refresh || !base ? null : await readJson(cacheMeta);
    const cache = options?.refresh || !base ? null : await ignoreErrFunc(
        () => fs.readFile(cacheCont)
    );
    const headers = meta?.responseHeaders && cache ? {
        'cache-control': 'max-age=0',
        'if-modified-since': meta.responseHeaders['last-modified'] || '',
        'if-none-match': meta.responseHeaders['etag'] || '',
    } : {};
    let [timer, r, responseHeaders] = [null, null, {}];
    const fetchOptions = {
        ...defFetchOpt, headers: { ...defFetchOpt.headers, ...headers },
        ...options.fetch || {}
    };
    if (options.timeout) {
        const controller = new AbortController();
        fetchOptions.signal = controller.signal;
        timer = setTimeout(() => controller.abort(), options.timeout);
    }
    try { r = await fetch(url, fetchOptions); } catch (e) {
        throwError(e.message.includes('aborted') ? 'Timed out.' : e.message, 500);
    }
    timer && clearTimeout(timer);
    (r.status === 304) && (r.arrayBuffer = async () => cache);
    const [htpMime, buffer] = [r.headers.get('content-type'), Buffer.from(await r.arrayBuffer())];
    if (r.headers?.raw) { responseHeaders = r.headers.raw(); }
    else { for (const [k, v] of r.headers.entries()) { responseHeaders[k] = v; } }
    const bufMime = await ignoreErrFunc(async () => {
        extract(await fileTypeFromBuffer(buffer), 'mime');
    });
    const mimeType = bufMime || htpMime;
    const length = buffer.length;
    let content;
    if (!options?.fuzzy) {
        switch (options.encode) {
            case 'BUFFER':
                content = buffer;
                break;
            case 'BASE64':
                content = buffer.toString(options.encode);
                break;
            case 'BASE64_DATA_URL':
                content = encodeBase64DataURL(mimeType, buffer);
                break;
            case _JSON:
                content = parseJson(buf2utf(buffer), null);
                break;
            case 'TEXT':
                content = buf2utf(buffer);
                break;
            case _PARSED:
                content = await distillHtml(buf2utf(buffer));
                break;
            default:
                assert(!options.encode, 'Invalid encoding.', 400);
                content = buf2utf(buffer);
        }
    }
    base && !cache && length && r.status === 200
        && await ignoreErrFunc(async () => {
            return {
                touch: await touchPath(base),
                content: await fs.writeFile(cacheCont, buffer),
                meta: await writeJson(cacheMeta, {
                    url, requestHeaders: headers, responseHeaders,
                }),
            };
        });
    return {
        statusCode: r.status, statusText: r.statusText, length, mimeType,
        content, headers: responseHeaders, response: r,
        cache: r.status >= 200 && r.status < 400 ? { meta: cacheMeta, content: cacheCont } : null,
    };
};

export default get;
export {
    checkVersion,
    get,
    getCurrentIp,
    getCurrentPosition,
    getJson,
    getParsedHtml,
    getVersionOnNpm,
};
