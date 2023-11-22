import { promisify } from 'util';

const call = (f, ...a) => promisify(Array.isArray(f) ? f[0].bind(f[1]) : f)(...a);
