import { get } from '../shot.mjs';
import { writeFile } from '../storage.mjs';

export const makeBoxes = async (lib) => {
    let style = (await get(
        'https://raw.githubusercontent.com/sindresorhus/cli-boxes/main/boxes.json'
    )).content;
    assert(style, 'Failed to fetch `boxes`.');
    style = JSON.parse(style);
    const boxes = [
        '// Based on: https://github.com/sindresorhus/cli-boxes'
    ];
    for (let i in style) {
        boxes.push(`const ${i} = ${JSON.stringify(style[i], null, 4)};`, '');
    }
    boxes.push(`export default round;`);
    boxes.push(`export {\n    ${Object.keys(style).join(',\n    ')},\n};`, '');
    await writeFile(`${lib}/boxes.mjs`, `${boxes.join('\n')}`);
};
