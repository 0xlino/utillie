import {
    createHash,
} from 'crypto';


//TODO: Remove these
const _NEED = ['crypto'];

const defaultAlgorithm = 'sha256';

// algorithm = 'sha1', 'md5', 'sha256', 'sha512'...
const hash = (string, algorithm = defaultAlgorithm) =>
    createHash(algorithm).update(string).digest('hex');

export {
    _NEED,
    defaultAlgorithm, 
    hash as sha256,
    hash,
};
