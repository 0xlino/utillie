import { LOCAL_CHECKOUT_STORAGE_KEY } from './shopifyConsts.mjs';

function setLocalCheckout(checkout) {
    try {
        localStorage.setItem(LOCAL_CHECKOUT_STORAGE_KEY, JSON.stringify(checkout));
    } catch (error) { }
}

export {
    setLocalCheckout
}
