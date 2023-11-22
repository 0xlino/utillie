import { need } from "./utillie.mjs";

const _NEED = ['office-text-extractor', 'custommod2'];

let _officeParser;

const bensadd = (num1, num2) => {
    return num1 + num2;
}

const benneedtest = async () => {
    _officeParser || (_officeParser = (
        await need('office-text-extractor')
    )?.extractText);

    return _officeParser;
}

const sub = (num1, num2) => {
    return num1 - num2;
}

export {
    _NEED,
    bensadd, 
    benneedtest, 
    sub
}