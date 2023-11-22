import { assertModule, getType, getFuncParams, ensureString } from '../utillie.mjs';

export const analyzeModule = (obj) => {
    assertModule(obj);
    const [keys, result] = [Object.getOwnPropertyNames(obj), {}];
    keys.sort().map(key => result[key] = {
        type: getType(obj[key]), ...Function.isFunction(obj[key])
            ? { params: getFuncParams(obj[key]) } : { value: ensureString(obj[key]) }
    });
    return result;
};
