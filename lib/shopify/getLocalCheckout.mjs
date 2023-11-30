import { LOCAL_CHECKOUT_STORAGE_KEY } from './shopifyConsts.mjs';

function getLocalCheckout() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_CHECKOUT_STORAGE_KEY));
    } catch (error) {
        return null;
    }
}

export {
    getLocalCheckout
}
